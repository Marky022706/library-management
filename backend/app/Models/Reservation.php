<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $primaryKey = 'reservation_id';
    public $timestamps = false;

    protected $fillable = [
        'book_id',
        'user_id',
        'reservation_date',
        'expiry_date',
        'status',
        'fulfilled_by_transaction_id',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id', 'book_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function fulfilledTransaction()
    {
        return $this->belongsTo(BorrowTransaction::class, 'fulfilled_by_transaction_id', 'transaction_id');
    }
}
