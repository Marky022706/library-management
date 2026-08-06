<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('library_cards', function (Blueprint $table) {
            $table->id('card_id');
            $table->foreignId('user_id')->unique()->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->string('qr_code_value', 100)->unique();
            $table->date('issued_date')->useCurrent();
            $table->string('card_status', 15)->default('Active');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE library_cards ADD CONSTRAINT check_card_status CHECK (card_status IN ('Active','Lost','Expired','Revoked'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('library_cards');
    }
};
