<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShelfLocation extends Model
{
    use HasFactory;

    protected $primaryKey = 'shelf_location_id';
    public $timestamps = false;

    protected $fillable = [
        'location_code',
    ];

    public function bookCopies()
    {
        return $this->hasMany(BookCopy::class, 'shelf_location_id', 'shelf_location_id');
    }
}
