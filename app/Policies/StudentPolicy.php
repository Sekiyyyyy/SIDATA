<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

class StudentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Student $student): bool
    {
        if ($user->isAdmin() || $user->isOperator()) {
            return true;
        }

        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            return $teacherId && $student->currentClass && $student->currentClass->current_wali_kelas_id === $teacherId;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin() || $user->isOperator() || $user->isWaliKelas();
    }

    public function update(User $user, Student $student): bool
    {
        if ($user->isAdmin() || $user->isOperator()) {
            return true;
        }

        if ($user->isWaliKelas()) {
            $teacherId = $user->teacher?->id;
            return $teacherId && $student->currentClass && $student->currentClass->current_wali_kelas_id === $teacherId;
        }

        return false;
    }

    public function delete(User $user, Student $student): bool
    {
        return $user->isAdmin() || $user->isOperator();
    }
}
