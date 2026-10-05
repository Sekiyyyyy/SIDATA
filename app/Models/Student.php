<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'birth_date' => 'date',
        'siblings_count' => 'integer',
        'step_siblings_count' => 'integer',
        'foster_siblings_count' => 'integer',
    ];

    protected $appends = [
        'data_completion_percentage',
        'missing_fields',
    ];

    public function currentClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'current_class_id');
    }

    public function parents(): HasOne
    {
        return $this->hasOne(StudentParent::class);
    }

    public function guardian(): HasOne
    {
        return $this->hasOne(Guardian::class);
    }

    public function educationHistory(): HasOne
    {
        return $this->hasOne(EducationHistory::class);
    }

    public function healthRecords(): HasMany
    {
        return $this->hasMany(HealthRecord::class);
    }

    public function classHistories(): HasMany
    {
        return $this->hasMany(StudentClassHistory::class)->orderBy('id', 'asc');
    }

    public function subjectScores(): HasMany
    {
        return $this->hasMany(StudentSubjectScore::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class);
    }

    public function studentExtracurriculars(): HasMany
    {
        return $this->hasMany(StudentExtracurricular::class);
    }

    public function p5Assessments(): HasMany
    {
        return $this->hasMany(P5Assessment::class);
    }

    public function mutations(): HasMany
    {
        return $this->hasMany(Mutation::class);
    }

    public function graduation(): HasOne
    {
        return $this->hasOne(Graduation::class);
    }

    /**
     * Indikator Kelengkapan Data (Sesuai Section 29 prompt.md)
     */
    public function getDataCompletionPercentageAttribute(): int
    {
        $weights = [
            'biodata' => 25,
            'parents' => 20,
            'education' => 15,
            'health' => 15,
            'scores' => 15,
            'attendance' => 10,
        ];

        $earned = 0;

        // Biodata check
        if (!empty($this->nis) && !empty($this->nisn) && !empty($this->name) && !empty($this->birth_place) && !empty($this->birth_date) && !empty($this->address)) {
            $earned += $weights['biodata'];
        }

        // Parents check
        if ($this->parents && (!empty($this->parents->father_name) || !empty($this->parents->mother_name))) {
            $earned += $weights['parents'];
        }

        // Education check
        if ($this->educationHistory && !empty($this->educationHistory->school_name)) {
            $earned += $weights['education'];
        }

        // Health check
        if ($this->healthRecords()->exists()) {
            $earned += $weights['health'];
        }

        // Scores check
        if ($this->subjectScores()->exists()) {
            $earned += $weights['scores'];
        }

        // Attendance check
        if ($this->attendances()->exists()) {
            $earned += $weights['attendance'];
        }

        return min(100, $earned);
    }

    public function getMissingFieldsAttribute(): array
    {
        $missing = [];
        if (!$this->parents || (empty($this->parents->father_name) && empty($this->parents->mother_name))) {
            $missing[] = 'Data Orang Tua';
        }
        if (!$this->educationHistory || empty($this->educationHistory->school_name)) {
            $missing[] = 'Riwayat Pendidikan SMP';
        }
        if (!$this->healthRecords()->exists()) {
            $missing[] = 'Data Kesehatan & Fisik';
        }
        if (!$this->subjectScores()->exists()) {
            $missing[] = 'Nilai Mata Pelajaran';
        }
        if (!$this->attendances()->exists()) {
            $missing[] = 'Data Kehadiran';
        }

        return $missing;
    }
}
