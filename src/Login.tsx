import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://resume-backend-production-4e7c.up.railway.app/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex relative overflow-x-hidden overflow-y-auto bg-[hsl(0,0%,3%)]">

      {/* Glow Background */}
      <div className="absolute top-[10%] left-[10%] w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] rounded-full bg-[hsl(120,80%,45%)] opacity-20 blur-[100px] sm:blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[15%] w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] rounded-full bg-[hsl(210,90%,50%)] opacity-25 blur-[80px] sm:blur-[100px] animate-pulse" />
      <div className="absolute bottom-[10%] left-[30%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full bg-[hsl(280,80%,50%)] opacity-15 blur-[80px] sm:blur-[100px] animate-pulse" />

      {/* Left Section */}
      <div className="hidden md:flex flex-1 items-center justify-center relative z-10 px-8 lg:px-12">
        <div className="max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome
          </h1>
          <p className="text-base lg:text-lg text-white/60 leading-relaxed">
            Build your professional resume in minutes. Start crafting your
            career story today.
          </p>
        </div>
      </div>

      {/* Right Card */}
      <div className="w-full md:w-[480px] lg:w-[520px] flex items-center justify-center px-4 py-10 sm:px-8 md:justify-end md:px-0 md:pr-10 lg:pr-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-8 shadow-2xl">

            {/* Mobile-only heading, since the left welcome panel is hidden below md */}
            <div className="md:hidden text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Welcome</h1>
              <p className="text-sm text-white/60">Build your professional resume in minutes.</p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8 tracking-tight">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>

              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="login-username" className="text-sm text-white/80 font-medium">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="login-username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full h-11 bg-white/5 border border-white/15 rounded-lg px-4 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/10 transition-all text-sm"
                  />
                  <User aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm text-white/80 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 bg-white/5 border border-white/15 rounded-lg px-4 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 focus:bg-white/10 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/40 hover:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-white font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                Register
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;