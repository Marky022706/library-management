<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookArchiveRequest extends Model
{
    use HasFactory;

    protected $primaryKey = 'request_id';
    public $timestamps = false;

    protected $fillable = [
        'copy_id',
        'requested_by',
        'reason',
        'request_date',
        'reviewed_by',
        'review_date',
        'status',
    ];

    public function bookCopy()
    {
        return $this->belongsTo(BookCopy::class, 'copy_id', 'copy_id');
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by', 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by', 'user_id');
    }
}
