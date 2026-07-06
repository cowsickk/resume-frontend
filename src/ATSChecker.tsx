import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Speedometer = ({ score, label }: { score: number; label: string }) => {
  const r = 72;
  const cx = 100, cy = 100;
  const startAngle = -210;
  const totalAngle = 240;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const arc = (start: number, end: number, color: string, sw = 16) => {
    const s = toRad(start), e = toRad(end);
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    return (
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${x2} ${y2}`}
        fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" />
    );
  };

  const needleAngle = startAngle + (score / 100) * totalAngle;
  const nx = cx + (r - 18) * Math.cos(toRad(needleAngle));
  const ny = cy + (r - 18) * Math.sin(toRad(needleAngle));

  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e";
  const lbl = score >= 75 ? "Excellent" : score >= 50 ? "Needs Work" : "Poor";

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="140" viewBox="0 0 200 140">
        {arc(startAngle, startAngle + totalAngle, "#f1f5f9")}
        {arc(startAngle, startAngle + totalAngle * 0.4, "#fecaca")}
        {arc(startAngle + totalAngle * 0.4, startAngle + totalAngle * 0.7, "#fde68a")}
        {arc(startAngle + totalAngle * 0.7, startAngle + totalAngle, "#a7f3d0")}
        {score > 0 && arc(startAngle, startAngle + (score / 100) * totalAngle, color, 5)}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="#1e293b" />
        <text x={cx} y={cy + 26} textAnchor="middle" fill={color} fontSize="20" fontWeight="900">{score}%</text>
      </svg>
      <p className="text-xs font-bold mt-1" style={{ color }}>{lbl}</p>
      <p className="text-slate-500 text-xs mt-0.5">{label}</p>
    </div>
  );
};

const ATSChecker = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [result, setResult] = useState<{
    atsScore: number;
    keywordMatch: { matched: string[]; missing: string[] };
    formattingIssues: string[];
    sectionCompleteness: { section: string; status: string }[];
    readabilityScore: number;
    readabilityFeedback: string;
  } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleCheck = async () => {
    if (!role.trim()) { showToast("Please enter a target role.", "err"); return; }
    if (!file) { showToast("Please upload your resume PDF.", "err"); return; }
    try {
      setLoading(true);
      setResult(null);
      const formData = new FormData();
      formData.append("role", role);
      formData.append("jobDescription", jobDescription);
      formData.append("resume", file);
      const res = await fetch("https://resume-backend-production-4e7c.up.railway.app/ats-check", {
        method: "POST", body: formData,
      });
      const data = await res.json();
      setResult({
        atsScore: data.atsScore ?? 0,
        keywordMatch: {
          matched: Array.isArray(data.keywordMatch?.matched) ? data.keywordMatch.matched : [],
          missing: Array.isArray(data.keywordMatch?.missing) ? data.keywordMatch.missing : [],
        },
        formattingIssues: Array.isArray(data.formattingIssues) ? data.formattingIssues : [],
        sectionCompleteness: Array.isArray(data.sectionCompleteness) ? data.sectionCompleteness : [],
        readabilityScore: data.readabilityScore ?? 0,
        readabilityFeedback: data.readabilityFeedback ?? "",
      });
      showToast("ATS check complete!");
    } catch {
      showToast("ATS check failed. Check server connection.", "err");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <button onClick={() => navigate("/dashboard")}
            className="absolute left-0 top-10 flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 text-sm font-semibold transition-colors">
            ← Back
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            ATS <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">Score</span> Checker
          </h1>
          <p className="text-slate-500 mt-3 text-sm max-w-md mx-auto">
            Scan your resume against ATS systems for keyword coverage, formatting issues, and readability.
          </p>
        </div>

        <div className="space-y-6">

          {/* Input panel */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-indigo-300 mb-5 bg-indigo-500/20 inline-block px-3 py-1 rounded-md">
              Scan Context
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">Target Role</label>
                <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Developer, Data Analyst..."
                  className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">
                  Job Description <span className="text-white/35 font-medium normal-case tracking-normal">(optional — improves accuracy)</span>
                </label>
                <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                  rows={3} placeholder="Paste the job description here..."
                  className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">Resume PDF</label>
                <div onClick={() => document.getElementById("atsFile")?.click()}
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
                <input id="atsFile" type="file" accept=".pdf" className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <button onClick={handleCheck} disabled={loading}
              className="mt-5 px-6 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-md active:scale-[0.98]">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                  Running ATS Check...
                </span>
              ) : "⬡ Run ATS Check"}
            </button>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Speedometers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className={`${card} text-center`}>
                  <span className={sectionBadge}>ATS Score</span>
                  <Speedometer score={result.atsScore} label="Overall ATS compatibility" />
                </div>
                <div className={`${card} text-center`}>
                  <span className={sectionBadge}>Readability</span>
                  <Speedometer score={result.readabilityScore} label="Human readability score" />
                  {result.readabilityFeedback && (
                    <p className="text-slate-500 text-xs mt-3 leading-relaxed px-2">{result.readabilityFeedback}</p>
                  )}
                </div>
              </div>

              {/* Keyword Match */}
              <div className={card}>
                <span className={sectionBadge}>Keyword Match</span>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                        Matched ({result.keywordMatch.matched.length})
                      </h3>
                    </div>
                    {result.keywordMatch.matched.length === 0 ? (
                      <p className="text-slate-400 text-sm">No matched keywords found.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {result.keywordMatch.matched.map((k, i) => (
                          <span key={i} className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold">
                            ✓ {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                        Missing ({result.keywordMatch.missing.length})
                      </h3>
                    </div>
                    {result.keywordMatch.missing.length === 0 ? (
                      <p className="text-slate-400 text-sm">No missing keywords — great coverage!</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {result.keywordMatch.missing.map((k, i) => (
                          <span key={i} className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold">
                            ✕ {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Formatting Issues */}
              <div className={card}>
                <span className={sectionBadge}>
                  Formatting Issues
                  <span className="ml-2 text-amber-600 normal-case tracking-normal">({result.formattingIssues.length})</span>
                </span>
                {result.formattingIssues.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs">✓</span>
                    No formatting issues found.
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {result.formattingIssues.map((issue, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed bg-amber-50/50 border border-amber-100 rounded-xl p-3">
                        <span className="text-amber-500 flex-shrink-0 font-bold">⚠</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Section Completeness */}
              <div className={card}>
                <span className={sectionBadge}>Section Completeness</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.sectionCompleteness.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl">
                      <span className="text-slate-700 text-sm font-medium">{s.section}</span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        s.status === "Present" ? "text-emerald-700 bg-emerald-50 border border-emerald-100" :
                        s.status === "Incomplete" ? "text-amber-700 bg-amber-50 border border-amber-100" :
                        "text-rose-700 bg-rose-50 border border-rose-100"
                      }`}>
                        {s.status === "Present" ? "✓ " : s.status === "Incomplete" ? "~ " : "✕ "}{s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;