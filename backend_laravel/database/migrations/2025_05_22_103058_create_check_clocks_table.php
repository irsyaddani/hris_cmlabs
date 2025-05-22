<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('check_clocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_employee')->constrained('employees')->onDelete('cascade');
            $table->enum('check_clock_type', ['clock_in', 'clock_out', 'break_start', 'break_end']);
            $table->timestamp('check_clock_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_clocks');
    }
};
