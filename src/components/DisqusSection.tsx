import React, { useEffect } from 'react';

declare global {
  interface Window {
    disqus_config?: (this: any) => void;
    DISQUS?: {
      reset: (options: { reload: boolean; config?: (this: any) => void }) => void;
    };
  }
}

const DISQUS_SHORTNAME = 'tutorslot-mgmt6110';
const PAGE_URL = 'https://mgmt6110week2assignmenttutorslot.vercel.app/';
const PAGE_IDENTIFIER = 'tutorslot-home';

export const DisqusSection: React.FC = () => {
  useEffect(() => {
    const thread = document.getElementById('disqus_thread');

    // Preserve the legacy RGB styling that the last working Disqus version used.
    // Disqus previously failed when the mount point inherited Tailwind OKLCH colors.
    if (thread) {
      thread.style.setProperty('color', 'rgb(15, 23, 42)', 'important');
      thread.style.setProperty('background-color', 'rgb(241, 245, 249)', 'important');
      thread.style.setProperty('border-color', 'rgb(203, 213, 225)', 'important');
    }

    window.disqus_config = function () {
      this.page.url = PAGE_URL;
      this.page.identifier = PAGE_IDENTIFIER;
    };

    const existingScript = document.querySelector(
      `script[src="https://${DISQUS_SHORTNAME}.disqus.com/embed.js"]`
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = PAGE_URL;
            this.page.identifier = PAGE_IDENTIFIER;
          },
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'disqus-script';
    script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute('data-timestamp', Date.now().toString());
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section
      id="disqus-feedback-section"
      className="border-t border-slate-200 bg-slate-50/70 pt-8 pb-4"
      style={{ color: 'rgb(15, 23, 42)' }}
    >
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Tell us what you think
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            What worked well for you on TutorSlot, and what did not? Please leave your feedback below.
          </p>
        </div>

        <div
          id="disqus_thread"
          className="min-h-[180px] rounded-xl p-4 sm:p-6"
          style={{
            color: 'rgb(15, 23, 42)',
            backgroundColor: 'rgb(241, 245, 249)',
            borderColor: 'rgb(203, 213, 225)',
          }}
        />

        <noscript>
          Please enable JavaScript to view the{' '}
          <a href="https://disqus.com/?ref_noscript" className="text-indigo-600 underline">
            comments powered by Disqus.
          </a>
        </noscript>
      </div>

      <footer
        id="privacy-notice"
        className="max-w-4xl mx-auto px-4 mt-8 pt-4 pb-2 border-t border-slate-200/80 text-[11px] text-slate-500 leading-relaxed text-center"
      >
        This page uses Microsoft Clarity and Disqus, which use cookies to record how visitors use the site and to host comments. By using this page you agree that we and Microsoft may collect and use this data. See the{' '}
        <a
          href="https://www.microsoft.com/privacy/privacystatement"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-800 transition-colors"
        >
          Microsoft Privacy Statement
        </a>
        , the{' '}
        <a
          href="https://disqus.com/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-800 transition-colors"
        >
          Disqus privacy policy
        </a>
        , and the{' '}
        <a
          href="https://disqus.com/data-sharing-settings/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-800 transition-colors"
        >
          Disqus data sharing settings
        </a>
        .
      </footer>
    </section>
  );
};
