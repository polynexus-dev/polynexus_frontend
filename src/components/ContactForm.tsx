import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { fetchContactInfo, type ContactInfo } from '../api';

export default function ContactForm() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'info@polynexus.com',
    phone: '+91 9226318818',
    address: 'Nagpur, Maharashtra',
    est_response: 'EST RESPONSE TIME: < 15 MINUTES'
  });

  useEffect(() => {
    fetchContactInfo()
      .then(setContactInfo)
      .catch((err) => console.error('Error fetching contact info:', err));
  }, []);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid';
    }
    if (!formData.message.trim()) tempErrors.message = 'Message content is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#45C7AC]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left panel: Info */}
          <div className="lg:col-span-5 flex flex-col justify-between reveal">
            <div>
              <span className="text-sm font-bold text-accent uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Let’s talk about your system requirements
              </h2>
              <p className="text-slate-500 mt-4 leading-relaxed">
                Whether you need enterprise cluster setup, custom SLAs, or developer platform access, our engineering team is ready to assist.
              </p>
            </div>

            {/* Coordinates */}
            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#45C7AC]/10 text-secondary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">Email Support</span>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm text-slate-800 hover:text-secondary transition-colors font-mono">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">Call Registry</span>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm text-slate-800 hover:text-accent transition-colors font-mono">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#45C7AC]/10 text-secondary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">Command Center</span>
                  <span className="text-sm text-slate-800 font-bold">
                    {contactInfo.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-slate-100 pt-6">
              <span className="text-xs text-slate-400 font-mono font-bold">{contactInfo.est_response}</span>
            </div>
          </div>

          {/* Right panel: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm relative reveal reveal-delay-200">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-[#45C7AC]/10 text-secondary rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Transmission Successful</h3>
                <p className="text-slate-500 text-sm mt-3 max-w-sm">
                  Our network coordinators have received your specifications. An engineer will follow up shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 bg-slate-200 hover:bg-slate-350 text-slate-700 hover:text-slate-900 text-xs font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all ${errors.name ? 'border-red-500' : 'border-slate-200'
                      }`}
                    placeholder="Jane Doe"
                  />
                  {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all ${errors.email ? 'border-red-500' : 'border-slate-200'
                      }`}
                    placeholder="jane@company.com"
                  />
                  {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-2">
                    Message / Specs *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all resize-none ${errors.message ? 'border-red-500' : 'border-slate-200'
                      }`}
                    placeholder="Tell us about your scalability bottlenecks..."
                  />
                  {errors.message && <span className="text-xs text-red-500 mt-1 block">{errors.message}</span>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-primary hover:bg-[#35b399] font-bold py-4 rounded-xl transition-all shadow-md shadow-secondary/15 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Negotiating Connection...'
                    ) : (
                      <>
                        Submit Specifications
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
