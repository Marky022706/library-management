<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Fiction & Literature',
            'Science & Technology',
            'History & Biography',
            'Philippine Literature & Local History',
            'Children & Young Adult',
            'Philosophy & Social Sciences',
            'Reference & Encyclopedias',
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['category_name' => $cat]);
        }
    }
}
