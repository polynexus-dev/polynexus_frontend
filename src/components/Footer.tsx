import { MessageSquare, Globe, ArrowUpRight } from 'lucide-react';
import logoImg from '../assets/logo/logo.png';
import { useState } from 'react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !/\S+@\S+\.\S+/.test(newsletterEmail)) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#010B33] border-t border-slate-900 pt-20 pb-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-slate-900 pb-16">
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className='flex items-center '>
              <a href="/" className="flex items-center gap-3 bg-white px-6 rounded-2xl ">
                <img src={logoImg} alt="Polynexus Logo" className="h-9 w-auto" />
                <span className="text-lg font-bold tracking-tight text-primary">
                  Poly<span className="text-secondary">nexus</span>
                </span>
              </a>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Polynexus operates low-latency serverless, polymorphic database query platforms, and threat prevention proxies on high-performance WASM edge compute systems globally.
            </p>
            {/* Socials */}
            <div className="flex gap-4">
              <a href="#" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all" aria-label="X (Twitter)">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Modules</span>
            <div className="flex flex-col gap-2.5">
              <a href="/#services" className="text-xs text-secondary/95 hover:text-white transition-colors">Serverless Pipelines</a>
              <a href="/#services" className="text-xs text-secondary/95 hover:text-white transition-colors">Storage Engines</a>
              <a href="/#services" className="text-xs text-secondary/95 hover:text-white transition-colors">Zero-Trust Shielding</a>
              <a href="/#services" className="text-xs text-secondary/95 hover:text-white transition-colors">Edge Orchestrator</a>
            </div>
          </div>

          {/* Links 2 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Resources</span>
            <div className="flex flex-col gap-2.5">
              <a href="/#blog" className="text-xs text-secondary/95 hover:text-white transition-colors">Engineering Logs</a>
              <a href="/#faq" className="text-xs text-secondary/95 hover:text-white transition-colors">FAQ & Specs</a>
              <a href="https://vite.dev" target="_blank" className="text-xs text-secondary/95 hover:text-white transition-colors inline-flex items-center gap-0.5">
                Vite Dev Server <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href="https://react.dev" target="_blank" className="text-xs text-secondary/95 hover:text-white transition-colors inline-flex items-center gap-0.5">
                React Framework <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest font-mono">Newsletter</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Subscribe to get updates on edge compute runtimes and performance benchmarks.
            </p>
            {subscribed ? (
              <span className="text-xs font-bold text-secondary animate-in fade-in duration-200">
                ✓ Joined the waitlist successfully.
              </span>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[#010B33] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary flex-1"
                  required
                />
                <button
                  type="submit"
                  className="bg-secondary hover:bg-[#35b399] text-primary font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lower footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-4">
          <span className="text-[10px] text-secondary/80 font-mono">
            © {new Date().getFullYear()} POLYNEXUS LABS INC. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-6 text-[10px] text-secondary/80 font-mono">
            <a href="#" className="hover:text-white">PRIVACY POLICY</a>
            <a href="#" className="hover:text-white">TERMS OF SERVICE</a>
            <a href="#" className="hover:text-white">SECURITY PORTAL</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
