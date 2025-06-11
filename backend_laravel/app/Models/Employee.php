<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        'user_id',
        'company_id',
        'employee_code',
        'firstName',
        'lastName',
        'mobileNumber',
        'nik',
        'gender',
        'lastEducation',
        'birthPlace',
        'birthDate',
        'position',
        'branch',
        'employeeType',
        'grade',
        'joinDate',
        'bank',
        'accountNumber',
        'bankAccountName',
        'annualLeave',
        'level',
        'profile_picture', // 👈 gunakan snake_case di sini
    ];

    protected $dates = ['birthDate', 'joinDate'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
