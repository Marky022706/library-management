<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PublisherResource;
use App\Http\Resources\AuthorResource;
use App\Http\Resources\ShelfLocationResource;
use App\Models\Book;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\Author;
use App\Models\ShelfLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Book::with(['category', 'publisher', 'authors', 'copies', 'digitalBooks']);

        // Search title, description, or author name
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm)
                  ->orWhereHas('authors', function ($aq) use ($searchTerm) {
                      $aq->where('author_name', 'like', $searchTerm);
                  });
            });
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by availability
        if ($request->filled('available_only') && $request->available_only == 'true') {
            $query->whereHas('copies', function ($cq) {
                $cq->where('availability_status', 'Available');
            });
        }

        $perPage = $request->input('per_page', 12);
        $books = $query->orderBy('book_id', 'desc')->paginate($perPage);

        return response()->json([
            'data' => BookResource::collection($books->items()),
            'meta' => [
                'current_page' => $books->currentPage(),
                'last_page' => $books->lastPage(),
                'per_page' => $books->perPage(),
                'total' => $books->total(),
            ],
        ]);
    }

    public function show($id): JsonResponse
    {
        $book = Book::with(['category', 'publisher', 'authors', 'copies.shelfLocation', 'digitalBooks', 'notes.creator'])
                    ->find($id);

        if (!$book) {
            return response()->json(['message' => 'Book not found'], 404);
        }

        return response()->json([
            'data' => new BookResource($book),
        ]);
    }

    public function categories(): JsonResponse
    {
        $categories = Category::orderBy('category_name')->get();
        return response()->json(['data' => CategoryResource::collection($categories)]);
    }

    public function publishers(): JsonResponse
    {
        $publishers = Publisher::orderBy('publisher_name')->get();
        return response()->json(['data' => PublisherResource::collection($publishers)]);
    }

    public function authors(): JsonResponse
    {
        $authors = Author::orderBy('author_name')->get();
        return response()->json(['data' => AuthorResource::collection($authors)]);
    }

    public function shelfLocations(): JsonResponse
    {
        $shelves = ShelfLocation::orderBy('location_code')->get();
        return response()->json(['data' => ShelfLocationResource::collection($shelves)]);
    }
}
