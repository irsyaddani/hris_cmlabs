<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CheckclockSetting extends Model
{
    use HasFactory;

    protected $table = 'check_clock_settings';

    protected $fillable = [
        'clockIn',
        'clockOut',
        'breakStart',
        'breakEnd',
        'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

}
