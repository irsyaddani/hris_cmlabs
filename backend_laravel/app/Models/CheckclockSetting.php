<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CheckClockSetting extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'check_clock_settings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'company_id',
        'locationName',
        'detailAddress',
        'latitude',
        'longitude',
        'radius',
        'clockIn',
        'clockOut',
        'breakStart',
        'breakEnd',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'radius' => 'integer',
        'company_id' => 'integer',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * Get the company that owns the clock settings.
     */
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'id');
    }
}