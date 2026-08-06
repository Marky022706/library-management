<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookCopy extends Model
{
    use HasFactory;

    protected $primaryKey = 'copy_id';
    public $timestamps = false;

    protected $fillable = [
        'book_id',
        'shelf_location_id',
        'accession_number',
        'qr_code_value',
        'availability_status',
        'condition_status',
        'acquisition_date',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class, 'book_id', 'book_id');
    }

    public function shelfLocation()
    {
        return $this->belongsTo(ShelfLocation::class, 'shelf_location_id', 'shelf_location_id');
    }

    public function borrowTransactions()
    {
        return $this->hasMany(BorrowTransaction::class, 'copy_id', 'copy_id');
    }

    public function history()
    {
        return $this->hasMany(BookCopyHistory::class, 'copy_id', 'copy_id');
    }
}
