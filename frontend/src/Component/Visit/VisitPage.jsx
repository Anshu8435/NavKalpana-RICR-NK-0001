import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  LineChart, 
  FileSpreadsheet, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  ChevronRight,
  Heart,
  Stethoscope,
  CheckCircle2,
  Sliders,
  Layers,
  Zap
} from "lucide-react";

function VisitPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans bg-[#F5F8FC] text-[#172B3A] selection:bg-[#20D9C2]/30 selection:text-[#0B1F33]">
      
      {/* Top Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1F33]/90 backdrop-blur-md shadow-lg shadow-black/10 py-3.5 border-b border-white/10"
            : "bg-[#0B1F33] py-5 border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#13B8A6] to-[#20D9C2] shadow-md shadow-[#20D9C2]/20">
              <Activity className="text-[#0B1F33] stroke-[2.5]" size={22} />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20D9C2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#20D9C2]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  CardioShield
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#20D9C2]/20 text-[#20D9C2] font-mono border border-[#20D9C2]/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Clinical Risk Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-slate-300 hover:text-[#20D9C2] transition-colors"
            >
              Clinical Rationale
            </button>
            <button
              onClick={() => scrollToSection("pipeline")}
              className="text-sm font-medium text-slate-300 hover:text-[#20D9C2] transition-colors"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-slate-300 hover:text-[#20D9C2] transition-colors"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-slate-300 hover:text-[#20D9C2] transition-colors"
            >
              Workflow
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="relative group overflow-hidden bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] px-5 py-2 rounded-xl text-sm font-bold shadow-md shadow-[#20D9C2]/25 hover:shadow-lg hover:shadow-[#20D9C2]/40 transition-all duration-200 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Launch Portal
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 bg-gradient-to-b from-[#0B1F33] via-[#0E2A44] to-[#123B5D] text-white overflow-hidden">
        {/* Subtle background grid & glowing flares */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(32,217,194,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[#13B8A6]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#20D9C2]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Clinical AI Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20D9C2] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20D9C2]"></span>
                </span>
                <span className="text-xs font-semibold tracking-wide text-slate-200">
                  Calibrated XGBoost & TreeSHAP Decision Support
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-display">
                Precision Cardiovascular <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20D9C2] via-[#E8F8F4] to-white">
                  Risk Stratification
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Empowering cardiologists and clinical teams with transparent machine learning. 
                Move beyond static risk charts with personalized probabilistic assessments, 
                explainable biomarker attributions, and actionable counterfactual recommendations.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] px-7 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-[#20D9C2]/20 hover:shadow-xl hover:shadow-[#20D9C2]/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  <Stethoscope size={18} />
                  <span>Start Patient Assessment</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => scrollToSection("pipeline")}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3.5 rounded-xl font-semibold text-base backdrop-blur-md transition-all duration-200 flex items-center gap-2"
                >
                  <Cpu size={18} className="text-[#20D9C2]" />
                  <span>Explore Model Specs</span>
                </button>
              </div>

              {/* Key Validation Metrics Banner */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#20D9C2] font-mono">
                    84.7%
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">High-Risk Recall</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    0.884
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">Validation ROC-AUC</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#20D9C2] font-mono">
                    &lt; 50ms
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">Inference Latency</div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Clinical Card Preview */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative glow backing */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] opacity-30 blur-xl"></div>
                
                <div className="relative rounded-2xl bg-[#0B1F33]/90 border border-white/15 p-6 backdrop-blur-xl shadow-2xl space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-[#20D9C2]">
                        <Heart size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Clinical Assessment Demo</div>
                        <div className="text-[10px] text-slate-400">Patient: #CS-8924 • Male, 54y</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Low Risk (14.2%)
                    </span>
                  </div>

                  {/* Vitals Summary Pill Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Blood Pressure</span>
                      <span className="text-sm font-bold text-white font-mono">122 / 78</span>
                      <span className="text-[10px] text-slate-400 ml-1">mmHg</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Cholesterol</span>
                      <span className="text-sm font-bold text-white font-mono">194</span>
                      <span className="text-[10px] text-slate-400 ml-1">mg/dL</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Fasting Glucose</span>
                      <span className="text-sm font-bold text-white font-mono">98</span>
                      <span className="text-[10px] text-slate-400 ml-1">mg/dL</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Body Mass Index</span>
                      <span className="text-sm font-bold text-white font-mono">24.2</span>
                      <span className="text-[10px] text-emerald-400 ml-1">Normal</span>
                    </div>
                  </div>

                  {/* SHAP Attribution Preview */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Top Protective Factors (SHAP)</span>
                      <span className="text-[#20D9C2] font-mono text-[11px]">-0.18 Impact</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-emerald-400 h-full w-[65%]" title="Optimal Systolic BP"></div>
                      <div className="bg-[#20D9C2] h-full w-[25%]" title="Active Lifestyle"></div>
                      <div className="bg-slate-500 h-full w-[10%]" title="Non-Smoker"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Normotensive BP (-0.12)</span>
                      <span>Regular Physical Activity (-0.06)</span>
                    </div>
                  </div>

                  {/* Recommendation Callout */}
                  <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#20D9C2] shrink-0 mt-0.5" />
                    <span>
                      Hemodynamic markers are within optimal clinical bounds. Next routine screening recommended in 12 months.
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-white border-y border-[#E0E8F0]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-xl">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#0B1F33] font-display mb-1">
                70,000+
              </div>
              <div className="text-xs md:text-sm text-[#627487] font-medium">
                Clinical Training Cohort
              </div>
            </div>

            <div className="p-4 rounded-xl">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#13B8A6] font-display mb-1">
                99.8%
              </div>
              <div className="text-xs md:text-sm text-[#627487] font-medium">
                System Uptime & Stability
              </div>
            </div>

            <div className="p-4 rounded-xl">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#0B1F33] font-display mb-1">
                13+
              </div>
              <div className="text-xs md:text-sm text-[#627487] font-medium">
                Evaluated Clinical Biomarkers
              </div>
            </div>

            <div className="p-4 rounded-xl">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#123B5D] font-display mb-1">
                HIPAA / GDPR
              </div>
              <div className="text-xs md:text-sm text-[#627487] font-medium">
                Compliant Data Architecture
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Architectural Pipeline Section */}
      <section id="pipeline" className="py-20 bg-[#F5F8FC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#13B8A6] bg-[#E8F8F4] px-3 py-1 rounded-full border border-teal-200">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F33] mt-3 mb-4 font-display">
              Explainable AI Clinical Decision Architecture
            </h2>
            <p className="text-base text-[#627487] leading-relaxed">
              CardioShield AI replaces opaque black-box scoring with a structured, 
              clinically auditable 4-stage pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            
            {/* Stage 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E0E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#13B8A6] mb-5">
                <Sliders size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#13B8A6] uppercase tracking-wider">
                Phase 01
              </span>
              <h3 className="text-lg font-bold text-[#0B1F33] mt-1 mb-2">
                Clinical Ingestion
              </h3>
              <p className="text-xs text-[#627487] leading-relaxed">
                Captures systolic/diastolic BP, lipid profiles, glycemic status, physical metrics, 
                and behavioral indicators with strict bounds validation.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E0E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#123B5D] mb-5">
                <Layers size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#123B5D] uppercase tracking-wider">
                Phase 02
              </span>
              <h3 className="text-lg font-bold text-[#0B1F33] mt-1 mb-2">
                Hemodynamic Engineering
              </h3>
              <p className="text-xs text-[#627487] leading-relaxed">
                Derives Mean Arterial Pressure (MAP), Pulse Pressure, and Atherogenic Risk Indices 
                to capture cardiovascular arterial stiffness.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E0E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#13B8A6] mb-5">
                <Cpu size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-[#13B8A6] uppercase tracking-wider">
                Phase 03
              </span>
              <h3 className="text-lg font-bold text-[#0B1F33] mt-1 mb-2">
                Calibrated XGBoost
              </h3>
              <p className="text-xs text-[#627487] leading-relaxed">
                Applies Platt Scaling / Isotonic regression on gradient-boosted trees to output 
                true probabilistic risk distributions rather than raw logits.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E0E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                <LineChart size={22} />
              </div>
              <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                Phase 04
              </span>
              <h3 className="text-lg font-bold text-[#0B1F33] mt-1 mb-2">
                SHAP Attribution
              </h3>
              <p className="text-xs text-[#627487] leading-relaxed">
                Computes exact Shapley values showing each biomarker’s positive or negative 
                contribution, paired with counterfactual recommendations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Rationale / Pillars Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#13B8A6] bg-[#E8F8F4] px-3 py-1 rounded-full border border-teal-200">
              Why CardioShield AI
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F33] mt-3 mb-4 font-display">
              Engineered for Clinical Rigor and Trust
            </h2>
            <p className="text-base text-[#627487] leading-relaxed">
              Standard cardiovascular risk calculators like Framingham or ASCVD rely on broad cohort averages. 
              CardioShield combines population-level datasets with non-linear feature interactions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0] hover:border-[#13B8A6]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#13B8A6] mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F33] mb-3">
                Clinically Calibrated Probabilities
              </h3>
              <p className="text-sm text-[#627487] leading-relaxed">
                A 30% risk prediction means that out of 100 similar patients, exactly 30 will develop cardiovascular disease. 
                Our calibration curves maintain near-zero expected calibration error (ECE).
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0] hover:border-[#13B8A6]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#123B5D] mb-6">
                <LineChart size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F33] mb-3">
                No "Black Box" Enigma
              </h3>
              <p className="text-sm text-[#627487] leading-relaxed">
                Every prediction is mathematically decomposable via TreeSHAP. Physicians see precisely how much systolic blood pressure, 
                smoking history, or BMI tilted the risk score.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F5F8FC] border border-[#E0E8F0] hover:border-[#13B8A6]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#13B8A6] mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#0B1F33] mb-3">
                Counterfactual What-Ifs
              </h3>
              <p className="text-sm text-[#627487] leading-relaxed">
                Translate risk into action. The system calculates exact target interventions—such as reducing systolic BP by 15 mmHg—and 
                models the potential risk reduction before prescribing.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-[#F5F8FC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F33] mb-4 font-display">
              Enterprise Clinical Capabilities
            </h2>
            <p className="text-base text-[#627487]">
              Designed to fit seamlessly into outpatient cardiology, general practice, and inpatient triage workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-white p-7 rounded-2xl border border-[#E0E8F0] hover:shadow-lg transition-all">
              <Activity className="text-[#13B8A6] mb-4" size={26} />
              <h4 className="text-lg font-bold text-[#0B1F33] mb-2">Automated Risk Stratification</h4>
              <p className="text-xs text-[#627487] leading-relaxed">
                Instant categorization into Low (&lt;20%), Moderate (20-49%), and High (&ge;50%) risk tiers with clear visual alert badging.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#E0E8F0] hover:shadow-lg transition-all">
              <FileSpreadsheet className="text-[#123B5D] mb-4" size={26} />
              <h4 className="text-lg font-bold text-[#0B1F33] mb-2">Comprehensive Patient Records</h4>
              <p className="text-xs text-[#627487] leading-relaxed">
                Centralized registry with longitudinal tracking, search filtering, and instant recall of historical assessments.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#E0E8F0] hover:shadow-lg transition-all">
              <Lock className="text-[#13B8A6] mb-4" size={26} />
              <h4 className="text-lg font-bold text-[#0B1F33] mb-2">Role-Based Access & Security</h4>
              <p className="text-xs text-[#627487] leading-relaxed">
                Strict JWT token authentication, bcrypt password hashing, and granular doctor/admin permission controls.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works 3-Step Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1F33] mb-4 font-display">
              Streamlined 3-Step Assessment
            </h2>
            <p className="text-base text-[#627487]">
              Complete a full cardiovascular assessment in under 60 seconds during clinical rounds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0B1F33] text-[#20D9C2] font-mono text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg">
                01
              </div>
              <h4 className="text-lg font-bold text-[#0B1F33] mb-2">Record Vitals</h4>
              <p className="text-xs text-[#627487] leading-relaxed">
                Enter age, blood pressure, BMI, serum cholesterol, glucose, and lifestyle factors in the structured vitals portal.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-[#123B5D] text-white font-mono text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg">
                02
              </div>
              <h4 className="text-lg font-bold text-[#0B1F33] mb-2">Model Inference</h4>
              <p className="text-xs text-[#627487] leading-relaxed">
                Our calibrated XGBoost engine computes probabilities, executes TreeSHAP attribution, and identifies risk drivers in real-time.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-2xl bg-[#13B8A6] text-white font-mono text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg">
                03
              </div>
              <h4 className="text-lg font-bold text-[#0B1F33] mb-2">Actionable Care Plan</h4>
              <p className="text-xs text-[#627487] leading-relaxed">
                Review the interactive gauge, explore what-if lifestyle adjustments, and export a clinical report for the patient file.
              </p>
            </div>

          </div>

          {/* Bottom CTA Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-[#0B1F33] via-[#123B5D] to-[#0B1F33] p-10 md:p-14 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className="text-2xl md:text-3xl font-extrabold font-display">
                Ready to elevate clinical cardiovascular care?
              </h3>
              <p className="text-sm text-slate-300">
                Join forward-thinking clinicians using CardioShield AI to detect cardiovascular risk early and accurately.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl hover:shadow-[#20D9C2]/30 hover:scale-105 transition-all duration-200"
                >
                  Create Practitioner Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1F33] text-slate-400 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-10 text-xs">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#20D9C2] flex items-center justify-center text-[#0B1F33]">
                  <Activity size={16} className="stroke-[2.5]" />
                </div>
                <span className="text-base font-bold text-white font-display">
                  CardioShield AI
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Clinical decision support system for cardiovascular risk stratification powered by explainable machine learning.
              </p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 tracking-wider uppercase text-[11px]">Platform</h5>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection("pipeline")} className="hover:text-[#20D9C2] transition-colors">Pipeline Architecture</button></li>
                <li><button onClick={() => scrollToSection("features")} className="hover:text-[#20D9C2] transition-colors">Risk Metrics</button></li>
                <li><button onClick={() => scrollToSection("about")} className="hover:text-[#20D9C2] transition-colors">Validation Study</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 tracking-wider uppercase text-[11px]">Compliance</h5>
              <ul className="space-y-2">
                <li><span className="text-slate-400">HIPAA Data Security</span></li>
                <li><span className="text-slate-400">Audit Logging</span></li>
                <li><span className="text-slate-400">Platt Probabilistic Calibration</span></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white mb-3 tracking-wider uppercase text-[11px]">Clinical Disclaimer</h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                CardioShield AI is designed strictly as a clinical decision support tool for certified healthcare professionals. 
                It is not an automated diagnostic substitute for independent clinical judgment.
              </p>
            </div>

          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <span>© 2026 CardioShield AI. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>Secure 256-bit SSL</span>
              <span>•</span>
              <span>Model v2.4 Active</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default VisitPage;
