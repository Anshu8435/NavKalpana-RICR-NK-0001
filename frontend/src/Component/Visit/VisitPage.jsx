function VisitPage() {
  return (
    <>
      <body class="text-slate-900">
        {/* <!-- HEADER (ORIGINAL NAVY COLOR) --> */}
        <header class="bg-[#0F172A] sticky top-0 z-[50] border-b border-white/5 shadow-2xl">
          <div class="max-w-[1680px] mx-auto px-4 h-20 flex items-center justify-between">
            <div class="flex items-center gap-12">
              {/* <!-- Logo --> */}
              <div className="flex items-center gap-12 ml-4">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="bg-gradient-to-tr from-white to-slate-200 px-4 py-1.5 rounded-xl shadow-lg transition-all group-hover:scale-105">
                    <span className="text-[#0F172A] font-extrabold text-xl tracking-tight italic">
                      Cardio<span className="text-[#38BDF8]">AI</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* <!-- Navigation --> */}
              <nav className="absolute left-[40%] -translate-x-1/2 hidden lg:flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
                <a className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#38BDF8]/20 border border-[#38BDF8]/30">
                  Dashboard
                </a>

                <a className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                  Diagnostics
                </a>

                <a className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                  Reports
                </a>

                <a className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                  About
                </a>
              </nav>
            </div>

            <div class="flex items-center gap-4">
              <div class="hidden xl:block bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <p class="text-[11px] text-[#38BDF8] font-bold uppercase tracking-widest text-center">
                  AI Heart Monitor Active
                </p>
                <p class="text-[10px] text-slate-400 text-center">
                  Status: Pulse Synchronized
                </p>
              </div>

              <div class="flex items-center gap-4 border-l border-white/10 pl-6">
                <button class="bg-[#22c3f0] hover:bg-[#22c3f0]px-6  text-[#0F172A] px-4 py-2 rounded-xl font-bold text-sm transition-all">
                  Login
                </button>
                <button class="bg-[#22c3f0] hover:bg-[#22c3f0]  px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#38BDF8]/20 transition-all hover:scale-[1.03]">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* <!-- HERO SECTION (LIGHT THEME AS PER YOUR REQUEST) --> */}
        <section class="relative max-w-7xl mx-auto px-6 mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* <!-- Decorative Background --> */}
          <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[#F0F9FF] via-white to-[#F8FAFC]"></div>
          <div class="absolute -top-24 -left-24 w-96 h-96 bg-[#38BDF8]/20 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-0 w-72 h-72 bg-[#0F172A]/10 rounded-full blur-2xl"></div>

          {/* <!-- Left Content --> */}
          <div>
            <div class="inline-block bg-[#38BDF8]/10 text-[#38BDF8] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#38BDF8]/20 shadow-sm">
              Next-Gen Neural Cardiac Lab
            </div>
            <h1 class="text-6xl font-extrabold text-[#0F172A] leading-tight">
              AI-Driven Heart <br />
              <span class="text-[#38BDF8] relative">
                Diagnostics
                <span class="absolute left-0 -bottom-2 w-full h-1 bg-[#38BDF8] animate-pulse rounded-full"></span>
              </span>{" "}
              Platform
            </h1>
            <p class="mt-5 text-slate-600 max-w-xl text-lg leading-relaxed">
              Monitor cardiac health in real-time, predict anomalies instantly,
              and scale clinical evaluations with enterprise-grade Medical AI.
            </p>

            {/* <!-- CTA Buttons --> */}
            <div class="mt-8 flex gap-4">
              <button class="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#1a2b4b] hover:scale-105 transition-all">
                Start Pulse Scan
              </button>
              <button class="border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-[#0F172A] hover:bg-slate-50 hover:scale-105 transition-all">
                View AI Analytics
              </button>
            </div>
          </div>

          {/* <!-- Right Stats Card --> */}
          <div class="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
            <div class="flex justify-between items-center mb-8">
              <h3 class="text-xl font-bold text-[#0F172A]">
                Real-Time Health Stats
              </h3>
              <span class="text-2xl animate-pulse">❤️</span>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all">
                <p class="text-3xl font-bold text-cyan-600">72</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                  Live BPM
                </p>
              </div>
              <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all">
                <p class="text-3xl font-bold text-cyan-600">98.2%</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                  AI Precision
                </p>
              </div>
              <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all">
                <p class="text-3xl font-bold text-cyan-600">120/80</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                  Blood Pressure
                </p>
              </div>
              <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-all">
                <p class="text-3xl font-bold text-cyan-600">Low</p>
                <p class="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">
                  Arrest Risk Index
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <!-- FEATURES --> */}
        <section class="max-w-7xl mx-auto px-6 mt-28">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-[#0F172A]">Why Cardio AI?</h2>
            <p class="text-slate-500 mt-2">
              Revolutionizing cardiovascular healthcare with intelligence.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-50 hover:-translate-y-2 transition-all duration-300">
              <div class="w-12 h-12 bg-[#38BDF8]/10 rounded-xl flex items-center justify-center text-xl mb-6">
                🩺
              </div>
              <h4 class="text-lg font-bold text-[#0F172A]">Neural ECG Scan</h4>
              <p class="mt-3 text-sm text-slate-600 leading-relaxed">
                Analyze complex heart rhythms using deep-learning neural
                networks.
              </p>
            </div>
            <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-50 hover:-translate-y-2 transition-all duration-300">
              <div class="w-12 h-12 bg-[#38BDF8]/10 rounded-xl flex items-center justify-center text-xl mb-6">
                📊
              </div>
              <h4 class="text-lg font-bold text-[#0F172A]">
                Predictive Alerts
              </h4>
              <p class="mt-3 text-sm text-slate-600 leading-relaxed">
                Get notified of potential risks before they become clinical
                emergencies.
              </p>
            </div>
            <div class="bg-white rounded-3xl p-8 shadow-lg border border-slate-50 hover:-translate-y-2 transition-all duration-300">
              <div class="w-12 h-12 bg-[#38BDF8]/10 rounded-xl flex items-center justify-center text-xl mb-6">
                📁
              </div>
              <h4 class="text-lg font-bold text-[#0F172A]">
                Instant EHR Reports
              </h4>
              <p class="mt-3 text-sm text-slate-600 leading-relaxed">
                Generate shareable, clinical-grade reports for medical
                specialists.
              </p>
            </div>
          </div>
        </section>

        <footer class="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-16 mt-20">
          <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h4 class="font-bold text-lg mb-4">Cardio AI</h4>
              <p class="text-sm text-slate-300">
                Next-gen neural cardiac diagnostics powered by AI.
              </p>
            </div>
            <div>
              <h4 class="font-bold text-lg mb-4">Resources</h4>
              <ul class="space-y-2 text-slate-300 text-sm">
                <li>
                  <a href="#" class="hover:text-[#38BDF8]">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" class="hover:text-[#38BDF8]">
                    API Access
                  </a>
                </li>
                <li>
                  <a href="#" class="hover:text-[#38BDF8]">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-lg mb-4">Connect</h4>
              <ul class="space-y-2 text-slate-300 text-sm">
                <li>
                  <a href="#" class="hover:text-[#38BDF8]">
                    Email
                  </a>
                </li>
                <li>
                  <a href="#" class="hover:text-[#38BDF8]">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" class="hover:text-[#38BDF8]">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="text-center text-xs text-slate-400 mt-12 border-t border-slate-700 pt-6 tracking-[3px]">
            © 2026 CARDIO AI INTELLIGENCE PLATFORM
          </div>
        </footer>
      </body>
    </>
  );
}

export default VisitPage;
