<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        // 'id_employee',
        'company_id',
        'user_id',
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
        'level',
    ];

    protected $dates = ['birthDate', 'joinDate'];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
