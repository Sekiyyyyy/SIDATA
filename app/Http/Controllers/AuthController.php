<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        if (Auth::check()) {
            return Inertia::render('Dashboard/Index');
        }

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $remember = $request->boolean('remember', false);

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            AuditLog::record('Login Pengguna', Auth::user());

            return redirect()->intended('/dashboard')->with('success', 'Selamat datang kembali, ' . Auth::user()->name);
        }

        return back()->withErrors([
            'email' => 'Email atau kata sandi tidak cocok dengan data kami.',
        ]);
    }

    public function quickLogin(Request $request)
    {
        $role = $request->input('role', 'admin');
        $emailMap = [
            'admin' => 'admin@sidata.test',
            'operator' => 'operator@sidata.test',
            'wali_kelas' => 'walikelas@sidata.test',
        ];

        $email = $emailMap[$role] ?? 'admin@sidata.test';
        $user = User::where('email', $email)->first();

        if ($user) {
            Auth::login($user);
            $request->session()->regenerate();
            AuditLog::record('Quick Login (' . ucfirst(str_replace('_', ' ', $role)) . ')', $user);
            return redirect('/dashboard')->with('success', 'Masuk sebagai ' . $user->name . ' (' . strtoupper($user->role) . ')');
        }

        return back()->with('error', 'Akun tidak ditemukan.');
    }

    public function logout(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            AuditLog::record('Logout Pengguna', $user);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('success', 'Anda telah berhasil keluar.');
    }
}
