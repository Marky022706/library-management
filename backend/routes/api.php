<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\BookController;

/*
|--------------------------------------------------------------------------
| API Routes — Balingasag Public Library Management System
|--------------------------------------------------------------------------
*/

// Public / Member Authentication
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/card', [AuthController::class, 'card']);
    });
});

// Catalog Search & Metadata Dropdowns
Route::get('/catalog', [CatalogController::class, 'index']);
Route::get('/catalog/{id}', [CatalogController::class, 'show']);
Route::get('/categories', [CatalogController::class, 'categories']);
Route::get('/publishers', [CatalogController::class, 'publishers']);
Route::get('/authors', [CatalogController::class, 'authors']);
Route::get('/shelf-locations', [CatalogController::class, 'shelfLocations']);

// Staff / Admin Catalog Management
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
});
