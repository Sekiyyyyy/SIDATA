<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('birth_place')->nullable()->change();
            $table->date('birth_date')->nullable()->change();
            $table->string('religion')->nullable()->change();
            $table->string('citizenship')->nullable()->default('INDONESIA')->change();
            $table->string('daily_language')->nullable()->default('BAHASA INDONESIA')->change();
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('birth_place')->nullable(false)->change();
            $table->date('birth_date')->nullable(false)->change();
        });
    }
};
