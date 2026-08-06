<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id('log_id');
            $table->foreignId('user_id')->nullable()->constrained('users', 'user_id')->onDelete('set null')->onUpdate('cascade');
            $table->string('action_type', 50);
            $table->string('entity_type', 50);
            $table->integer('entity_id')->nullable();
            $table->string('description', 500)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamp('performed_at')->useCurrent();

            $table->index(['entity_type', 'entity_id'], 'idx_audit_entity');
        });

        Schema::create('book_notes', function (Blueprint $table) {
            $table->id('note_id');
            $table->foreignId('book_id')->constrained('books', 'book_id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('created_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->text('note_text');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('member_notes', function (Blueprint $table) {
            $table->id('note_id');
            $table->foreignId('member_id')->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('created_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->text('note_text');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('book_archive_requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->foreignId('copy_id')->constrained('book_copies', 'copy_id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignId('requested_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('reason', 500);
            $table->timestamp('request_date')->useCurrent();
            $table->foreignId('reviewed_by')->nullable()->constrained('users', 'user_id')->onDelete('set null')->onUpdate('cascade');
            $table->timestamp('review_date')->nullable();
            $table->string('status', 15)->default('Pending');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE book_archive_requests ADD CONSTRAINT check_archive_status CHECK (status IN ('Pending','Approved','Rejected'))");
        }

        Schema::create('book_copy_history', function (Blueprint $table) {
            $table->id('history_id');
            $table->foreignId('copy_id')->constrained('book_copies', 'copy_id')->onDelete('cascade')->onUpdate('cascade');
            $table->string('event_type', 20);
            $table->string('old_value', 100)->nullable();
            $table->string('new_value', 100)->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users', 'user_id')->onDelete('set null')->onUpdate('cascade');
            $table->foreignId('archive_request_id')->nullable()->constrained('book_archive_requests', 'request_id')->onDelete('set null')->onUpdate('cascade');
            $table->timestamp('event_date')->useCurrent();
            $table->string('notes', 500)->nullable();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE book_copy_history ADD CONSTRAINT check_copy_event_type CHECK (event_type IN ('Borrowed','Returned','Repaired','Relocated','Status Updated','Archived','Restored'))");
        }

        Schema::create('library_policies', function (Blueprint $table) {
            $table->id('policy_id');
            $table->integer('max_books_per_member')->default(3);
            $table->integer('loan_duration_days')->default(7);
            $table->integer('reservation_period_days')->default(3);
            $table->integer('max_renewals')->default(1);
            $table->time('opening_time')->default('08:00');
            $table->time('closing_time')->default('17:00');
            $table->foreignId('updated_by')->nullable()->constrained('users', 'user_id')->onDelete('set null')->onUpdate('cascade');
            $table->timestamp('updated_at')->useCurrent();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE library_policies ADD CONSTRAINT check_max_books CHECK (max_books_per_member > 0)");
            DB::statement("ALTER TABLE library_policies ADD CONSTRAINT check_loan_duration CHECK (loan_duration_days > 0)");
            DB::statement("ALTER TABLE library_policies ADD CONSTRAINT check_reservation_period CHECK (reservation_period_days > 0)");
            DB::statement("ALTER TABLE library_policies ADD CONSTRAINT check_max_renewals CHECK (max_renewals >= 0)");
            DB::statement("ALTER TABLE library_policies ADD CONSTRAINT check_policy_times CHECK (closing_time > opening_time)");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('library_policies');
        Schema::dropIfExists('book_copy_history');
        Schema::dropIfExists('book_archive_requests');
        Schema::dropIfExists('member_notes');
        Schema::dropIfExists('book_notes');
        Schema::dropIfExists('audit_logs');
    }
};
