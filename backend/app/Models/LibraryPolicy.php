<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LibraryPolicy extends Model
{
    use HasFactory;

    protected $primaryKey = 'policy_id';
    public $timestamps = false;

    protected $fillable = [
        'max_books_per_member',
        'loan_duration_days',
        'reservation_period_days',
        'max_renewals',
        'opening_time',
        'closing_time',
        'updated_by',
        'updated_at',
    ];

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'user_id');
    }
}
