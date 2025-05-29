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
            $table->enum('type', ['wfo', 'wfh', 'sick', 'annual leave', 'permit', 'no-show']);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->dateTime('clock_in')->nullable();
            $table->dateTime('clock_out')->nullable();
            $table->text('reason')->nullable();
            $table->string('file')->nullable(); // jika file berupa path, gunakan string
            $table->enum('status_approval', ['approved', 'accepted', 'pending'])->nullable();
            $table->decimal('latitude', 18, 15)->nullable();
            $table->decimal('longitude', 18, 15)->nullable();
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
