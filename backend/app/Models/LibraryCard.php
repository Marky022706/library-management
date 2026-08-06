<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LibraryCard extends Model
{
    use HasFactory;

    protected $primaryKey = 'card_id';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'qr_code_value',
        'issued_date',
        'card_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
