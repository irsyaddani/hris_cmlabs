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
            $table->string('employee_code')->unique()->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');     
            $table->string('firstName');
            $table->string('lastName');
            $table->string('mobileNumber')->nullable();
            $table->string('nik')->unique()->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
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
            $table->enum('level', ['user', 'admin'])->default('user');
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
