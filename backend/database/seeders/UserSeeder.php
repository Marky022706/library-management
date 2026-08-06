<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\User;
use App\Models\LibraryCard;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::where('role_name', 'Super Admin')->first();
        $adminRole = Role::where('role_name', 'Admin')->first();
        $librarianRole = Role::where('role_name', 'Librarian')->first();
        $memberRole = Role::where('role_name', 'Member')->first();

        $users = [
            [
                'role_id' => $superAdminRole->role_id,
                'school_id' => 'SA-2026-0001',
                'first_name' => 'System',
                'last_name' => 'SuperAdmin',
                'email' => 'superadmin@balingasag.gov.ph',
                'password_hash' => Hash::make('password123'),
                'phone_number' => '09170000001',
                'account_status' => 'Active',
            ],
            [
                'role_id' => $adminRole->role_id,
                'school_id' => 'ADM-2026-0002',
                'first_name' => 'Library',
                'last_name' => 'Admin',
                'email' => 'admin@balingasag.gov.ph',
                'password_hash' => Hash::make('password123'),
                'phone_number' => '09170000002',
                'account_status' => 'Active',
            ],
            [
                'role_id' => $librarianRole->role_id,
                'school_id' => 'LIB-2026-0003',
                'first_name' => 'Maria',
                'last_name' => 'Librarian',
                'email' => 'librarian@balingasag.gov.ph',
                'password_hash' => Hash::make('password123'),
                'phone_number' => '09170000003',
                'account_status' => 'Active',
            ],
            [
                'role_id' => $memberRole->role_id,
                'school_id' => 'MEM-2026-0004',
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'email' => 'member@balingasag.gov.ph',
                'password_hash' => Hash::make('password123'),
                'phone_number' => '09170000004',
                'account_status' => 'Active',
            ],
            [
                'role_id' => $memberRole->role_id,
                'school_id' => 'DEMO-2026-0005',
                'first_name' => 'Demo',
                'last_name' => 'Member',
                'email' => 'demo@balingasag.gov.ph',
                'password_hash' => Hash::make('password123'),
                'phone_number' => '09170000005',
                'account_status' => 'Active',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            if (!$user->libraryCard) {
                LibraryCard::create([
                    'user_id' => $user->user_id,
                    'qr_code_value' => 'BPL-CARD-' . strtoupper(Str::random(10)),
                    'issued_date' => now()->toDateString(),
                    'card_status' => 'Active',
                ]);
            }
        }
    }
}

