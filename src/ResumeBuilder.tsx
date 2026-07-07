import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SkillCategories {
  [key: string]: string[];
}

interface ResumeData {
  role: string;
  experienceLevel: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  skillCategories: SkillCategories;
  projects: string;
  certifications: string;
  education: string;
  experience: string;
  participations: string;
  leadership: string;
  languages: string;
  additionalInfo: string;
  templateId: string;
}

// 6 templates â€” Professional Icons removed
const TEMPLATES = [
  {
    id: "classic-corporate",
    name: "Classic Corporate",
    desc: "Bold name header, double rule, label | content rows. Clean Arial, fully ATS-compatible.",
    accent: "bg-zinc-800",
    preview: ["NAME ........... Email", "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•", "Summary â”‚ text", "Skills  â”‚ categories", "Certs   â”‚ list"],
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Dark charcoal header block, Georgia serif, all sections with clean ruled dividers.",
    accent: "bg-zinc-900",
    preview: ["â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ", "  NAME  |  Role", "â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€", "â—† Summary", "â—† Skills Â· Certs"],
  },
  {
    id: "minimal-elegant",
    name: "Minimal Elegant",
    desc: "Centred uppercase name, thin horizontal rules, full sections, clean single-column.",
    accent: "bg-zinc-500",
    preview: ["   FULL NAME   ", "email | phone | links", "â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€", "Skills (categories)", "Education Â· Certs"],
  },
  {
    id: "clean-timeline",
    name: "Clean Timeline",
    desc: "Gray left accent strip, vertical dot timeline, bordered dots, all sections.",
    accent: "bg-zinc-600",
    preview: ["â– Name  |  Role", "â— Summary", "â— Skills (category list)", "â— Experience Â· Projects", "â— Leadership Â· Extra"],
  },
  {
    id: "academic-detailed",
    name: "Academic Detailed",
    desc: "Dense single-column CV: dated entries, tech-stack project lines, 2-col grid for edu/certs.",
    accent: "bg-zinc-700",
    preview: ["NAME â€” Role", "â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•", "Dated Exp. entries", "Numbered Projects", "Edu grid | Certs"],
  },
  {
    id: "banner-sections",
    name: "Banner Sections",
    desc: "Full-width gray banner headers, 4-column skill grid, clean single column throughout.",
    accent: "bg-zinc-400",
    preview: ["NAME  |  Role", "â–¬â–¬ SUMMARY â–¬â–¬â–¬â–¬â–¬â–¬", "â–¬â–¬ TECHNICAL SKILLS â–¬â–¬", "4-col category grid", "â–¬â–¬ EDUCATION â–¬â–¬â–¬â–¬â–¬â–¬"],
  },
];

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Analyst", "Machine Learning Engineer", "DevOps Engineer",
  "UI/UX Designer", "Product Manager", "Android Developer",
  "iOS Developer", "Cloud Architect", "Cybersecurity Analyst",
  "AI Engineer", "Data Scientist", "Software Engineer",
];

const LEVELS = [
  "Fresher / Entry-Level", "1â€“3 Years (Associate)",
  "3â€“5 Years (Mid-Senior)", "5+ Years (Lead / Principal)",
];
const cleanResumeText = (value: string) => {
  const badSymbols = [
    "â€¢", "â€˘", "•", "&bull;", "&#8226;", "&#x2022;",
    "▪", "●", "◦", "►", "▸", "›",
  ];

  return badSymbols
    .reduce((text, symbol) => text.split(symbol).join(""), value || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const buildResumePayload = (data: ResumeData) => {
  const cleanedAdditionalInfo = cleanResumeText(data.additionalInfo);
  const cleanedLanguages = cleanResumeText(data.languages);

  return {
    ...data,
    experience: cleanResumeText(data.experience),
    projects: cleanResumeText(data.projects),
    certifications: cleanResumeText(data.certifications),
    participations: cleanResumeText(data.participations),
    leadership: cleanResumeText(data.leadership),
    languages: cleanedLanguages,
    additionalInfo: cleanedAdditionalInfo,
    additionalInformation: cleanedAdditionalInfo,
    additional_information: cleanedAdditionalInfo,
    additional_info: cleanedAdditionalInfo,
    courseWork: cleanedAdditionalInfo,
    coursework: cleanedAdditionalInfo,
  };
};

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResumeData>({
    role: "", experienceLevel: "",
    fullName: "", email: "", phone: "", location: "", linkedin: "", github: "",
    summary: "", skills: [], skillCategories: {}, projects: "", certifications: "",
    education: "", experience: "", participations: "", leadership: "", languages: "",
    additionalInfo: "", templateId: "classic-corporate",
  });

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skillsLocked, setSkillsLocked] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [showSkillCats, setShowSkillCats] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const set = (field: keyof ResumeData, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const parseSkills = (raw: string) =>
    Array.from(new Set(raw.split(",").map(s => s.trim()).filter(Boolean)));

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setFormData(p => ({ ...p, skills: parseSkills(e.target.value) }));
  };

  const removeSkill = (s: string) => {
    const updated = formData.skills.filter(x => x !== s);
    setFormData(p => ({ ...p, skills: updated }));
    setSkillInput(updated.join(", "));
  };

  const handleGenerateBase = async () => {
    if (!formData.role || !formData.experienceLevel) {
      showToast("Please select a role and experience level first.", "err"); return;
    }
    try {
      setAiLoading(true);
      const res = await fetch("https://resume-backend-production-4e7c.up.railway.app/generate-resume-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: formData.role, experienceLevel: formData.experienceLevel }),
      });
      const data = await res.json();
      const aiSkills: string[] = Array.isArray(data.skills) ? data.skills : [];
      const aiCats: SkillCategories = data.skillCategories || {};
      setFormData(p => ({ ...p, summary: data.summary || "", skills: aiSkills, skillCategories: aiCats }));
      setSkillInput(aiSkills.join(", "));
      setSkillsLocked(false);
      showToast("AI profile generated â€” 8â€“10 line summary and categorized skills filled!");
    } catch {
      showToast("AI generation failed. Check server.", "err");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!formData.fullName.trim()) { showToast("Please enter your full name.", "err"); return; }
    if (!formData.email.trim()) { showToast("Please enter your email.", "err"); return; }
    try {
      setLoading(true);
      const res = await fetch("https://resume-backend-production-4e7c.up.railway.app/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildResumePayload(formData)),
      });
      if (!res.ok) throw new Error("Status " + res.status);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "resume.pdf";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast("Resume downloaded successfully!");
    } catch {
      showToast("Failed to generate resume. Check server connection.", "err");
    } finally {
      setLoading(false);
    }
  };

  const card = "bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.04)]";
  const inp = "w-full p-3.5 rounded-xl bg-slate-50/60 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm";
  const lbl = "text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block";
  const badge = "text-xs font-bold tracking-widest uppercase text-indigo-600 mb-5 bg-indigo-50/70 inline-block px-3 py-1 rounded-md border border-indigo-100/60";
  const Step = ({ n }: { n: number }) => (
    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-black flex items-center justify-center flex-shrink-0">{n}</span>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-indigo-50/20 to-slate-100 text-slate-800 antialiased">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl ${
          toast.type === "ok" ? "bg-emerald-600" : "bg-rose-600"}`}>
          {toast.type === "ok" ? "âœ“" : "âš "} {toast.msg}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">

        {/* Header */}
        <div className="text-center py-10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
          <button onClick={() => navigate("/dashboard")}
            className="absolute left-0 top-10 flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 text-sm font-semibold transition-colors">
            â† Back
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            AI <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Resume</span> Builder
          </h1>
          <p className="text-slate-500 mt-3 text-sm max-w-lg mx-auto">
            Professional, ATS-friendly, monochrome resumes in 6 templates. All designs include every section with 12pt body text â€” only the layout differs.
          </p>
        </div>

        <div className="space-y-6">

          {/* STEP 1 â€” AI CONTEXT */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-black flex items-center justify-center">1</span>
              <h2 className="text-xs font-bold tracking-widest uppercase text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-md">
                AI Context â€” Role & Level
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">Target Role</label>
                <select value={formData.role} onChange={e => set("role", e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm cursor-pointer">
                  <option value="" className="text-slate-900">Select a role</option>
                  {ROLES.map(r => <option key={r} className="text-slate-900">{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">Experience Level</label>
                <select value={formData.experienceLevel} onChange={e => set("experienceLevel", e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm cursor-pointer">
                  <option value="" className="text-slate-900">Select level</option>
                  {LEVELS.map(l => <option key={l} className="text-slate-900">{l}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleGenerateBase} disabled={aiLoading}
              className="mt-5 px-6 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-md active:scale-[0.98]">
              {aiLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-700 rounded-full animate-spin" />
                  Generating AI Profile...
                </span>
              ) : "âœ¦ Generate AI Base Profile"}
            </button>
            <p className="text-indigo-300/60 text-xs mt-3">
              Generates an 6-8 line professional summary and automatically categorizes your skills into:
              Programming Languages Â· Web Development Â· Frameworks &amp; Libraries Â· Databases Â· AI/ML Â· DSA Â· Tools &amp; Platforms Â· Others
            </p>
          </div>

          {/* STEP 2 â€” PERSONAL INFO */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={2} /><span className={badge}>Personal Information</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className={lbl}>Full Name</label><input type="text" placeholder="e.g. John Doe" className={inp} value={formData.fullName} onChange={e => set("fullName", e.target.value)} /></div>
              <div><label className={lbl}>Email</label><input type="email" placeholder="you@email.com" className={inp} value={formData.email} onChange={e => set("email", e.target.value)} /></div>
              <div><label className={lbl}>Phone</label><input type="text" placeholder="+91 9845151515" className={inp} value={formData.phone} onChange={e => set("phone", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div><label className={lbl}>Location</label><input type="text" placeholder="e.g. Chennai, Tamil Nadu" className={inp} value={formData.location} onChange={e => set("location", e.target.value)} /></div>
              <div><label className={lbl}>LinkedIn <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span></label><input type="text" placeholder="linkedin.com/in/name" className={inp} value={formData.linkedin} onChange={e => set("linkedin", e.target.value)} /></div>
              <div><label className={lbl}>GitHub <span className="text-slate-300 font-normal normal-case tracking-normal">(optional)</span></label><input type="text" placeholder="github.com/name" className={inp} value={formData.github} onChange={e => set("github", e.target.value)} /></div>
            </div>
            <p className="text-xs text-slate-400 mt-3">LinkedIn and GitHub appear with small monochrome icons in the contact line.</p>
          </div>

          {/* STEP 3 â€” SUMMARY */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={3} /><span className={badge}>Professional Summary</span></div>
            <textarea rows={6} className={inp}
              placeholder="An 6â€“8 sentence summary covering: technical expertise, academic background, problem-solving ability, interest in software/AI, and career objectives. Auto-filled by the AI above."
              value={formData.summary} onChange={e => set("summary", e.target.value)} />
            <p className="text-xs text-slate-400 mt-1.5">6â€“8 lines recommended for best page coverage and ATS richness.</p>
          </div>

          {/* STEP 4 â€” SKILLS */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={4} /><span className={badge}>Technical Skills</span></div>

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100 min-h-[44px]">
                {formData.skills.map(s => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-semibold">
                    {s}
                    {!skillsLocked && (
                      <button onClick={() => removeSkill(s)}
                        className="text-white/50 hover:text-rose-300 w-3.5 h-3.5 flex items-center justify-center transition-all text-xs">Ã—</button>
                    )}
                  </span>
                ))}
              </div>
            )}

            {!skillsLocked ? (
              <div className="space-y-3">
                <label className={lbl}>Type skills separated by commas</label>
                <input type="text" className={inp}
                  placeholder="e.g. Python, Flask, React, PostgreSQL, Docker, Prompt Engineering, C/C++, Vibe Coding"
                  value={skillInput} onChange={handleSkillChange}
                  onBlur={() => setFormData(p => ({ ...p, skills: parseSkills(skillInput) }))} />
                <p className="text-xs text-slate-400">
                  Skills are auto-grouped into categories in every PDF template. Skills like <strong>Prompt Engineering</strong>, <strong>C/C++</strong>, and <strong>Vibe Coding</strong> go into the <strong>Others</strong> category automatically.
                </p>

                {Object.keys(formData.skillCategories).length > 0 && (
                  <div className="mt-3">
                    <button onClick={() => setShowSkillCats(!showSkillCats)}
                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                      {showSkillCats ? "â–¼ Hide" : "â–¶ Show"} AI-categorized skills (used in PDF)
                    </button>
                    {showSkillCats && (
                      <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        {Object.entries(formData.skillCategories).map(([cat, items]) => (
                          <div key={cat} className="text-xs text-slate-600 flex gap-2">
                            <span className="font-bold text-slate-800 min-w-[140px]">{cat}:</span>
                            <span>{(items as string[]).join(", ")}</span>
                          </div>
                        ))}
                        <p className="text-xs text-slate-400 mt-1 pt-1 border-t border-slate-200">
                          Rendered as a clean bold-category list in the PDF â€” no colored boxes, no borders, fully ATS-compatible.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <button onClick={() => { if (!formData.skills.length) { showToast("Add at least one skill.", "err"); return; } setSkillsLocked(true); }}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95">
                    Confirm Skills
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
                <p className="text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {formData.skills.length} skills confirmed
                  {Object.keys(formData.skillCategories).length > 0 && ` Â· ${Object.keys(formData.skillCategories).length} categories`}
                </p>
                <button onClick={() => setSkillsLocked(false)}
                  className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all">
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* STEP 5 â€” EXPERIENCE */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={5} /><span className={badge}>Internship & Work Experience</span></div>
            <textarea rows={7} className={inp}
              value={formData.experience} onChange={e => set("experience", e.target.value)} />
            <p className="text-xs text-slate-400 mt-1.5">Separate entries with a blank line. Dates in parentheses display right-aligned in every template.</p>
          </div>

          {/* STEP 6 â€” PROJECTS */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={6} /><span className={badge}>Projects</span></div>
            <textarea rows={7} className={inp}
              value={formData.projects} onChange={e => set("projects", e.target.value)} />
            <p className="text-xs text-slate-400 mt-1.5">Use | to separate project name from tech stack. Projects are numbered automatically in all templates.</p>
          </div>

          {/* STEP 7 â€” EDUCATION */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={7} /><span className={badge}>Education</span></div>
            <textarea rows={6} className={inp}
              value={formData.education} onChange={e => set("education", e.target.value)} />
          </div>

          {/* STEP 8 â€” CERTIFICATIONS */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={8} /><span className={badge}>Certifications</span></div>
            <input type="text" className={inp}
              value={formData.certifications} onChange={e => set("certifications", e.target.value)} />
            <p className="text-xs text-slate-400 mt-1.5">Comma-separated â€” shown as a plain bullet list grouped with Participations. No badges or colors.</p>
          </div>

          {/* STEP 9 â€” PARTICIPATIONS */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={9} /><span className={badge}>Participations & Achievements</span></div>
            <textarea rows={3} className={inp}
              value={formData.participations} onChange={e => set("participations", e.target.value)} />
            <p className="text-xs text-slate-400 mt-1.5">Appears together with Certifications in a single combined "Participations & Certifications" section.</p>
          </div>

          {/* STEP 10 â€” LEADERSHIP */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={10} /><span className={badge}>Leadership & Event Conductions <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span></span></div>
            <textarea rows={3} className={inp}
              value={formData.leadership} onChange={e => set("leadership", e.target.value)} />
          </div>

          {/* STEP 11 â€” ADDITIONAL INFO */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5"><Step n={11} /><span className={badge}>Additional Information</span></div>
            <div className="space-y-4">
              <div>
                <label className={lbl}>Course Work / Subjects</label>
                <input type="text" className={inp}
                  placeholder="e.g. DSA, DBMS, OOPs, Computer Networks, Machine Learning, Generative AI, Prompt Engineering"
                  value={formData.additionalInfo} onChange={e => set("additionalInfo", e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Languages Known</label>
                <input type="text" className={inp}
                  value={formData.languages} onChange={e => set("languages", e.target.value)} />
              </div>
            </div>
          </div>

          {/* STEP 12 â€” TEMPLATE */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-2"><Step n={12} /><span className={badge}>Choose Template</span></div>
            <p className="text-xs text-slate-400 mb-5">
              All 6 templates are fully monochrome (black, white, gray) and include every section above with 12pt body text. Only the layout and typography differ.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map(t => {
                const selected = formData.templateId === t.id;
                return (
                  <button key={t.id} onClick={() => setFormData(p => ({ ...p, templateId: t.id }))}
                    className={`text-left p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                      selected
                        ? "border-indigo-600 bg-white shadow-[0_4px_20px_rgba(99,102,241,0.14)] scale-[1.02]"
                        : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-md"
                    }`}>
                    {selected && <div className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[24px] border-t-indigo-600" />}
                    {selected && <span className="absolute top-0.5 right-0.5 text-white text-[9px] font-bold">âœ“</span>}
                    <div className={`w-full h-14 rounded-lg mb-3 ${t.accent} flex items-center justify-center overflow-hidden`}>
                      <div className="text-white/55 text-[7px] font-mono leading-tight text-center px-2">
                        {t.preview.slice(0, 3).map((l, i) => <div key={i}>{l}</div>)}
                      </div>
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-wider transition-colors ${selected ? "text-indigo-600" : "text-slate-700"}`}>
                      {t.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* GENERATE */}
          <button onClick={handleGenerateResume} disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white rounded-2xl font-bold text-base tracking-wide transition-all duration-300 disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-[0.99]">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating professional resume PDF...
              </span>
            ) : "â¬‡ Generate & Download Resume PDF"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;

