import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const tools = [
  {
    title: "Resume Builder",
    desc: "Build a professional resume with AI-generated summaries and skills. Choose from 7 unique templates.",
    route: "/builder",
    icon: "✦",
    accent: "from-indigo-500 to-indigo-600",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
    glow: "group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]",
    dot: "bg-indigo-500",
    tag: "Builder",
  },
  {
    title: "Resume Analyser",
    desc: "Upload your resume and a target role to get a match score, missing skills, and improvement tips.",
    route: "/resume-analyzer",
    icon: "◈",
    accent: "from-violet-500 to-violet-600",
    badge: "bg-violet-50 text-violet-600 border-violet-100",
    glow: "group-hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]",
    dot: "bg-violet-500",
    tag: "Analyser",
  },
  {
    title: "ATS Checker",
    desc: "Scan your resume for ATS compatibility — keyword coverage, formatting issues, and readability score.",
    route: "/ats-checker",
    icon: "⬡",
    accent: "from-emerald-500 to-emerald-600",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    glow: "group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]",
    dot: "bg-emerald-500",
    tag: "ATS",
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-indigo-50/20 to-slate-100 text-slate-800 antialiased">

      {/* Navbar */}
      <nav className="sticky top-0 z-20 flex flex-wrap gap-y-2 justify-between items-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4 border-b border-slate-200/60 backdrop-blur-xl bg-white/75 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-black">AI</span>
          </div>
          <span className="text-slate-900 font-extrabold tracking-tight text-base sm:text-lg truncate">
            Resume <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Suite</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {username && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200">
              <div className="w-5 h-5 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">{username[0]?.toUpperCase()}</span>
              </div>
              <span className="text-slate-700 font-medium text-sm max-w-[140px] truncate">{username}</span>
            </div>
          )}
          <button onClick={handleLogout}
            className="min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all font-semibold text-sm active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
            Logout
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative px-4 sm:px-6 lg:px-10 pt-8 sm:pt-12 lg:pt-14 pb-8 sm:pb-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-56 sm:h-64 bg-indigo-400/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 sm:mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Dashboard
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-3 px-2">
              What would you like to do today?
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-sm mx-auto px-2">
              Three AI-powered tools to build, evaluate, and optimise your resume.
            </p>
          </div>

          {/* Tool cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {tools.map((tool) => (
              <button
                key={tool.route}
                onClick={() => navigate(tool.route)}
                className={`group text-left bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[180px] sm:min-h-[200px] shadow-[0_4px_20px_rgb(0,0,0,0.04)] ${tool.glow} transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              >
                <div>
                  {/* Icon + tag row */}
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${tool.accent} flex items-center justify-center shadow-sm text-white text-lg`}>
                      {tool.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border whitespace-nowrap ${tool.badge}`}>
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-4 sm:mt-5 flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-all sm:opacity-0 sm:group-hover:opacity-100 translate-x-0 sm:group-hover:translate-x-0.5">
                  Open tool <span>→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick stats strip */}
          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { label: "Templates", value: "6", sub: "Resume designs" },
              { label: "AI-powered", value: "3", sub: "Analysis tools" },
              { label: "Export", value: "PDF", sub: "One click download" },
            ].map((s) => (
              <div key={s.label} className="bg-white/60 backdrop-blur border border-slate-200/60 rounded-xl p-2.5 sm:p-4 text-center shadow-sm">
                <div className="text-lg sm:text-2xl font-black text-slate-900">{s.value}</div>
                <div className="text-[10px] sm:text-xs font-bold text-indigo-600 mt-0.5 truncate">{s.label}</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 truncate">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;