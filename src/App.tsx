import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import ContactForm from './components/ContactForm'
import Blog from './components/Blog'
import Footer from './components/Footer'
import AdminDashboard from './components/AdminDashboard'
import ProjectDetail from './components/ProjectDetail'
import CampusNexus from './components/CampusNexus'
import PolyMX from './components/PolyMX'
import Logistics from './components/Logistics'
import CustomSolutions from './components/CustomSolutions'
import About from './components/About'
import TrustedBy from './components/TrustedBy'
import TechStack from './components/TechStack'
import HowWeWork from './components/HowWeWork'
import useScrollReveal from './hooks/useScrollReveal'
import './App.css'

function ScrollToHashElement() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);

  return null;
}

function ClientLayout() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-slate-50 text-[#010B33] selection:bg-[#45C7AC]/30 selection:text-[#010B33] font-sans antialiased">
      <Header />
      
      {/* Floating admin portal link */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          to="/admin"
          className="bg-[#010B33] hover:bg-slate-800 text-secondary border border-secondary/20 shadow-lg px-4 py-2.5 rounded-full text-xs font-bold font-mono transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
          style={{ textDecoration: 'none' }}
        >
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          Admin Panel
        </Link>
      </div>

      <main>
        <Hero />
        <TrustedBy />
        <Services />
        <HowWeWork />
        <Projects />
        <TechStack />
        <Testimonials />
        <FAQ />
        <Blog />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToHashElement />
      <Routes>
        <Route path="/" element={<ClientLayout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/campusnexus" element={<CampusNexus />} />
        <Route path="/polymx" element={<PolyMX />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/custom" element={<CustomSolutions />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App

