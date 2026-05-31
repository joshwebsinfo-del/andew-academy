import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  IdCard, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface LocalAuthProps {
  onLoginSuccess: (user: { name: string; email: string; studentId: string }) => void;
}

export default function LocalAuth({ onLoginSuccess }: LocalAuthProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize with a default student if none exist
  useEffect(() => {
    const existingUsers = localStorage.getItem("andrew_academy_users_v1");
    if (!existingUsers) {
      const defaultUsers = [
        {
          name: "Joshua Mujakari",
          email: "operator@andrew.edu",
          studentId: "ZNQF-2026-081",
          password: "password123"
        },
        {
          name: "Admin Andrew Maposa",
          email: "andrewmaposa27@gmail.com",
          studentId: "ADMIN-001",
          password: "academy22",
          isAdmin: true
        }
      ];
      localStorage.setItem("andrew_academy_users_v1", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic Validations
    if (!email || !password) {
      setError("Please fill in all mandatory credentials (Email & Password).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please supply a valid metallurgical email string format.");
      return;
    }

    const storedUsersJson = localStorage.getItem("andrew_academy_users_v1") || "[]";
    let storedUsers = [];
    try {
      storedUsers = JSON.parse(storedUsersJson);
    } catch (e) {
      storedUsers = [];
    }

    if (isRegistering) {
      if (!name) {
        setError("Please enter your full name for regulatory student logging.");
        return;
      }
      if (!studentId) {
        setError("A unique ZNQF Student ID registration is required.");
        return;
      }
      if (password.length < 6) {
        setError("Security mandates a minimum 6-character password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Your passwords do not match. Please verify.");
        return;
      }

      // Check duplicate email
      const emailExists = storedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError("This student email is already registered in our local registry.");
        return;
      }

      // Add user
      const newUser = {
        name,
        email: email.toLowerCase(),
        studentId,
        password
      };

      storedUsers.push(newUser);
      localStorage.setItem("andrew_academy_users_v1", JSON.stringify(storedUsers));
      
      setSuccess("Account registered! Proceeding to log you in automatically...");
      setTimeout(() => {
        localStorage.setItem("andrew_academy_current_user_v1", JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          studentId: newUser.studentId
        }));
        onLoginSuccess({
          name: newUser.name,
          email: newUser.email,
          studentId: newUser.studentId
        });
      }, 1500);

    } else {
      // Login Process
      const user = storedUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        setError("Invalid email address or passcode credentials. Please verify your entries.");
        return;
      }

      setSuccess(`Authentication successful! Welcome back, ${user.name}.`);
      setTimeout(() => {
        const currentUserData = {
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          isAdmin: user.isAdmin || false,
        };
        localStorage.setItem("andrew_academy_current_user_v1", JSON.stringify(currentUserData));
        onLoginSuccess(currentUserData);
      }, 1200);
    }
  };

  const handleUseDemo = () => {
    setEmail("operator@andrew.edu");
    setPassword("password123");
    setIsRegistering(false);
    setError(null);
  };

  return (
    <div id="auth-portal" className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Visual Ambient Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0e1154]/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-900/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl relative z-10 text-left animate-fadeIn">
        
        {/* Banner header inside portal */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-400 mb-3 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-indigo-400 tracking-[0.25em] uppercase block mb-1">
            Student Academic Portal
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Andrew Academy
          </h2>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
            ZNQF Level 4 Operator Certification Suite • Local Authentication
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all select-none ${
              !isRegistering 
                ? "bg-slate-800 text-white shadow-xs" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegistering(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all select-none ${
              isRegistering 
                ? "bg-slate-800 text-white shadow-xs" 
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Register Student
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-300 text-[11px] font-semibold leading-relaxed flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-[11px] font-semibold leading-relaxed flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleAction} className="space-y-4">
          
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 block tracking-widest font-mono">
                Full Academic Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your registration name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl py-2.5 px-3 pl-9 text-xs outline-none text-white font-bold transition-all"
                  required
                />
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 block tracking-widest font-mono">
              Student Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="operator@andrew.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl py-2.5 px-3 pl-9 text-xs outline-none text-white font-bold transition-all"
                required
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 block tracking-widest font-mono">
                Syllabus ID Number (ZNQF)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. ZNQF-2026-081"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl py-2.5 px-3 pl-9 text-xs outline-none text-white font-bold transition-all font-mono"
                  required
                />
                <IdCard className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400 block tracking-widest font-mono">
              Portal Access Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl py-2.5 px-3 pl-9 text-xs outline-none text-white font-bold transition-all"
                required
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 block tracking-widest font-mono">
                Verify Passcode Match
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl py-2.5 px-3 pl-9 text-xs outline-none text-white font-bold transition-all"
                  required
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-all tracking-wider uppercase shadow-md active:scale-[0.98] cursor-pointer block text-center select-none"
          >
            <span>{isRegistering ? "Register student ledger" : "Proceed to Academic Desk"}</span>
          </button>
        </form>

        {/* Demo Fast Account Quick Access Panel */}
        <div className="mt-6 pt-5 border-t border-slate-800/60 text-center">
          <p className="text-[10px] text-slate-500 font-semibold mb-2 leading-relaxed">
            Quick-access default operator credentials mapped for fast preview checks:
          </p>
          <button
            type="button"
            onClick={handleUseDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-[10px] text-indigo-300 font-bold font-mono rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>Load Demo (operator@andrew.edu)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
