<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('digital_books', function (Blueprint $table) {
            $table->id('digital_book_id');
            $table->foreignId('book_id')->constrained('books', 'book_id')->onDelete('cascade')->onUpdate('cascade');
            $table->string('file_url', 255);
            $table->string('file_format', 10);
            $table->foreignId('uploaded_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->timestamp('uploaded_at')->useCurrent();
            $table->unique(['book_id', 'file_format']);
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE digital_books ADD CONSTRAINT check_file_format CHECK (file_format IN ('PDF','ePub'))");
        }

        Schema::create('digital_reading_history', function (Blueprint $table) {
            $table->id('reading_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('digital_book_id')->constrained('digital_books', 'digital_book_id')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamp('accessed_at')->useCurrent();
            $table->integer('duration_seconds')->nullable();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE digital_reading_history ADD CONSTRAINT check_duration_seconds CHECK (duration_seconds IS NULL OR duration_seconds >= 0)");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('digital_reading_history');
        Schema::dropIfExists('digital_books');
    }
};
