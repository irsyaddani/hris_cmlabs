<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';

    protected $fillable = [
        'company_name',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function checkclock()
    {
        return $this->hasMany(Checkclock::class);
    }
}
