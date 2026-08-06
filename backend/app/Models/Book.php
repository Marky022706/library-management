<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $primaryKey = 'book_id';
    public $timestamps = false;

    protected $fillable = [
        'title',
        'publisher_id',
        'category_id',
        'publication_year',
        'description',
        'cover_image_url',
        'cataloging_source',
        'added_by',
        'created_at',
    ];

    public function publisher()
    {
        return $this->belongsTo(Publisher::class, 'publisher_id', 'publisher_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by', 'user_id');
    }

    public function authors()
    {
        return $this->belongsToMany(Author::class, 'book_authors', 'book_id', 'author_id');
    }

    public function copies()
    {
        return $this->hasMany(BookCopy::class, 'book_id', 'book_id');
    }

    public function digitalBooks()
    {
        return $this->hasMany(DigitalBook::class, 'book_id', 'book_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'book_id', 'book_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'book_id', 'book_id');
    }

    public function notes()
    {
        return $this->hasMany(BookNote::class, 'book_id', 'book_id');
    }
}
