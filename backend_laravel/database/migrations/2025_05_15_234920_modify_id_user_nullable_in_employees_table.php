<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyIdUserNullableInEmployeesTable extends Migration
{
    public function up()
    {
        Schema::table('employees', function (Blueprint $table) {
            // Ubah kolom id_user jadi nullable
            $table->unsignedBigInteger('id_user')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            // Kembalikan ke not nullable
            $table->unsignedBigInteger('id_user')->nullable(false)->change();
        });
    }
}
