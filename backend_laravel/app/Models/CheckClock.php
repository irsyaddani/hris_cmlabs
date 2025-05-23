<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckClock extends Model
{
    use HasFactory;

    protected $table = 'check_clocks';

    protected $fillable = [
        'id_employee',
        'type',
        'start_date',
        'end_date',
        'clock_in',
        'clock_out',
        'reason',
        'file',
        'status_approval',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'start_date'     => 'date',
        'end_date'       => 'date',
        'clock_in'       => 'datetime',
        'clock_out'      => 'datetime',
        'latitude'       => 'decimal:15',
        'longitude'      => 'decimal:15',
    ];

    // Relasi ke tabel employees dengan foreign key id_employee
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'id_employee');
    }
}
