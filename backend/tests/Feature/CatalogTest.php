<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_can_fetch_catalog_list()
    {
        $response = $this->getJson('/api/catalog');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data', 'meta']);
    }

    public function test_can_search_catalog_by_title()
    {
        $response = $this->getJson('/api/catalog?search=Rizal');

        $response->assertStatus(200);
    }

    public function test_librarian_can_create_new_book()
    {
        $librarian = User::whereHas('role', function ($q) {
            $q->where('role_name', 'Librarian');
        })->first();

        $category = \App\Models\Category::first();
        $author = \App\Models\Author::first();
        $shelf = \App\Models\ShelfLocation::first();

        $response = $this->actingAs($librarian, 'sanctum')
                         ->postJson('/api/admin/books', [
                             'title' => 'Florante at Laura',
                             'category_id' => $category->category_id,
                             'publication_year' => 1838,
                             'description' => 'Classic epic poem written by Francisco Balagtas.',
                             'author_ids' => [$author->author_id],
                             'initial_copies' => 2,
                             'shelf_location_id' => $shelf->shelf_location_id,
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'data']);

        $this->assertDatabaseHas('books', ['title' => 'Florante at Laura']);
    }
}
