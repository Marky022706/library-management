<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneratedReport extends Model
{
    use HasFactory;

    protected $primaryKey = 'report_id';
    public $timestamps = false;

    protected $fillable = [
        'generated_by',
        'report_type',
        'file_format',
        'file_url',
        'generated_at',
    ];

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by', 'user_id');
    }
}
