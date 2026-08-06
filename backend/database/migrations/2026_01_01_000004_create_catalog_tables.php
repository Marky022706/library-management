<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('authors', function (Blueprint $table) {
            $table->id('author_id');
            $table->string('author_name', 150)->unique();
        });

        Schema::create('publishers', function (Blueprint $table) {
            $table->id('publisher_id');
            $table->string('publisher_name', 150)->unique();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id('category_id');
            $table->string('category_name', 100)->unique();
        });

        Schema::create('shelf_locations', function (Blueprint $table) {
            $table->id('shelf_location_id');
            $table->string('location_code', 50)->unique();
        });

        Schema::create('books', function (Blueprint $table) {
            $table->id('book_id');
            $table->string('title', 255)->index('idx_books_title');
            $table->foreignId('publisher_id')->nullable()->constrained('publishers', 'publisher_id')->onDelete('set null')->onUpdate('cascade');
            $table->foreignId('category_id')->constrained('categories', 'category_id')->onDelete('restrict')->onUpdate('cascade')->index('idx_books_category');
            $table->smallInteger('publication_year')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_image_url', 255)->nullable();
            $table->string('cataloging_source', 10)->default('Manual');
            $table->foreignId('added_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->timestamp('created_at')->useCurrent();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE books ADD CONSTRAINT check_publication_year CHECK (publication_year IS NULL OR publication_year > 0)");
            DB::statement("ALTER TABLE books ADD CONSTRAINT check_cataloging_source CHECK (cataloging_source IN ('AI','Manual'))");
        }

        Schema::create('book_authors', function (Blueprint $table) {
            $table->foreignId('book_id')->constrained('books', 'book_id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('author_id')->constrained('authors', 'author_id')->onDelete('cascade')->onUpdate('cascade');
            $table->primary(['book_id', 'author_id']);
        });

        Schema::create('book_copies', function (Blueprint $table) {
            $table->id('copy_id');
            $table->foreignId('book_id')->constrained('books', 'book_id')->onDelete('restrict')->onUpdate('cascade')->index('idx_book_copies_book_id');
            $table->foreignId('shelf_location_id')->constrained('shelf_locations', 'shelf_location_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('accession_number', 30)->unique();
            $table->string('qr_code_value', 100)->unique();
            $table->string('availability_status', 15)->default('Available')->index('idx_book_copies_availability');
            $table->string('condition_status', 20)->default('New')->index('idx_book_copies_condition');
            $table->date('acquisition_date')->useCurrent();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE book_copies ADD CONSTRAINT check_availability_status CHECK (availability_status IN ('Available','Borrowed','Reserved','Archived'))");
            DB::statement("ALTER TABLE book_copies ADD CONSTRAINT check_condition_status CHECK (condition_status IN ('New','Good','Fair','Damaged','Lost','Under Maintenance'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('book_copies');
        Schema::dropIfExists('book_authors');
        Schema::dropIfExists('books');
        Schema::dropIfExists('shelf_locations');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('publishers');
        Schema::dropIfExists('authors');
    }
};
