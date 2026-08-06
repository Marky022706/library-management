<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventorySession extends Model
{
    use HasFactory;

    protected $primaryKey = 'session_id';
    public $timestamps = false;

    protected $fillable = [
        'conducted_by',
        'start_date',
        'end_date',
        'status',
    ];

    public function conductor()
    {
        return $this->belongsTo(User::class, 'conducted_by', 'user_id');
    }

    public function scans()
    {
        return $this->hasMany(InventoryScan::class, 'session_id', 'session_id');
    }
}
