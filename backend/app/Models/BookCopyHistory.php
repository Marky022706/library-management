<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookCopyHistory extends Model
{
    use HasFactory;

    protected $table = 'book_copy_history';
    protected $primaryKey = 'history_id';
    public $timestamps = false;

    protected $fillable = [
        'copy_id',
        'event_type',
        'old_value',
        'new_value',
        'performed_by',
        'archive_request_id',
        'event_date',
        'notes',
    ];

    public function bookCopy()
    {
        return $this->belongsTo(BookCopy::class, 'copy_id', 'copy_id');
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by', 'user_id');
    }

    public function archiveRequest()
    {
        return $this->belongsTo(BookArchiveRequest::class, 'archive_request_id', 'request_id');
    }
}
