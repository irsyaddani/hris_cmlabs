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
        'first_name',
        'last_name',
        'mobile_number',
        'nik',
        'gender',
        'pend_terakhir',
        'tempat_lahir',
        'tanggal_lahir',
        'jabatan',
        'cabang',
        'tipe_kontrak',
        'grade',
        'bank',
        'no_rekening',
        'an_rekening',
        'level',
        'join_date',
    ];

    protected $dates = ['tanggal_lahir', 'join_date'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
