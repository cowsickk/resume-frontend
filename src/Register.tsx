import { useState } from "react";
import { Eye, EyeOff, User, Lock, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrength = (pw: string) => {
    if (!pw) return { label: "", color: "", width: "0%" };
    if (pw.length < 6) return { label: "Too short", color: "bg-rose-500", width: "25%" };
    if (pw.length < 8) return { label: "Weak", color: "bg-amber-500", width: "50%" };
    if (!/[0-9]/.test(pw) || !/[^a-zA-Z0-9]/.test(pw)) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  };

  const strength = passwordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (username.trim().length < 3) { setError("Username must be at least 3 characters."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const response = await fetch("https://resume-backend-production-4e7c.up.railway.app/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 1800);
      } else {
        setError(data.message || "Registration failed. Username may already exist.");
      }
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Shared styling tokens for the floating-label glass inputs
  const inputBase =
    "peer w-full h-14 bg-white/[0.04] border border-white/10 rounded-2xl pl-11 pr-11 pt-4 pb-1 text-[15px] text-white placeholder-transparent focus:outline-none focus:bg-white/[0.06] focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10 transition-all duration-200";
  const labelBase =
    "absolute left-11 top-2 text-xs font-medium text-white/45 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-white/35 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-violet-300";
  const iconBase =
    "absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30 peer-focus:text-violet-300 transition-colors duration-200 pointer-events-none";
  const eyeButton =
    "absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors duration-150 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50";

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#08080c] px-4 py-10 sm:py-16">
      <style>{`
        @keyframes rf-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rf-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(18px, -14px); }
        }
        .rf-enter { animation: rf-fade-up 0.32s cubic-bezier(0.16,1,0.3,1) both; }
        .rf-orb-a { animation: rf-drift 11s ease-in-out infinite; }
        .rf-orb-b { animation: rf-drift 14s ease-in-out infinite reverse; }
        @media (prefers-reduced-motion: reduce) {
          .rf-enter, .rf-orb-a, .rf-orb-b { animation: none; }
        }
      `}</style>

      {/* Ambient background glows */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="rf-orb-a absolute top-[-8%] left-[-6%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full bg-indigo-600/20 blur-[110px]" />
        <div className="rf-orb-b absolute bottom-[-10%] right-[-8%] w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="absolute top-[35%] right-[15%] w-[180px] h-[180px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>

      <div className="rf-enter w-full max-w-[420px] relative z-10">
        {/* Logo + heading */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_6px_24px_rgba(99,102,241,0.35)] mb-5">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.25} />
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
            Create your account
          </h1>
          <p className="text-white/45 text-sm mt-2 max-w-[280px]">
            Join AI Resume Suite and start building a resume that gets noticed.
          </p>
        </div>

        {/* Glass card with gradient hairline border */}
        <div className="rounded-[26px] p-[1px] bg-gradient-to-b from-white/15 via-white/5 to-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <div className="rounded-[25px] bg-white/[0.045] backdrop-blur-2xl border border-white/[0.06] px-6 py-7 sm:px-8 sm:py-8">

            {error && (
              <div role="alert" aria-live="polite" className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div role="status" aria-live="polite" className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Account created. Redirecting to sign in…</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5" noValidate>
              {/* Username */}
              <div className="relative">
                <User className={iconBase} />
                <input
                  id="reg-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder=" "
                  aria-label="Username"
                  className={inputBase}
                />
                <label htmlFor="reg-username" className={labelBase}>Username</label>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className={iconBase} />
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder=" "
                    aria-label="Password"
                    className={inputBase}
                  />
                  <label htmlFor="reg-password" className={labelBase}>Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className={eyeButton}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2.5 px-1">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className="text-xs text-white/40 mt-1.5">{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <div className="relative">
                  <Lock className={`${iconBase} ${confirmPassword && confirmPassword !== password ? "text-rose-400/70" : ""}`} />
                  <input
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    placeholder=" "
                    aria-label="Confirm password"
                    aria-invalid={!!(confirmPassword && confirmPassword !== password)}
                    className={`${inputBase} ${
                      confirmPassword && confirmPassword !== password
                        ? "border-rose-500/40 focus:border-rose-500/60 focus:ring-rose-500/10"
                        : ""
                    }`}
                  />
                  <label htmlFor="reg-confirm" className={labelBase}>Confirm password</label>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className={eyeButton}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-rose-400 mt-1.5 px-1">Passwords don't match</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 mt-1 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-[0_8px_24px_rgba(99,102,241,0.3)] transition-all duration-200 hover:from-indigo-500 hover:to-violet-500 hover:shadow-[0_10px_28px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:hover:from-indigo-600 disabled:hover:to-violet-600 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080c]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-white/35 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-violet-300 font-semibold hover:text-violet-200 underline decoration-violet-400/0 hover:decoration-violet-400/60 underline-offset-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 rounded"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;