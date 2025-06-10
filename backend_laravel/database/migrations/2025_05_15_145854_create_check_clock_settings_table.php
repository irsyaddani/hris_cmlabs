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
        Schema::create('check_clock_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');           
            $table->string('locationName')->nullable();
            $table->string('detailAddress')->nullable();
            $table->decimal('latitude', 18, 15)->nullable();
            $table->decimal('longitude', 18, 15)->nullable();
            $table->integer('radius')->nullable();
            $table->time('clockIn')->nullable();
            $table->time('clockOut')->nullable();
            $table->time('breakStart')->nullable();
            $table->time('breakEnd')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('check_clock_settings');
    }
};
