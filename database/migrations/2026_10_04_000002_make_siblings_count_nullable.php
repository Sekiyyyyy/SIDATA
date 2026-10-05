<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->integer('siblings_count')->nullable()->default(0)->change();
            $table->integer('step_siblings_count')->nullable()->default(0)->change();
            $table->integer('foster_siblings_count')->nullable()->default(0)->change();
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->integer('siblings_count')->default(0)->change();
            $table->integer('step_siblings_count')->default(0)->change();
            $table->integer('foster_siblings_count')->default(0)->change();
        });
    }
};
