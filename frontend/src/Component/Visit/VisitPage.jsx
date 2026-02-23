import image from "../../assets/image.png";
import logo from "../../assets/logo.png";
import  {useNavigate}  from "react-router-dom";
function VisitPage() {
  const naviagate = useNavigate();
  return (
    <>
       
  <body class="m-0 font-['Segoe_UI',Arial,sans-serif] bg-gray-50 text-gray-800 antialiased">

  {/* <!-- Sticky Header / Navbar --> */}
  <header class="header sticky top-0 z-[1000] flex items-center justify-between 
                 bg-gradient-to-r from-[#0a3d62] to-[#3c6382] px-8 py-4 
                 text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)]">

    {/* <!-- Logo + Brand --> */}
    <div class="flex items-center gap-3">
      <img src={logo} alt="CardioShield Logo" class="h-10 w-auto  bg-gradient-to-r from-[#0a3d62]"/>
      <span class="text-white text-xl font-semibold tracking-wide">
        CardioShield AI
      </span>
    </div>

    {/* <!-- Navigation --> */}
    <nav>
      <ul class="flex list-none gap-8 m-0 p-0">
        <li>
          <a href="#about"
             class="no-underline text-white font-medium relative transition-all duration-300
                    hover:text-[#ffdd59] hover:shadow-[0_0_6px_#ffdd59]">
            About
            <span class="absolute left-0 bottom-[-6px] h-0.5 bg-[#ffdd59] w-0 transition-[width] duration-300 hover:w-full"></span>
          </a>
        </li>
        <li>
          <a href="#features"
             class="no-underline text-white font-medium relative transition-all duration-300
                    hover:text-[#ffdd59] hover:shadow-[0_0_6px_#ffdd59]">
            Features
            <span class="absolute left-0 bottom-[-6px] h-0.5 bg-[#ffdd59] w-0 transition-[width] duration-300 hover:w-full"></span>
          </a>
        </li>
        <li>
          <a href="#contact"
             class="no-underline text-white font-medium relative transition-all duration-300
                    hover:text-[#ffdd59] hover:shadow-[0_0_6px_#ffdd59]">
            Contact
            <span class="absolute left-0 bottom-[-6px] h-0.5 bg-[#ffdd59] w-0 transition-[width] duration-300 hover:w-full"></span>
          </a>
        </li>
      </ul>
    </nav>

    {/* <!-- CTA Buttons (updated class names for clarity) --> */}
    <div class="flex items-center gap-4">
      <button href="#demo"
         class="login no-underline bg-[#e74c3c] text-white px-6 py-3 rounded-lg font-semibold
                transition-colors duration-300 hover:bg-[#c0392b]"  onClick={() => naviagate("/login")}>
        Login
      </button>
      <button href="#contact"
         class="signup no-underline bg-[#e74c3c] text-white px-6 py-3 rounded-[25px] font-bold
                shadow-[0_3px_10px_rgba(231,76,60,0.6)] transition-all duration-300
                hover:bg-[#c0392b] hover:shadow-[0_0_15px_#e74c3c]" onClick={() => naviagate("/signup")}>
        Get Started
      </button>
    </div>
  </header>

  {/* <!-- Main Content Sections --> */}
  <section id="about" class="py-12 md:py-16 max-w-5xl mx-auto px-8 text-center">
    <h2 class="text-center mb-8 text-3xl md:text-4xl font-bold text-[#0a3d62]">
      About Cardio AI
    </h2>
    <p class="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
      Cardio AI empowers cardiologists with real-time ECG analysis, predictive diagnostics, 
      and seamless remote monitoring. Built with advanced AI and secure cloud technology.
    </p>
  </section>

  <section id="features" class="py-12 md:py-16 bg-white">
    <div class="max-w-6xl mx-auto px-8">
      <h2 class="text-center mb-12 text-3xl md:text-4xl font-bold text-[#0a3d62]">
        Features
      </h2>
      <div class="features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="feature bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200">
          <h3 class="text-xl font-semibold mb-3">🧠 AI ECG Interpretation</h3>
          <p class="text-gray-600">Instant detection of arrhythmias and anomalies.</p>
        </div>
        <div class="feature bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200">
          <h3 class="text-xl font-semibold mb-3">📊 Smart Dashboard</h3>
          <p class="text-gray-600">Visualize patient trends and alerts in real-time.</p>
        </div>
        <div class="feature bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200">
          <h3 class="text-xl font-semibold mb-3">🌐 Remote Monitoring</h3>
          <p class="text-gray-600">Seamless integration with wearable devices.</p>
        </div>
        <div class="feature bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-200">
          <h3 class="text-xl font-semibold mb-3">🔒 Secure & Scalable</h3>
          <p class="text-gray-600">End-to-end encryption and multi-hospital support.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="py-12 md:py-16 max-w-5xl mx-auto px-8 text-center">
    <h2 class="text-center mb-8 text-3xl md:text-4xl font-bold text-[#0a3d62]">
      Contact Us
    </h2>
    <p class="text-lg text-gray-700 mb-4">
      Interested in a demo or partnership? Reach out to us today.
    </p>
    <p class="text-xl font-medium text-[#0a3d62]">
      Email: <a href="mailto:contact@cardioai.com" class="hover:underline">contact@cardioai.com</a>
    </p>
  </section>

  <footer class="bg-[#0a3d62] text-white text-center py-6 mt-8">
    <p class="text-sm">© 2026 Cardio AI. All rights reserved.</p>
  </footer>

</body>
    </>
  );
}

export default VisitPage;
