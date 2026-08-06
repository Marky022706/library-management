<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('generated_reports', function (Blueprint $table) {
            $table->id('report_id');
            $table->foreignId('generated_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('report_type', 50);
            $table->string('file_format', 10);
            $table->string('file_url', 255);
            $table->timestamp('generated_at')->useCurrent();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE generated_reports ADD CONSTRAINT check_report_format CHECK (file_format IN ('PDF','Excel'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('generated_reports');
    }
};
