<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('borrow_transactions', function (Blueprint $table) {
            $table->id('transaction_id');
            $table->foreignId('copy_id')->constrained('book_copies', 'copy_id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('id_document_url', 255);
            $table->timestamp('request_date')->useCurrent();
            $table->foreignId('approved_by')->nullable()->constrained('users', 'user_id')->onDelete('set null')->onUpdate('cascade');
            $table->timestamp('approval_date')->nullable();
            $table->date('borrow_date')->nullable();
            $table->date('due_date')->nullable();
            $table->date('return_date')->nullable();
            $table->smallInteger('renewal_count')->default(0);
            $table->string('status', 15)->default('Pending');

            $table->index(['user_id', 'status'], 'idx_borrow_user_status');
            $table->index(['copy_id', 'status'], 'idx_borrow_copy_status');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE borrow_transactions ADD CONSTRAINT check_renewal_count CHECK (renewal_count >= 0)");
            DB::statement("ALTER TABLE borrow_transactions ADD CONSTRAINT check_borrow_status CHECK (status IN ('Pending','Approved','Rejected','Returned','Overdue'))");
            DB::statement("ALTER TABLE borrow_transactions ADD CONSTRAINT check_borrow_due_date CHECK (due_date IS NULL OR borrow_date IS NULL OR due_date >= borrow_date)");
        }

        Schema::create('reservations', function (Blueprint $table) {
            $table->id('reservation_id');
            $table->foreignId('book_id')->constrained('books', 'book_id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->timestamp('reservation_date')->useCurrent();
            $table->date('expiry_date')->nullable();
            $table->string('status', 15)->default('Pending');
            $table->foreignId('fulfilled_by_transaction_id')->nullable()->unique()->constrained('borrow_transactions', 'transaction_id')->onDelete('set null')->onUpdate('cascade');

            $table->index(['book_id', 'status'], 'idx_reservations_book_status');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE reservations ADD CONSTRAINT check_reservation_status CHECK (status IN ('Pending','Fulfilled','Cancelled','Expired'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('borrow_transactions');
    }
};
