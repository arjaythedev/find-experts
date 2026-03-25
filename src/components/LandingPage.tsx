"use client";

import { useState, useMemo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  ExternalLink,
  Users,
  Lock,
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
import { PathWheel } from "./PathWheel";
import { JOB_FAMILIES, INTERESTS_BY_ROLE } from "@/data/job-families";
import { EXPERTS, type Expert } from "@/data/experts";

const ICON_MAP: Record<string, ReactNode> = {
  "layout-grid": <LayoutGrid className="w-4 h-4" />,
  "code-2": <Code2 className="w-4 h-4" />,
  "bar-chart-3": <BarChart3 className="w-4 h-4" />,
  palette: <Palette className="w-4 h-4" />,
  megaphone: <Megaphone className="w-4 h-4" />,
  handshake: <Handshake className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  rocket: <Rocket className="w-4 h-4" />,
};

type Step = 1 | 2 | 3;
type View = "landing" | "results";

export function LandingPage() {
  const [view, setView] = useState<View>("landing");
  const [step, setStep] = useState<Step>(1);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(
    new Set()
  );
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const familyObj = JOB_FAMILIES.find((f) => f.id === selectedFamily);
  const availableInterests = selectedFamily
    ? (INTERESTS_BY_ROLE[selectedFamily] ?? [])
    : [];

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Gather topics from selected interests
  const selectedTopics = useMemo(() => {
    const topics = new Set<string>();
    for (const intId of selectedInterests) {
      const interest = availableInterests.find((i) => i.id === intId);
      if (interest) interest.topics.forEach((t) => topics.add(t));
    }
    return topics;
  }, [selectedInterests, availableInterests]);

  const filteredExperts = useMemo(() => {
    if (selectedTopics.size === 0) return [];
    const scored = EXPERTS.map((expert) => {
      const overlap = expert.topics.filter((t) => selectedTopics.has(t)).length;
      return { expert, overlap };
    })
      .filter((e) => e.overlap > 0)
      .sort((a, b) => {
        if (b.overlap !== a.overlap) return b.overlap - a.overlap;
        return b.expert.signupCount - a.expert.signupCount;
      });
    return scored.map((s) => s.expert);
  }, [selectedTopics]);

  const handleSelectFamily = (id: string) => {
    setSelectedFamily(id);
    setSelectedInterests(new Set());
    setStep(2);
  };

  const handleAdvanceToGate = () => {
    if (selectedInterests.size === 0) return;
    setStep(3);
  };

  const handleSubmitEmail = () => {
    if (!email.trim()) {
      setEmailError("Enter your email to unlock your path");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    setEmailSubmitted(true);
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedFamily(null);
      setSelectedInterests(new Set());
    } else if (step === 3) {
      setStep(2);
    }
  };

  const getMavenUrl = (expert: Expert) => {
    if (expert.schoolSlug) {
      return `https://maven.com/${expert.schoolSlug}?utm_source=find-experts`;
    }
    return `https://maven.com/search?q=${encodeURIComponent(expert.name)}&utm_source=find-experts`;
  };

  const selectedInterestLabels = Array.from(selectedInterests)
    .map((id) => availableInterests.find((i) => i.id === id)?.label)
    .filter(Boolean);

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-hidden ${view === "landing" ? "h-screen overflow-y-hidden" : ""}`}
    >
      <BackgroundGrid />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-navy-950/90 backdrop-blur-sm border-b border-navy-700">
        <div className="max-w-[1440px] mx-auto h-full px-6 sm:px-12 flex items-center justify-between">
          <img
            src="/maven-logo.svg"
            alt="Maven"
            width={120}
            height={26}
            className="h-6 w-auto"
          />
          {view === "results" && (
            <button
              onClick={() => {
                setView("landing");
                setEmailSubmitted(false);
              }}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      </nav>

      {view === "landing" ? (
        <div className="relative z-10 w-full mt-[56px] h-[calc(100vh-56px)] flex flex-col">
          {/* Graph - fills all available space, clipped */}
          <div className="flex-1 min-h-0 relative overflow-hidden max-h-[calc(100vh-256px)]">
            <PathWheel
              step={step}
              selectedFamily={selectedFamily}
              selectedInterests={selectedInterests}
              emailSubmitted={emailSubmitted}
            />
          </div>

          {/* Quiz bar - fixed height at bottom */}
          <div className="shrink-0 border-t border-navy-700 bg-navy-950/95 backdrop-blur-sm h-[200px]">
            <div className="max-w-[600px] mx-auto px-6 py-4 h-full flex flex-col">
              {/* Progress */}
              <div className="flex items-center justify-center gap-2 mb-3">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      s === step
                        ? "w-6 bg-lime"
                        : s < step
                          ? "w-1.5 bg-lime/40"
                          : "w-1.5 bg-navy-700"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Pick your path */}
                {step === 1 && (
                  <motion.div
                    key="s1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-lime/60 mb-3 text-center">
                      Pick your path
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {JOB_FAMILIES.map((fam) => (
                        <button
                          key={fam.id}
                          onClick={() => handleSelectFamily(fam.id)}
                          className="group flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-navy-700 bg-navy-900/60 hover:bg-navy-800/60 hover:border-lime/30 transition-all duration-200 cursor-pointer"
                        >
                          <div className="text-white/50 group-hover:text-lime transition-colors [&>svg]:w-3.5 [&>svg]:h-3.5">
                            {ICON_MAP[fam.iconId]}
                          </div>
                          <span className="text-[9px] font-medium text-center leading-[1.2] text-white/70 group-hover:text-white transition-colors">
                            {fam.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Pick your interests */}
                {step === 2 && (
                  <motion.div
                    key="s2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back
                      </button>
                      <p className="text-xs uppercase tracking-[0.2em] text-lime/60">
                        Pick your interests
                      </p>
                      <div className="w-10" />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {availableInterests.map((interest) => {
                        const selected = selectedInterests.has(interest.id);
                        return (
                          <button
                            key={interest.id}
                            onClick={() => toggleInterest(interest.id)}
                            className={`
                              px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 cursor-pointer
                              ${
                                selected
                                  ? "border-lime/50 bg-lime/[0.1] text-lime"
                                  : "border-navy-700 bg-navy-900/60 text-white/60 hover:bg-navy-800/60 hover:border-navy-600 hover:text-white"
                              }
                            `}
                          >
                            {interest.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={handleAdvanceToGate}
                        disabled={selectedInterests.size === 0}
                        className={`
                          flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200
                          ${
                            selectedInterests.size > 0
                              ? "bg-white text-navy-950 hover:bg-lime cursor-pointer shadow-sm"
                              : "bg-navy-800 text-white/30 cursor-not-allowed"
                          }
                        `}
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Email gate */}
                {step === 3 && (
                  <motion.div
                    key="s3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Back
                      </button>
                      <div className="flex items-center gap-2 text-xs text-lime/60">
                        <Lock className="w-3 h-3" />
                        <span className="uppercase tracking-[0.2em]">
                          Unlock your path
                        </span>
                      </div>
                      <div className="w-10" />
                    </div>
                    <p className="text-sm text-white/50 text-center mb-3">
                      We found{" "}
                      <span className="text-lime font-medium">
                        {filteredExperts.length} experts and lessons
                      </span>{" "}
                      in{" "}
                      <span className="text-white/70">
                        {selectedInterestLabels.join(", ")}
                      </span>
                      . Enter your email to unlock your personalized learning
                      path.
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        <input
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmitEmail();
                          }}
                          className={`
                            w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-navy-900 border text-sm
                            text-white placeholder:text-white/30
                            focus:outline-none focus:ring-2 focus:ring-lime/30 focus:border-lime/40
                            transition-all duration-200
                            ${emailError ? "border-red-400/60" : "border-navy-700"}
                          `}
                        />
                      </div>
                      <button
                        onClick={handleSubmitEmail}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-[10px] bg-white text-navy-950 hover:bg-lime cursor-pointer shadow-sm text-sm font-medium transition-all duration-200"
                      >
                        Unlock
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    {emailError && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1.5 text-xs text-red-400/80 text-center"
                      >
                        {emailError}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 max-w-[1100px] mx-auto w-full mt-[56px] border-l border-r border-navy-700 bg-navy-950">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Results Header */}
              <section className="pt-16 sm:pt-20 pb-10 px-6">
                <div className="max-w-[820px] mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-lime/60 mb-4">
                      Your learning path
                    </p>
                    <h2
                      className="text-[36px] sm:text-[48px] font-light font-serif text-white leading-[1.15] tracking-[-1.92px]"
                      style={{ fontFeatureSettings: "'ss01' 1" }}
                    >
                      {filteredExperts.length} experts in{" "}
                      <span className="text-lime">
                        {familyObj?.label ?? "your field"}
                      </span>
                    </h2>
                    <p className="mt-4 text-lg text-white/50 leading-[1.6]">
                      Your personalized path through{" "}
                      {selectedInterestLabels.join(", ")}. Click any expert to
                      explore their courses on Maven.
                    </p>
                  </motion.div>

                  {/* Selected interest pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="mt-6 flex flex-wrap gap-2"
                  >
                    {Array.from(selectedInterests).map((intId) => {
                      const interest = availableInterests.find(
                        (i) => i.id === intId
                      );
                      if (!interest) return null;
                      return (
                        <span
                          key={intId}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-lime/20 bg-lime/[0.06] text-sm text-lime/80"
                        >
                          {interest.label}
                        </span>
                      );
                    })}
                  </motion.div>
                </div>
              </section>

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
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
