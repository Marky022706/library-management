<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('book_id')->constrained('books', 'book_id')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamp('added_at')->useCurrent();

            $table->primary(['user_id', 'book_id']);
        });

        Schema::create('book_requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('requested_title', 255);
            $table->string('requested_author', 150)->nullable();
            $table->text('reason')->nullable();
            $table->timestamp('request_date')->useCurrent();
            $table->string('status', 15)->default('Pending');
            $table->foreignId('acquired_book_id')->nullable()->constrained('books', 'book_id')->onDelete('set null')->onUpdate('cascade');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE book_requests ADD CONSTRAINT check_request_status CHECK (status IN ('Pending','Approved','Rejected','Acquired'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('book_requests');
        Schema::dropIfExists('favorites');
    }
};
