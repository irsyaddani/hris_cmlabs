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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_ck_settings')->nullable()->constrained('check_clock_settings')->onDelete('cascade');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('mobileNumber')->nullable();
            $table->string('nik')->unique()->nullable();
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->string('lastEducation')->nullable();
            $table->string('birthPlace')->nullable();
            $table->date('birthDate')->nullable();
            $table->string('position')->nullable();
            $table->string('branch')->nullable();
            $table->string('employeeType')->nullable();
            $table->string('grade')->nullable();
            $table->date('joinDate')->nullable();
            $table->string('bank')->nullable();
            $table->string('accountNumber')->nullable();
            $table->string('bankAccountName')->nullable();
            $table->enum('level', ['user', 'admin'])->default('admin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
