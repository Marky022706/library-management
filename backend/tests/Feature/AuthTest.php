<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_user_can_login_with_valid_credentials()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'member@balingasag.gov.ph',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'user', 'token']);
    }

    public function test_user_cannot_login_with_invalid_password()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'member@balingasag.gov.ph',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    public function test_new_member_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'first_name' => 'Ana',
            'last_name' => 'Santos',
            'email' => 'ana.santos@gmail.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone_number' => '09181234567',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'user', 'token']);

        $this->assertDatabaseHas('users', ['email' => 'ana.santos@gmail.com']);
        $this->assertDatabaseHas('library_cards', ['card_status' => 'Active']);
    }
}
