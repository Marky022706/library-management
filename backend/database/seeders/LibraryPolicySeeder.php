<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LibraryPolicy;

class LibraryPolicySeeder extends Seeder
{
    public function run(): void
    {
        if (LibraryPolicy::count() === 0) {
            LibraryPolicy::create([
                'max_books_per_member' => 3,
                'loan_duration_days' => 7,
                'reservation_period_days' => 3,
                'max_renewals' => 1,
                'opening_time' => '08:00',
                'closing_time' => '17:00',
            ]);
        }
    }
}
