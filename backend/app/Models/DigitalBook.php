<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DigitalBook extends Model
{
    use HasFactory;

    protected $primaryKey = 'digital_book_id';
    public $timestamps = false;

    protected $fillable = [
        'book_id',
        'file_url',
        'file_format',
        'uploaded_by',
        'uploaded_at',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id', 'book_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }

    public function readingHistory()
    {
        return $this->hasMany(DigitalReadingHistory::class, 'digital_book_id', 'digital_book_id');
    }
}
