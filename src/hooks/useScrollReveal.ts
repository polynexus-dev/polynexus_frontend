import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target); // Reveal once
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    // Function to observe currently un-revealed elements
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal:not(.reveal-active)');
      elements.forEach((el) => observer.observe(el));
    };

    // Run initially
    observeElements();

    // Create a MutationObserver to watch for dynamically loaded DOM elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
