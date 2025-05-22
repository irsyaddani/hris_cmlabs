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

    public function employee()
    {
        return $this->hasMany(Employee::class);
    }

    public function checkclocksetting()
    {
        return $this->hasMany(CheckclockSetting::class);
    }
}
