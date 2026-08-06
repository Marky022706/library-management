<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookRequest extends Model
{
    use HasFactory;

    protected $primaryKey = 'request_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'requested_title',
        'requested_author',
        'reason',
        'request_date',
        'status',
        'acquired_book_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function acquiredBook()
    {
        return $this->belongsTo(Book::class, 'acquired_book_id', 'book_id');
    }
}
