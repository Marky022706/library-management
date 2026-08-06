<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            LibraryPolicySeeder::class,
            CategorySeeder::class,
            ShelfLocationSeeder::class,
            UserSeeder::class,
            BookSeeder::class,
        ]);
    }
}
