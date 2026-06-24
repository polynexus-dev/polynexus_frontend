import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchFAQs, type FAQItem } from '../api';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetchFAQs()
      .then(setFaqs)
      .catch((err) => {
        console.error('Error fetching FAQs:', err);
        // Fallback to static dummy data if API fails
        setFaqs([
          {
            question: 'How does Polynexus achieve sub-2ms start times?',
            answer: 'We leverage lightweight WebAssembly (WASM) isolates instead of full Docker containers or Node VM environments. This eliminates cold start overhead by executing routines in pre-allocated sandbox boundaries inside our global V8 edge cluster.'
          },
          {
            question: 'Is Polymorphic Storage compatible with Postgres clients?',
            answer: 'Yes! Polynexus utilizes a Postgres-wire protocol gateway. You can use standard client wrappers, ORMs, and drivers (like pg, Prisma, or Sequelize) while benefiting from our dynamic NoSQL schema capabilities on the server.'
          },
          {
            question: 'Can I self-host the Polynexus grid orchestrator?',
            answer: 'Absolutely. We support local and private-cloud orchestrator installations. You can link your proprietary clusters directly to the Polynexus routing bridge to leverage our AI dispatcher while keeping all data on-premise.'
          },
          {
            question: 'How does the pricing scale for high-traffic apps?',
            answer: 'We offer a serverless pay-as-you-go tier based on CPU runtime milliseconds and active write logs. For enterprise scaling, we provide fixed node capacities that deliver up to 60% compute discount thresholds.'
          }
        ]);
      });
  }, []);

  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Head */}
        <div className="text-center mb-16 reveal">
          <span className="text-sm font-bold text-secondary uppercase tracking-wider">Troubleshooting & Info</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 mt-3 text-sm">
            Everything you need to know about setting up and operating on the Polynexus cloud.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`reveal reveal-delay-${idx * 100} bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-300`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="font-bold text-slate-800 text-base sm:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-accent" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-450" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 border-t border-slate-150 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-slate-600 text-sm leading-relaxed mt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
