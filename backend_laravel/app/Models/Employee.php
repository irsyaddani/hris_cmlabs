<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        'id_employee',
        'id_ck_settings',
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
        'bank',
        'accountNumber',
        'bankAccountName',
        'level',
    ];

    protected $dates = ['tanggal_lahir', 'join_date'];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
