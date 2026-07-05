import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  return (
    <div className="min-h-screen w-full flex relative overflow-hidden bg-[hsl(0,0%,3%)]">
      {/* Ambient glows */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-violet-600 opacity-10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-600 opacity-10 blur-[120px] pointer-events-none" />

      {/* Left branding */}
      <div className="hidden md:flex flex-1 items-center justify-center relative z-10 px-12">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-white/60 text-xs font-medium tracking-widest uppercase">Create Account</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            Start your<br />career journey.
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Join thousands building smarter resumes with AI tools built for the modern job market.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {["Free to use — no credit card needed", "Generate resumes in under 2 minutes", "Built-in ATS optimisation tools"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/60 text-sm">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-400 text-xs">✓</span>
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full md:w-[500px] flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/[0.06] border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="md:hidden text-center mb-6">
              <span className="text-white font-extrabold text-xl tracking-tight">AI Resume Suite</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Create account</h2>
            <p className="text-white/40 text-sm mb-7">Fill in the details to get started</p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
                <span className="flex-shrink-0">⚠</span> {error}
              </div>
            )}
            {success && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                <span className="flex-shrink-0">✓</span> Account created! Redirecting to login...
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Choose a username"
                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Create a password"
                    className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 pr-11 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className="text-xs text-white/40">{strength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    placeholder="Re-enter your password"
                    className={`w-full h-11 bg-white/5 border rounded-xl px-4 pr-11 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 transition-all text-sm ${
                      confirmPassword && confirmPassword !== password
                        ? "border-rose-500/40 focus:border-rose-500/60 focus:ring-rose-500/20"
                        : "border-white/10 focus:border-violet-500/60 focus:ring-violet-500/20"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-xs text-rose-400 mt-1.5">Passwords don't match</p>
                )}
              </div>

              <button type="submit" disabled={loading || success}
                className="w-full h-11 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 shadow-lg shadow-violet-900/30 active:scale-[0.98]">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-white/35 mt-6">
              Already have an account?{" "}
              <Link to="/" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;