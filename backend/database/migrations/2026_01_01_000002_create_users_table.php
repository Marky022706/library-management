<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->foreignId('role_id')->constrained('roles', 'role_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('school_id', 30)->unique()->nullable();
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('email', 100)->unique();
            $table->string('password_hash', 255);
            $table->string('phone_number', 20)->nullable();
            $table->string('account_status', 15)->default('Active');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE users ADD CONSTRAINT check_account_status CHECK (account_status IN ('Active','Suspended','Inactive'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
