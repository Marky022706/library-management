<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BorrowTransaction extends Model
{
    use HasFactory;

    protected $primaryKey = 'transaction_id';
    public $timestamps = false;

    protected $fillable = [
        'copy_id',
        'user_id',
        'id_document_url',
        'request_date',
        'approved_by',
        'approval_date',
        'borrow_date',
        'due_date',
        'return_date',
        'renewal_count',
        'status',
    ];

    public function bookCopy()
    {
        return $this->belongsTo(BookCopy::class, 'copy_id', 'copy_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by', 'user_id');
    }

    public function reservation()
    {
        return $this->hasOne(Reservation::class, 'fulfilled_by_transaction_id', 'transaction_id');
    }
}
