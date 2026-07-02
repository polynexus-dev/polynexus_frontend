import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown, Cpu, Database, Globe, Layers } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo/logo.png';

const products = [
  {
    name: 'CampusNexus',
    to: '/campusnexus',
    desc: 'University Administrative ERP',
    icon: Cpu,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    name: 'PolyMX Suite',
    to: '/polymx',
    desc: 'Secure Workspace & Collaboration',
    icon: Database,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    name: 'Logistics Suite',
    to: '/logistics',
    desc: 'Last-Mile Delivery & Subscription ERP',
    icon: Globe,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    name: 'Custom Solutions',
    to: '/custom',
    desc: 'Bespoke Software Engineering',
    icon: Layers,
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
];

const mainNavLinks = [
  { name: 'Services',  to: '/#services' },
  { name: 'About',     to: '/about' },
  { name: 'Blog',      to: '/#blog' },
  { name: 'Contact',   to: '/#contact' },
];

export default function Header() {
  const [isOpen, setIsOpen]               = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [productsOpen, setProductsOpen]   = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  /* ---------- scroll listener ---------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---------- close dropdown on outside click ---------- */
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  /* ---------- close mobile menu on route change ---------- */
  useEffect(() => {
    setIsOpen(false);
    setProductsOpen(false);
    setMobileProductsOpen(false);
  }, [location]);

  const navBase =
    'text-sm font-semibold transition-colors duration-200 hover:text-secondary';
  const navColor = isScrolled ? 'text-slate-700' : 'text-slate-800';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-3'
          : 'bg-white/70 backdrop-blur-sm py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img
              src={logoImg}
              alt="Polynexus Logo"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-bold tracking-tight text-primary">
              Poly<span className="text-secondary">nexus</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">

            {/* Products dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProductsOpen((v) => !v)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg ${navBase} ${navColor} hover:bg-slate-100/80`}
                aria-haspopup="true"
                aria-expanded={productsOpen}
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Mega dropdown */}
              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-4 grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-150">
                  {products.map((p) => {
                    const Icon = p.icon;
                    return (
                      <Link
                        key={p.name}
                        to={p.to}
                        onClick={() => setProductsOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                      >
                        <div className={`p-2 rounded-lg ${p.bg} flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-4 h-4 ${p.color}`} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-800 group-hover/item:text-secondary transition-colors">
                            {p.name}
                          </span>
                          <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {p.desc}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {/* Footer CTA inside dropdown */}
                  <div className="col-span-2 border-t border-slate-100 pt-3 mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                      Need something custom?
                    </span>
                    <Link
                      to="/custom"
                      onClick={() => setProductsOpen(false)}
                      className="text-[11px] font-bold text-secondary hover:text-slate-800 transition-colors flex items-center gap-1"
                    >
                      Scope a build
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Standard nav links */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`px-3 py-2 rounded-lg ${navBase} ${navColor} hover:bg-slate-100/80`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:block flex-shrink-0">
            <a
              href="https://campusnexus.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-secondary text-primary hover:bg-[#35b399] font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-secondary/20 whitespace-nowrap"
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* ── Mobile Hamburger ── */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200/80 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200 max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-6 flex flex-col gap-1">

            {/* Products accordion */}
            <button
              onClick={() => setMobileProductsOpen((v) => !v)}
              className="flex items-center justify-between w-full text-left px-3 py-3 text-base font-bold text-slate-800 hover:text-secondary rounded-xl hover:bg-slate-50 transition-colors"
            >
              Products
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {mobileProductsOpen && (
              <div className="ml-3 mt-1 mb-2 flex flex-col gap-1 animate-in fade-in duration-150">
                {products.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Link
                      key={p.name}
                      to={p.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${p.bg}`}>
                        <Icon className={`w-4 h-4 ${p.color}`} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-800">{p.name}</span>
                        <span className="block text-[10px] text-slate-400">{p.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Standard links */}
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="px-3 py-3 text-base font-bold text-slate-800 hover:text-secondary rounded-xl hover:bg-slate-50 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* CTA */}
            <div className="mt-3 pt-4 border-t border-slate-100">
              <a
                href="https://campusnexus.in/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-secondary text-primary font-bold py-3.5 rounded-xl text-sm shadow-md shadow-secondary/20 hover:bg-[#35b399] transition-colors"
              >
                Get Started
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
