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
            $table->foreignId('id_user')->constrained('users')->onDelete('cascade');
            $table->foreignId('id_ck_settings')->constrained('check_clock_settings')->onDelete('cascade');
            $table->string('firstName');
            $table->string('lastName');
            $table->string('mobile_number')->nullable();
            $table->string('nik')->unique()->nullable();
            $table->enum('gender', ['L', 'P'])->nullable();
            $table->string('pend_terakhir')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('jabatan')->nullable();
            $table->string('cabang')->nullable();
            $table->string('tipe_kontrak')->nullable();
            $table->string('grade')->nullable();
            $table->string('bank')->nullable();
            $table->string('no_rekening')->nullable();
            $table->string('an_rekening')->nullable();
            $table->string('tipe_sp')->nullable();
            $table->enum('level', ['user', 'admin'])->default('user')->nullable();
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
