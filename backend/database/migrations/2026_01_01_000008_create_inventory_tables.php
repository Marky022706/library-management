<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_sessions', function (Blueprint $table) {
            $table->id('session_id');
            $table->foreignId('conducted_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->timestamp('start_date')->useCurrent();
            $table->timestamp('end_date')->nullable();
            $table->string('status', 15)->default('In Progress');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE inventory_sessions ADD CONSTRAINT check_inventory_status CHECK (status IN ('In Progress','Completed','Cancelled'))");
            DB::statement("ALTER TABLE inventory_sessions ADD CONSTRAINT check_inventory_date CHECK (end_date IS NULL OR end_date >= start_date)");
        }

        Schema::create('inventory_scans', function (Blueprint $table) {
            $table->id('scan_id');
            $table->foreignId('session_id')->constrained('inventory_sessions', 'session_id')->onDelete('cascade')->onUpdate('cascade')->index('idx_inventory_scans_session');
            $table->foreignId('copy_id')->constrained('book_copies', 'copy_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('expected_condition', 20);
            $table->string('found_condition', 20);
            $table->boolean('is_discrepancy')->default(false);
            $table->foreignId('scanned_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->timestamp('scanned_at')->useCurrent();

            $table->unique(['session_id', 'copy_id']);
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE inventory_scans ADD CONSTRAINT check_expected_condition CHECK (expected_condition IN ('New','Good','Fair','Damaged','Lost','Under Maintenance'))");
            DB::statement("ALTER TABLE inventory_scans ADD CONSTRAINT check_found_condition CHECK (found_condition IN ('New','Good','Fair','Damaged','Lost','Under Maintenance'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_scans');
        Schema::dropIfExists('inventory_sessions');
    }
};
