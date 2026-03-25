"use client";

import { useState, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  ExternalLink,
  Users,
  Sparkles,
  LayoutGrid,
  Code2,
  BarChart3,
  Palette,
  Megaphone,
  Handshake,
  Briefcase,
  Rocket,
} from "lucide-react";
import { BackgroundGrid } from "./BackgroundGrid";
import { ExpertCarousel } from "./ExpertCarousel";
import { JOB_FAMILIES } from "@/data/job-families";
import { EXPERTS, type Expert } from "@/data/experts";

const ICON_MAP: Record<string, ReactNode> = {
  "layout-grid": <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />,
  "code-2": <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />,
  "bar-chart-3": <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
  palette: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,
  megaphone: <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />,
  handshake: <Handshake className="w-5 h-5 sm:w-6 sm:h-6" />,
  briefcase: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
  rocket: <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />,
};

type View = "landing" | "results";

export function LandingPage() {
  const [view, setView] = useState<View>("landing");
  const [selectedFamilies, setSelectedFamilies] = useState<Set<string>>(
    new Set()
  );
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const toggleFamily = (id: string) => {
    setSelectedFamilies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredExperts = useMemo(() => {
    if (selectedFamilies.size === 0) return [];
    const relevantTopics = new Set<string>();
    for (const famId of selectedFamilies) {
      const fam = JOB_FAMILIES.find((f) => f.id === famId);
      if (fam) fam.topics.forEach((t) => relevantTopics.add(t));
    }
    const scored = EXPERTS.map((expert) => {
      const overlap = expert.topics.filter((t) => relevantTopics.has(t)).length;
      return { expert, overlap };
    })
      .filter((e) => e.overlap > 0)
      .sort((a, b) => {
        if (b.overlap !== a.overlap) return b.overlap - a.overlap;
        return b.expert.signupCount - a.expert.signupCount;
      });
    return scored.map((s) => s.expert);
  }, [selectedFamilies]);

  const handleSubmit = () => {
    if (selectedFamilies.size === 0) return;
    if (!email.trim()) {
      setEmailError("Enter your email to continue");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getMavenUrl = (expert: Expert) => {
    if (expert.schoolSlug) {
      return `https://maven.com/${expert.schoolSlug}?utm_source=find-experts`;
    }
    return `https://maven.com/search?q=${encodeURIComponent(expert.name)}&utm_source=find-experts`;
  };

  const selectedLabels = Array.from(selectedFamilies)
    .map((id) => JOB_FAMILIES.find((f) => f.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <BackgroundGrid />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-navy-950 border-b border-navy-700 shadow-[0px_5px_14px_0px_rgba(0,0,0,0.05),0px_2px_6px_0px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1440px] mx-auto h-full px-6 sm:px-12 flex items-center justify-between">
          <img
            src="/maven-logo.svg"
            alt="Maven"
            width={147}
            height={32}
            className="h-8 w-auto"
          />
          {view === "results" && (
            <button
              onClick={() => setView("landing")}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex-none border-l border-r border-navy-700 max-w-[1100px] mx-auto w-full mt-[72px] bg-navy-950">
        <AnimatePresence mode="wait">
          {view === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero with Expert Carousel behind */}
              <section className="relative pt-20 sm:pt-28 pb-8 px-6">
                <ExpertCarousel />
                <div className="relative z-10 max-w-[760px] mx-auto text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="text-[48px] sm:text-[72px] font-light font-serif text-white leading-[1.1] tracking-[-2.88px]"
                    style={{ fontFeatureSettings: "'ss01' 1" }}
                  >
                    Learn from humans.{" "}
                    <span className="text-lime">Find your experts.</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="mt-6 text-lg sm:text-xl text-white/80 leading-[1.6] max-w-[560px] mx-auto"
                  >
                    Select your role, and we&apos;ll show you the top experts
                    who can take your skills further.
                  </motion.p>
                </div>
              </section>

              {/* Job Family Grid */}
              <section className="px-6 pb-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="max-w-[760px] mx-auto"
                >
                  <div className="mb-5" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {JOB_FAMILIES.map((fam, i) => {
                      const selected = selectedFamilies.has(fam.id);
                      return (
                        <motion.button
                          key={fam.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.4 + i * 0.04,
                            duration: 0.35,
                          }}
                          onClick={() => toggleFamily(fam.id)}
                          className={`
                            group relative flex flex-col items-center justify-center gap-2.5
                            p-5 rounded-2xl border transition-all duration-200 cursor-pointer
                            ${
                              selected
                                ? "border-lime/50 bg-lime/[0.07] shadow-[0_0_20px_rgba(205,255,146,0.08)]"
                                : "border-navy-700 bg-navy-900/60 hover:bg-navy-800/60 hover:border-navy-600"
                            }
                          `}
                        >
                          <div
                            className={`transition-colors ${
                              selected
                                ? "text-lime"
                                : "text-white/50 group-hover:text-white/70"
                            }`}
                          >
                            {ICON_MAP[fam.iconId]}
                          </div>
                          <span
                            className={`text-sm font-medium text-center leading-tight transition-colors ${
                              selected
                                ? "text-lime"
                                : "text-white/80 group-hover:text-white"
                            }`}
                          >
                            {fam.label}
                          </span>
                          {selected && (
                            <motion.div
                              className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-lime flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 25,
                              }}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M2.5 6L5 8.5L9.5 3.5"
                                  stroke="#080c28"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </section>

              {/* Email Capture */}
              <section className="px-6 pb-24 sm:pb-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="max-w-[520px] mx-auto"
                >
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSubmit();
                        }}
                        className={`
                          w-full pl-12 pr-4 py-4 rounded-[10px] bg-navy-900 border
                          text-white placeholder:text-white/30 text-base
                          focus:outline-none focus:ring-2 focus:ring-lime/30 focus:border-lime/40
                          transition-all duration-200
                          ${emailError ? "border-red-400/60" : "border-navy-700"}
                        `}
                      />
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={selectedFamilies.size === 0}
                      className={`
                        flex items-center justify-center gap-2 px-8 py-4 rounded-[10px]
                        font-medium text-base tracking-[-0.32px] transition-all duration-200
                        ${
                          selectedFamilies.size > 0
                            ? "bg-white text-navy-950 hover:bg-lime hover:text-navy-950 cursor-pointer shadow-sm"
                            : "bg-navy-800 text-white/30 cursor-not-allowed"
                        }
                      `}
                      style={{ fontFeatureSettings: "'ss01' 1" }}
                    >
                      Go
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-400/80 text-center"
                    >
                      {emailError}
                    </motion.p>
                  )}
                  {selectedFamilies.size > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-sm text-white/30 text-center"
                    >
                      <Sparkles className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                      {filteredExperts.length} experts matched across{" "}
                      {selectedLabels.join(", ")}
                    </motion.p>
                  )}
                </motion.div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Results Header */}
              <section className="pt-20 sm:pt-24 pb-10 px-6">
                <div className="max-w-[820px] mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-lime/60 mb-4">
                      Your experts
                    </p>
                    <h2
                      className="text-[36px] sm:text-[48px] font-light font-serif text-white leading-[1.15] tracking-[-1.92px]"
                      style={{ fontFeatureSettings: "'ss01' 1" }}
                    >
                      {filteredExperts.length} experts in{" "}
                      <span className="text-lime">
                        {selectedLabels.join(" & ")}
                      </span>
                    </h2>
                    <p className="mt-4 text-lg text-white/50 leading-[1.6]">
                      Top instructors on Maven, sorted by relevance to your
                      selected roles. Click any expert to explore their courses.
                    </p>
                  </motion.div>

                  {/* Selected pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="mt-6 flex flex-wrap gap-2"
                  >
                    {Array.from(selectedFamilies).map((id) => {
                      const fam = JOB_FAMILIES.find((f) => f.id === id);
                      if (!fam) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-lime/20 bg-lime/[0.06] text-sm text-lime/80"
                        >
                          <span className="w-4 h-4 shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                            {ICON_MAP[fam.iconId]}
                          </span>
                          {fam.label}
                        </span>
                      );
                    })}
                  </motion.div>
                </div>
              </section>

              {/* Divider */}
              <div className="border-t border-navy-700" />

              {/* Expert Cards */}
              <section className="px-6 py-10">
                <div className="max-w-[820px] mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredExperts.map((expert, i) => (
                      <motion.a
                        key={expert.name}
                        href={getMavenUrl(expert)}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(i * 0.04, 0.8),
                          duration: 0.4,
                        }}
                        className="group relative flex flex-col rounded-2xl border border-navy-700 bg-navy-900/80 hover:bg-navy-800/80 hover:border-navy-600 transition-all duration-200 overflow-hidden"
                      >
                        {/* Expert image */}
                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-navy-800">
                          <img
                            src={expert.imgUrl}
                            alt={expert.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
                          <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        {/* Expert info */}
                        <div className="flex flex-col flex-1 p-5">
                          <h3 className="text-base font-medium text-white tracking-[-0.32px] group-hover:text-lime transition-colors">
                            {expert.name}
                          </h3>
                          <p className="mt-1.5 text-sm text-white/45 leading-[1.5] line-clamp-3">
                            {expert.title}
                          </p>
                          <div className="mt-auto pt-4">
                            <div className="flex items-center gap-1.5 text-xs text-white/25">
                              <Users className="w-3 h-3" />
                              <span>
                                {expert.signupCount.toLocaleString()} learners
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </section>

              {/* Bottom CTA */}
              <div className="border-t border-navy-700" />
              <section className="py-20 px-6">
                <div className="max-w-[640px] mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3
                      className="text-[32px] sm:text-[40px] font-light font-serif text-white leading-[1.2] tracking-[-1.2px]"
                      style={{ fontFeatureSettings: "'ss01' 1" }}
                    >
                      Ready to level up?{" "}
                      <span className="text-lime">Start learning.</span>
                    </h3>
                    <p className="mt-4 text-lg text-white/45">
                      Browse all courses and live sessions on Maven.
                    </p>
                    <a
                      href="https://maven.com?utm_source=find-experts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 px-8 py-5 rounded-[10px] bg-white text-navy-950 font-medium text-lg tracking-[-0.36px] border border-neutral-300 shadow-sm hover:bg-lime transition-all duration-200"
                      style={{ fontFeatureSettings: "'ss01' 1" }}
                    >
                      Explore Maven
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </motion.div>
                </div>
              </section>

              <div className="h-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
