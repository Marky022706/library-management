<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookStoreRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookController extends Controller
{
    public function store(BookStoreRequest $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isLibrarian()) {
            return response()->json(['message' => 'Unauthorized. Librarian role required.'], 403);
        }

        $book = Book::create([
            'title' => $request->title,
            'category_id' => $request->category_id,
            'publisher_id' => $request->publisher_id,
            'publication_year' => $request->publication_year,
            'description' => $request->description,
            'cover_image_url' => $request->cover_image_url,
            'cataloging_source' => $request->cataloging_source ?? 'Manual',
            'added_by' => $user->user_id,
        ]);

        if ($request->has('author_ids')) {
            $book->authors()->sync($request->author_ids);
        }

        // Auto-generate initial copies if requested
        $copyCount = $request->input('initial_copies', 1);
        $shelfId = $request->input('shelf_location_id');

        if ($shelfId && $copyCount > 0) {
            $cleanTitlePrefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $book->title), 0, 4));
            for ($i = 1; $i <= $copyCount; $i++) {
                $accession = 'ACC-' . $cleanTitlePrefix . '-' . strtoupper(Str::random(5));
                BookCopy::create([
                    'book_id' => $book->book_id,
                    'shelf_location_id' => $shelfId,
                    'accession_number' => $accession,
                    'qr_code_value' => 'QR-COPY-' . $accession,
                    'availability_status' => 'Available',
                    'condition_status' => 'New',
                    'acquisition_date' => now()->toDateString(),
                ]);
            }
        }

        $book->load(['category', 'publisher', 'authors', 'copies.shelfLocation']);

        return response()->json([
            'message' => 'Book created successfully in catalog!',
            'data' => new BookResource($book),
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        if (!$user->isLibrarian()) {
            return response()->json(['message' => 'Unauthorized. Librarian role required.'], 403);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,category_id',
            'publisher_id' => 'nullable|exists:publishers,publisher_id',
            'publication_year' => 'nullable|integer',
            'description' => 'nullable|string',
            'cover_image_url' => 'nullable|string|max:255',
            'author_ids' => 'nullable|array',
        ]);

        $book->update([
            'title' => $request->title,
            'category_id' => $request->category_id,
            'publisher_id' => $request->publisher_id,
            'publication_year' => $request->publication_year,
            'description' => $request->description,
            'cover_image_url' => $request->cover_image_url,
        ]);

        if ($request->has('author_ids')) {
            $book->authors()->sync($request->author_ids);
        }

        $book->load(['category', 'publisher', 'authors', 'copies']);

        return response()->json([
            'message' => 'Book catalog details updated successfully!',
            'data' => new BookResource($book),
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized. Admin role required to delete catalog entries.'], 403);
        }

        $book = Book::find($id);
        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        $book->delete();

        return response()->json([
            'message' => 'Book entry removed from catalog.',
        ]);
    }
}
