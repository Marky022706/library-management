<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id('role_id');
            $table->string('role_name', 20)->unique();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE roles ADD CONSTRAINT check_role_name CHECK (role_name IN ('Super Admin','Admin','Librarian','Member'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
