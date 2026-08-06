<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\LibraryCard;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $memberRole = Role::where('role_name', 'Member')->firstOrFail();

        $user = User::create([
            'role_id' => $memberRole->role_id,
            'school_id' => $request->school_id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => strtolower($request->email),
            'password_hash' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'account_status' => 'Active',
        ]);

        $card = LibraryCard::create([
            'user_id' => $user->user_id,
            'qr_code_value' => 'BPL-CARD-' . strtoupper(Str::random(10)),
            'issued_date' => now()->toDateString(),
            'card_status' => 'Active',
        ]);

        $user->load(['role', 'libraryCard']);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful! Digital library card issued.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::with(['role', 'libraryCard'])->where('email', strtolower($request->email))->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'message' => 'Invalid email or password credentials.',
            ], 401);
        }

        if ($user->account_status !== 'Active') {
            return response()->json([
                'message' => "Your account status is currently '{$user->account_status}'. Please contact library administration.",
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = User::with(['role', 'libraryCard'])->find($request->user()->user_id);

        return response()->json([
            'user' => $user,
        ]);
    }

    public function card(Request $request): JsonResponse
    {
        $user = $request->user();
        $card = LibraryCard::where('user_id', $user->user_id)->first();

        if (!$card) {
            return response()->json([
                'message' => 'No active library card found for this account.',
            ], 404);
        }

        return response()->json([
            'user_name' => "{$user->first_name} {$user->last_name}",
            'email' => $user->email,
            'role' => $user->role->role_name ?? 'Member',
            'card' => $card,
        ]);
    }
}
