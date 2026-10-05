<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Extracurricular extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function studentRecords(): HasMany
    {
        return $this->hasMany(StudentExtracurricular::class);
    }
}
