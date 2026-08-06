<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Author;
use App\Models\Publisher;
use App\Models\Category;
use App\Models\ShelfLocation;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\User;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $librarian = User::whereHas('role', function ($q) {
            $q->whereIn('role_name', ['Librarian', 'Admin', 'Super Admin']);
        })->first();

        if (!$librarian) return;

        // Authors
        $aRizal = Author::firstOrCreate(['author_name' => 'José Rizal']);
        $aJoaquin = Author::firstOrCreate(['author_name' => 'Nick Joaquin']);
        $aOrwell = Author::firstOrCreate(['author_name' => 'George Orwell']);
        $aHawking = Author::firstOrCreate(['author_name' => 'Stephen Hawking']);
        $aBulosan = Author::firstOrCreate(['author_name' => 'Carlos Bulosan']);

        // Publishers
        $pAteneo = Publisher::firstOrCreate(['publisher_name' => 'Ateneo de Manila University Press']);
        $pPenguin = Publisher::firstOrCreate(['publisher_name' => 'Penguin Classics']);
        $pBantam = Publisher::firstOrCreate(['publisher_name' => 'Bantam Books']);
        $pAnvil = Publisher::firstOrCreate(['publisher_name' => 'Anvil Publishing']);

        // Categories & Shelves
        $catPhil = Category::where('category_name', 'Philippine Literature & Local History')->first();
        $catFiction = Category::where('category_name', 'Fiction & Literature')->first();
        $catSci = Category::where('category_name', 'Science & Technology')->first();

        $shelfA = ShelfLocation::firstOrCreate(['location_code' => 'Shelf A-1 (Fiction)']);
        $shelfC = ShelfLocation::firstOrCreate(['location_code' => 'Shelf C-1 (Philippine Collection)']);
        $shelfB = ShelfLocation::firstOrCreate(['location_code' => 'Shelf B-1 (Science)']);

        $sampleBooks = [
            [
                'title' => 'Noli Me Tángere',
                'publisher_id' => $pAteneo->publisher_id,
                'category_id' => $catPhil->category_id,
                'publication_year' => 1887,
                'description' => 'A landmark novel portraying nineteenth-century Philippine society under Spanish colonial rule.',
                'cover_image_url' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
                'authors' => [$aRizal->author_id],
                'shelf' => $shelfC->shelf_location_id,
                'prefix' => 'NOLI',
            ],
            [
                'title' => 'El Filibusterismo',
                'publisher_id' => $pAteneo->publisher_id,
                'category_id' => $catPhil->category_id,
                'publication_year' => 1891,
                'description' => 'The sequel to Noli Me Tángere, focusing on revolution and revenge.',
                'cover_image_url' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
                'authors' => [$aRizal->author_id],
                'shelf' => $shelfC->shelf_location_id,
                'prefix' => 'ELFILI',
            ],
            [
                'title' => 'America Is in the Heart',
                'publisher_id' => $pAnvil->publisher_id,
                'category_id' => $catPhil->category_id,
                'publication_year' => 1946,
                'description' => 'Autobiographical novel detailing the Filipino migrant experience in America.',
                'cover_image_url' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80',
                'authors' => [$aBulosan->author_id],
                'shelf' => $shelfC->shelf_location_id,
                'prefix' => 'AMER',
            ],
            [
                'title' => '1984',
                'publisher_id' => $pPenguin->publisher_id,
                'category_id' => $catFiction->category_id,
                'publication_year' => 1949,
                'description' => 'Classic dystopian novel depicting totalitarian surveillance state control.',
                'cover_image_url' => 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=400&q=80',
                'authors' => [$aOrwell->author_id],
                'shelf' => $shelfA->shelf_location_id,
                'prefix' => '1984',
            ],
            [
                'title' => 'A Brief History of Time',
                'publisher_id' => $pBantam->publisher_id,
                'category_id' => $catSci->category_id,
                'publication_year' => 1988,
                'description' => 'Popular science book on cosmology, black holes, big bang, and general relativity.',
                'cover_image_url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
                'authors' => [$aHawking->author_id],
                'shelf' => $shelfB->shelf_location_id,
                'prefix' => 'TIME',
            ],
            [
                'title' => 'The Woman Who Had Two Navels',
                'publisher_id' => $pAnvil->publisher_id,
                'category_id' => $catPhil->category_id,
                'publication_year' => 1961,
                'description' => 'A classic Philippine post-war masterpiece examining identity and history.',
                'cover_image_url' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80',
                'authors' => [$aJoaquin->author_id],
                'shelf' => $shelfC->shelf_location_id,
                'prefix' => 'NAVEL',
            ],
        ];

        foreach ($sampleBooks as $bData) {
            $book = Book::create([
                'title' => $bData['title'],
                'publisher_id' => $bData['publisher_id'],
                'category_id' => $bData['category_id'],
                'publication_year' => $bData['publication_year'],
                'description' => $bData['description'],
                'cover_image_url' => $bData['cover_image_url'],
                'cataloging_source' => 'Manual',
                'added_by' => $librarian->user_id,
            ]);

            $book->authors()->sync($bData['authors']);

            // Add 2 copies per book
            for ($i = 1; $i <= 2; $i++) {
                $accession = 'ACC-' . $bData['prefix'] . '-' . str_pad($i, 3, '0', STR_PAD_LEFT);
                BookCopy::create([
                    'book_id' => $book->book_id,
                    'shelf_location_id' => $bData['shelf'],
                    'accession_number' => $accession,
                    'qr_code_value' => 'QR-COPY-' . $accession,
                    'availability_status' => 'Available',
                    'condition_status' => 'Good',
                    'acquisition_date' => now()->toDateString(),
                ]);
            }
        }
    }
}
