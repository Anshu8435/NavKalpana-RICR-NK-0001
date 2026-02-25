import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

function VisitPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg py-4"
            : "bg-white py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="CardioShield Logo" className="h-12 w-auto" />
            <span
              className={`text-2xl font-bold tracking-tight ${
                scrolled ? "text-blue-100" : "text-white"
              }`}
            >
              CardioShield AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className={`font-medium transition-colors ${
                scrolled
                  ? "text-gray-100 hover:text-blue-600"
                  : "text-white hover:text-blue-200"
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className={`font-medium transition-colors ${
                scrolled
                  ? "text-gray-100 hover:text-blue-600"
                  : "text-white hover:text-blue-200"
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={`font-medium transition-colors ${
                scrolled
                  ? "text-gray-100 hover:text-blue-600"
                  : "text-white hover:text-blue-200"
              }`}
            >
              How It Works
            </button>
         
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                scrolled
                  ? "text-blue-900 hover:bg-blue-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20  text-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-blue-500/30 text-blue-500 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                  🏥 AI-Powered Cardiovascular Risk Assessment
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Predict Heart Disease
                <span className="block text-blue-400">Before It Happens</span>
              </h1>
              
              <p className="text-xl text-blue-500 leading-relaxed max-w-xl">
                Leverage advanced machine learning to assess cardiovascular risk with 95% accuracy. 
                Get instant predictions, actionable insights, and SHAP-based explanations.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
                >
                  Start Free Assessment
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Learn More
                </button>
              </div>

              <div className="flex items-center gap-8 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-blue-200 text-sm">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-blue-200 text-sm">Predictions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-blue-200 text-sm">Healthcare Providers</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-200 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                      ❤️
                    </div>
                    <div>
                      <div className="font-semibold">Real-time Analysis</div>
                      <div className="text-sm text-BLACK">Instant risk assessment</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-lg">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                      🧠
                    </div>
                    <div>
                      <div className="font-semibold">AI-Powered Insights</div>
                      <div className="text-sm text-BLACK">SHAP explanations included</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-blue-100 rounded-lg">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">
                      📊
                    </div>
                    <div>
                      <div className="font-semibold">Comprehensive Reports</div>
                      <div className="text-sm text-BLACK">Detailed health metrics</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-blue-900 mb-2">95%</div>
              <div className="text-gray-600 font-medium">Model Accuracy</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-blue-900 mb-2">&lt;2s</div>
              <div className="text-gray-600 font-medium">Prediction Time</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-blue-900 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Availability</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-blue-900 mb-2">HIPAA</div>
              <div className="text-gray-600 font-medium">Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose CardioShield AI?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We combine cutting-edge machine learning with clinical expertise to deliver 
              the most accurate cardiovascular risk predictions available.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Precision Medicine</h3>
              <p className="text-gray-700 leading-relaxed">
                Our AI analyzes 13+ cardiovascular risk factors to provide personalized 
                risk assessments tailored to each patient's unique profile.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-700 leading-relaxed">
                Get instant predictions in under 2 seconds. No waiting, no delays—just 
                immediate, actionable insights for better patient care.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg">
                🔬
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Evidence-Based</h3>
              <p className="text-gray-700 leading-relaxed">
                Trained on extensive datasets with validation from clinical trials. 
                Every prediction is backed by scientific research and real-world data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Better Care
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to assess, monitor, and manage cardiovascular risk
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Risk Prediction</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced Random Forest algorithm trained on 300,000+ patient records 
                for industry-leading accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">SHAP Explanations</h3>
              <p className="text-gray-600 leading-relaxed">
                Understand exactly which factors contribute to risk scores with 
                explainable AI visualizations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Patient Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Track all patient assessments, view trends, and monitor progress 
                over time in one place.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate comprehensive PDF reports with risk scores, recommendations, 
                and patient history.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                HIPAA-compliant encryption, secure authentication, and complete 
                data privacy protection.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                RESTful API with complete documentation for seamless integration 
                with existing systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, fast, and accurate cardiovascular risk assessment in 3 easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/4 left-1/3 right-1/3 h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
            
            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-white text-2xl font-bold relative z-10">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enter Patient Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Input basic health metrics including age, blood pressure, cholesterol, 
                glucose levels, and lifestyle factors.
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-white text-2xl font-bold relative z-10">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Our machine learning model processes the data instantly, analyzing 
                patterns and risk factors with 95% accuracy.
              </p>
            </div>

            <div className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-white text-2xl font-bold relative z-10">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive detailed risk assessment with SHAP explanations, actionable 
                recommendations, and downloadable reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Patient Care?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Join hundreds of healthcare providers using CardioShield AI to save lives 
            through early cardiovascular risk detection.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-900 px-10 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => window.location.href = "mailto:contact@cardioshield.ai"}
              className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
            >
              Contact Sales
            </button>
          </div>

          <div className="text-blue-200">
            <p className="mb-2">📧 Email: contact@cardioshield.ai</p>
            <p>🌐 Available 24/7 for healthcare professionals</p>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="CardioShield Logo" className="h-10 w-auto" />
                <span className="text-white text-xl font-bold">CardioShield AI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Advanced AI-powered cardiovascular risk assessment for modern healthcare.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection("how-it-works")} className="hover:text-white transition-colors">How It Works</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors">About Us</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 CardioShield AI. All rights reserved. HIPAA Compliant.
            </p>
         
          </div>
        </div>
      </footer>
    </div>
  );
}

export default VisitPage;
