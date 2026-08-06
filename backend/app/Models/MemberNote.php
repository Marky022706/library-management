<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberNote extends Model
{
    use HasFactory;

    protected $primaryKey = 'note_id';
    public $timestamps = false;

    protected $fillable = [
        'member_id',
        'created_by',
        'note_text',
        'created_at',
    ];

    public function member()
    {
        return $this->belongsTo(User::class, 'member_id', 'user_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'user_id');
    }
}
