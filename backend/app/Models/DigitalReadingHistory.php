<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DigitalReadingHistory extends Model
{
    use HasFactory;

    protected $table = 'digital_reading_history';
    protected $primaryKey = 'reading_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'digital_book_id',
        'accessed_at',
        'duration_seconds',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function digitalBook()
    {
        return $this->belongsTo(DigitalBook::class, 'digital_book_id', 'digital_book_id');
    }
}
