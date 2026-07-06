import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeAnalyser = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [result, setResult] = useState<{
    matchScore: number;
    missingSkills: string[];
    suggestions: string[];
  } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleAnalyse = async () => {
    if (!role.trim()) { showToast("Please enter a target role.", "err"); return; }
    if (!file) { showToast("Please upload your resume PDF.", "err"); return; }
    try {
      setLoading(true);
      setResult(null);
      const formData = new FormData();
      formData.append("role", role);
      formData.append("resume", file);
      const res = await fetch("https://resume-backend-production-4e7c.up.railway.app/analyse-resume", {
        method: "POST", body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details || `Server error ${res.status}`);
      }
      const data = await res.json();
      setResult({
        matchScore: data.matchScore ?? 0,
        missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      });
      showToast("Analysis complete!");
    } catch (err: any) {
      showToast(`Analysis failed: ${err.message || "Unknown error"}`, "err");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) => s >= 75 ? "text-emerald-600" : s >= 50 ? "text-amber-600" : "text-rose-600";
  const scoreBg = (s: number) => s >= 75 ? "from-emerald-500 to-emerald-400" : s >= 50 ? "from-amber-500 to-amber-400" : "from-rose-500 to-rose-400";
  const scoreLabel = (s: number) => s >= 75 ? "Strong Match" : s >= 50 ? "Moderate Match" : "Weak Match";
  const scoreRingColor = (s: number) => s >= 75 ? "#10b981" : s >= 50 ? "#f59e0b" : "#f43f5e";

  const card = "bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.04)]";
  const sectionBadge = "text-xs font-bold tracking-widest uppercase text-indigo-600 mb-5 bg-indigo-50/70 inline-block px-3 py-1 rounded-md border border-indigo-100/60";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-indigo-50/20 to-slate-100 text-slate-800 antialiased">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl ${
          toast.type === "ok" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.type === "ok" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* Header */}
        <div className="text-center py-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          <button onClick={() => navigate("/dashboard")}
            className="absolute left-0 top-10 flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 text-sm font-semibold transition-colors">
            ← Back
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Resume <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Analyser</span>
          </h1>
          <p className="text-slate-500 mt-3 text-sm max-w-md mx-auto">
            Upload your resume and specify a target role for a detailed AI-powered compatibility analysis.
          </p>
        </div>

        <div className="space-y-6">

          {/* Input panel */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-indigo-300 mb-5 bg-indigo-500/20 inline-block px-3 py-1 rounded-md">
              Analysis Context
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">Target Role</label>
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, Data Analyst..."
                  className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">Resume PDF</label>
                <div onClick={() => document.getElementById("analyserFile")?.click()}
                  className="w-full p-5 rounded-xl border-2 border-dashed border-white/20 text-center cursor-pointer hover:border-indigo-400 hover:bg-white/5 transition-all">
                  {file ? (
                    <>
                      <div className="text-indigo-300 font-semibold text-sm">{file.name}</div>
                      <div className="text-white/40 text-xs mt-1">Click to replace</div>
                    </>
                  ) : (
                    <>
                      <div className="text-white/70 text-sm font-medium">Click to upload PDF</div>
                      <div className="text-white/35 text-xs mt-1">PDF files only</div>
                    </>
                  )}
                </div>
                <input id="analyserFile" type="file" accept=".pdf" className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <button onClick={handleAnalyse} disabled={loading}
              className="mt-5 px-6 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-md active:scale-[0.98]">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                  Analysing Resume...
                </span>
              ) : "◈ Run Analysis"}
            </button>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Score card */}
              <div className={card}>
                <span className={sectionBadge}>Match Score</span>
                <div className="flex items-center gap-6">
                  {/* Circular score */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="38" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle cx="48" cy="48" r="38" fill="none"
                        stroke={scoreRingColor(result.matchScore)} strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 38}`}
                        strokeDashoffset={`${2 * Math.PI * 38 * (1 - result.matchScore / 100)}`}
                        className="transition-all duration-700" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-xl font-black ${scoreColor(result.matchScore)}`}>{result.matchScore}%</span>
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-black ${scoreColor(result.matchScore)}`}>
                      {scoreLabel(result.matchScore)}
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                      {result.matchScore >= 75
                        ? "Your resume is a great fit for this role."
                        : result.matchScore >= 50
                        ? "Your resume partially matches this role — see suggestions below."
                        : "Your resume needs significant improvements for this role."}
                    </p>
                    <div className="mt-3 w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${scoreBg(result.matchScore)} transition-all duration-700`}
                        style={{ width: `${result.matchScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              <div className={card}>
                <span className={sectionBadge}>
                  Missing Mandatory Skills
                  <span className="ml-2 text-rose-500 normal-case tracking-normal">({result.missingSkills.length})</span>
                </span>
                {result.missingSkills.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                    No mandatory skills missing — great coverage!
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((s, i) => (
                      <span key={i} className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className={card}>
                <span className={sectionBadge}>Suggestions to Improve</span>
                {result.suggestions.length === 0 ? (
                  <p className="text-slate-400 text-sm">No suggestions available.</p>
                ) : (
                  <ul className="space-y-3">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed bg-slate-50/60 rounded-xl p-3.5 border border-slate-100">
                        <span className="text-indigo-500 font-black mt-0.5 flex-shrink-0 text-xs bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center border border-indigo-100">
                          {i + 1}
                        </span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyser;