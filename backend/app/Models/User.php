<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'role_id',
        'school_id',
        'first_name',
        'last_name',
        'email',
        'password_hash',
        'phone_number',
        'account_status',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'role_id');
    }

    public function libraryCard()
    {
        return $this->hasOne(LibraryCard::class, 'user_id', 'user_id');
    }

    public function borrowTransactions()
    {
        return $this->hasMany(BorrowTransaction::class, 'user_id', 'user_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'user_id', 'user_id');
    }

    public function attendanceLogs()
    {
        return $this->hasMany(AttendanceLog::class, 'user_id', 'user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'user_id');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'user_id', 'user_id');
    }

    public function isSuperAdmin(): bool
    {
        return $this->role && $this->role->role_name === 'Super Admin';
    }

    public function isAdmin(): bool
    {
        return $this->role && in_array($this->role->role_name, ['Super Admin', 'Admin']);
    }

    public function isLibrarian(): bool
    {
        return $this->role && in_array($this->role->role_name, ['Super Admin', 'Admin', 'Librarian']);
    }

    public function isMember(): bool
    {
        return $this->role && $this->role->role_name === 'Member';
    }
}
