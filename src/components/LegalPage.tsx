import React, { useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { LEGAL_DRAFT_NOTICE, LEGAL_LAST_UPDATED } from '../data/legal';

/** Visible marker for a fact or decision that management or counsel must supply. */
export const Pending: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <mark className="bg-[#f2a900]/15 text-[#f2a900] px-1 rounded font-mono text-[0.85em] not-italic">
    [MANAGEMENT TO CONFIRM: {children}]
  </mark>
);

/** Shows the confirmed value, or a Pending marker describing what is missing. */
export const Fact: React.FC<{ value: string; missing: string }> = ({ value, missing }) =>
  value ? <>{value}</> : <Pending>{missing}</Pending>;

interface LegalPageProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

/** Shared layout for the legal pages, matching the existing Falcon page design. */
export const LegalPage: React.FC<LegalPageProps> = ({ icon: Icon, eyebrow, title, children }) => {
  useEffect(() => {
    document.title = `${title} | Falcon International Traders`;
  }, [title]);

  const updated = new Date(`${LEGAL_LAST_UPDATED}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <article className="bg-transparent text-[#fdfcf0] py-16 px-4 sm:px-6 lg:px-8 space-y-8 font-sans max-w-4xl mx-auto text-left">
      <header className="space-y-3 border-b border-[#154736]/70 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2a900] uppercase tracking-widest bg-[#05140f] px-3.5 py-1 rounded-full border border-[#f2a900]/30">
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#fdfcf0]">{title}</h1>
        <p className="text-[#a3b899] text-xs font-mono">
          Last updated: <time dateTime={LEGAL_LAST_UPDATED}>{updated}</time>
        </p>
        <p role="note" className="text-xs text-[#f2a900] bg-[#05140f] border border-[#f2a900]/30 rounded-lg px-3 py-2">
          {LEGAL_DRAFT_NOTICE}
        </p>
      </header>

      <div className="legal-body space-y-6 text-sm text-[#c9d6c3] leading-relaxed">
        {children}
      </div>
    </article>
  );
};

export const H2: React.FC<{ id?: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="text-lg font-bold font-serif text-[#fdfcf0] pt-4 scroll-mt-24">{children}</h2>
);

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-base font-semibold text-[#fdfcf0] pt-2">{children}</h3>
);

export const List: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="list-disc pl-5 space-y-1.5">{children}</ul>
);
