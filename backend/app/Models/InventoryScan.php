<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryScan extends Model
{
    use HasFactory;

    protected $primaryKey = 'scan_id';
    public $timestamps = false;

    protected $fillable = [
        'session_id',
        'copy_id',
        'expected_condition',
        'found_condition',
        'is_discrepancy',
        'scanned_by',
        'scanned_at',
    ];

    public function session()
    {
        return $this->belongsTo(InventorySession::class, 'session_id', 'session_id');
    }

    public function copy()
    {
        return $this->belongsTo(BookCopy::class, 'copy_id', 'copy_id');
    }

    public function scanner()
    {
        return $this->belongsTo(User::class, 'scanned_by', 'user_id');
    }
}
