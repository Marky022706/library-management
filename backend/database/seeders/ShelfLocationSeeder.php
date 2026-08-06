<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ShelfLocation;

class ShelfLocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            'Shelf A-1 (Fiction)',
            'Shelf A-2 (Fiction)',
            'Shelf B-1 (Science)',
            'Shelf C-1 (Philippine Collection)',
            'Shelf D-1 (Reference)',
            'Children Corner - Shelf 1',
        ];

        foreach ($locations as $loc) {
            ShelfLocation::firstOrCreate(['location_code' => $loc]);
        }
    }
}
