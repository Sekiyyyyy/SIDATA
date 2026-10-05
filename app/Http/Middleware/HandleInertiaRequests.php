<?php

namespace App\Http\Middleware;

use App\Models\AcademicYear;
use App\Models\SchoolProfile;
use App\Models\Semester;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user) {
            $user->loadMissing('teacher');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'teacher_id' => $user->teacher?->id,
                    'teacher_nip' => $user->teacher?->nip,
                ] : null,
            ],
            'school' => SchoolProfile::first(),
            'activeAcademicYear' => AcademicYear::where('is_active', true)->first(),
            'activeSemester' => Semester::where('is_active', true)->with('academicYear')->first(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
