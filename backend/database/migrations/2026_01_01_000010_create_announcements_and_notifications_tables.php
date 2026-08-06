<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id('announcement_id');
            $table->foreignId('created_by')->constrained('users', 'user_id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('title', 150);
            $table->text('content');
            $table->timestamp('publish_date')->useCurrent();
            $table->timestamp('expiry_date')->nullable();
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE announcements ADD CONSTRAINT check_announcement_expiry CHECK (expiry_date IS NULL OR expiry_date > publish_date)");
        }

        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade')->onUpdate('cascade');
            $table->string('notification_type', 20);
            $table->string('message', 255);
            $table->foreignId('related_transaction_id')->nullable()->constrained('borrow_transactions', 'transaction_id')->onDelete('set null')->onUpdate('cascade');
            $table->foreignId('related_reservation_id')->nullable()->constrained('reservations', 'reservation_id')->onDelete('set null')->onUpdate('cascade');
            $table->foreignId('related_announcement_id')->nullable()->constrained('announcements', 'announcement_id')->onDelete('set null')->onUpdate('cascade');
            $table->boolean('is_read')->default(false);
            $table->timestamp('created_at')->useCurrent();

            $table->index(['user_id', 'is_read'], 'idx_notifications_user_read');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE notifications ADD CONSTRAINT check_notification_type CHECK (notification_type IN ('Due Date','Reservation','Announcement','Account','Approval'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('announcements');
    }
};
