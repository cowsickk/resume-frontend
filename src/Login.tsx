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
      const response = await fetch("http://localhost:5000/login", {
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
    <div className="min-h-screen w-full flex relative overflow-hidden bg-[hsl(0,0%,3%)]">

      {/* Glow Background */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full bg-[hsl(120,80%,45%)] opacity-20 blur-[120px] animate-pulse" />
      <div className="absolute top-[20%] right-[15%] w-[350px] h-[350px] rounded-full bg-[hsl(210,90%,50%)] opacity-25 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[10%] left-[30%] w-[300px] h-[300px] rounded-full bg-[hsl(280,80%,50%)] opacity-15 blur-[100px] animate-pulse" />

      {/* Left Section */}
      <div className="hidden md:flex flex-1 items-center justify-center relative z-10">
        <div className="max-w-lg px-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome
          </h1>
          <p className="text-lg text-white/60 leading-relaxed">
            Build your professional resume in minutes. Start crafting your
            career story today.
          </p>
        </div>
      </div>

      {/* Right Card */}
      <div className="w-full md:w-[520px] flex items-center justify-center md:justify-end pr-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm text-white/80 font-medium">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full h-11 bg-white/5 border border-white/15 rounded-lg px-4 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all text-sm"
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm text-white/80 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-11 bg-white/5 border border-white/15 rounded-lg px-4 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-white font-semibold hover:underline">
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