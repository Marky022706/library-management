<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id('attendance_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamp('time_in');
            $table->timestamp('time_out')->nullable();

            $table->index(['user_id', 'time_in'], 'idx_attendance_user_date');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE attendance_logs ADD CONSTRAINT check_attendance_time CHECK (time_out IS NULL OR time_out > time_in)");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};
