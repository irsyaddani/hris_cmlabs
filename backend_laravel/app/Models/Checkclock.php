<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckClock extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'check_clock_type',
        'check_clock_time',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}

?>