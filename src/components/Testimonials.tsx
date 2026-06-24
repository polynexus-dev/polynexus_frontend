import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { fetchTestimonials, type Testimonial } from '../api';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials()
      .then(setTestimonials)
      .catch((err) => {
        console.error('Error fetching testimonials:', err);
        // Fallback to static dummy data if API fails
        setTestimonials([
          {
            name: 'Sarah Jenkins',
            role: 'VP of Platform Engineering',
            company: 'NovusAI',
            content: 'Migrating our ingestion layers to Polynexus Serverless Edge reduced our global api latency from 180ms to under 12ms. Our devops team now spends close to zero hours debugging regional sync failures.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
          },
          {
            name: 'David Chen',
            role: 'Core Architect',
            company: 'FlowState',
            content: 'The Polymorphic Storage engine is exactly what modern startups need. We can link relations and document formats in a single Postgres-compatible interface, cutting down infrastructure bills by 40%.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120'
          },
          {
            name: 'Elena Rostova',
            role: 'Head of Security & Trust',
            company: 'Securitas Cryptographic',
            content: 'Polynexus Zero-Trust Shielding made SOC2 auditing a breeze. The out-of-the-box hardware key validations and encryption patterns are designed with rigorous, premium standards.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120'
          }
        ]);
      });
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
        <div className="text-center font-mono text-sm text-slate-400">Loading testimonials...</div>
      </section>
    );
  }

  const current = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      {/* Background visual indicators */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#E27000]/5 blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 reveal">
          <span className="text-sm font-bold text-secondary uppercase tracking-wider">Trusted Ecosystem</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Praised by developers and architects alike
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative bg-slate-50/50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xl backdrop-blur-sm reveal reveal-delay-100">
          <Quote className="absolute top-8 left-8 w-12 h-12 text-secondary/10" />

          {/* Testimonial Content */}
          <div className="text-center flex flex-col items-center min-h-[220px] justify-center animate-in fade-in slide-in-from-right-1 duration-300">
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-accent fill-accent" />
              ))}
            </div>

            {/* Content text */}
            <p className="text-lg sm:text-xl text-slate-700 font-semibold italic leading-relaxed max-w-2xl">
              "{current.content}"
            </p>

            {/* Profile Info */}
            <div className="mt-8 flex items-center gap-4 text-left">
              <img
                src={current.avatar}
                alt={current.name}
                className="w-14 h-14 rounded-full border-2 border-secondary object-cover"
              />
              <div>
                <span className="block font-bold text-slate-800 text-base">{current.name}</span>
                <span className="block text-xs text-slate-500 font-bold">
                  {current.role} at <span className="text-secondary">{current.company}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-100">
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? 'bg-secondary w-6' : 'bg-slate-350 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-secondary/45 text-slate-500 hover:text-slate-800 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-secondary/45 text-slate-500 hover:text-slate-800 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
