<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $primaryKey = 'notification_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'notification_type',
        'message',
        'related_transaction_id',
        'related_reservation_id',
        'related_announcement_id',
        'is_read',
        'created_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function transaction()
    {
        return $this->belongsTo(BorrowTransaction::class, 'related_transaction_id', 'transaction_id');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'related_reservation_id', 'reservation_id');
    }

    public function announcement()
    {
        return $this->belongsTo(Announcement::class, 'related_announcement_id', 'announcement_id');
    }
}
