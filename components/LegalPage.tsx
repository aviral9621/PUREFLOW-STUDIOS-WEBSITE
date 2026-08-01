import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, FileText, Cookie } from 'lucide-react';
import { ViewState } from '../types';

export type LegalKind = 'privacy' | 'terms' | 'cookies';

interface LegalPageProps {
  kind: LegalKind;
  onViewChange: (view: ViewState) => void;
}

interface Section {
  heading: string;
  body: React.ReactNode;
}

const CONTACT_EMAIL = 'support@pureflowdesigns.com';
const LAST_UPDATED = 'May 2026';

const CONTENT: Record<LegalKind, { icon: React.ElementType; tag: string; title: string; intro: string; sections: Section[] }> = {
  privacy: {
    icon: ShieldCheck,
    tag: 'Privacy Policy',
    title: 'How we handle your data.',
    intro:
      'Pureflow Studios ("we", "us", "our") takes your privacy seriously. This policy explains what data we collect when you interact with our website, why we collect it, and the rights you have over it.',
    sections: [
      {
        heading: '1. Information we collect',
        body: (
          <>
            <p>We only collect what we genuinely need to deliver our services and respond to your enquiries:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5">
              <li><strong>Contact details</strong> you submit through forms — name, email, phone number, company.</li>
              <li><strong>Project details</strong> you share so we can scope and respond to your enquiry.</li>
              <li><strong>Technical data</strong> such as IP address, browser type, device type, and referring URL, gathered automatically for analytics and security.</li>
              <li><strong>Cookies</strong> — see our Cookie Policy for the specific cookies in use.</li>
            </ul>
          </>
        ),
      },
      {
        heading: '2. How we use your information',
        body: (
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To respond to enquiries and deliver projects you have commissioned.</li>
            <li>To send invoices, contracts, and project-related communication.</li>
            <li>To improve our website performance and user experience through aggregated analytics.</li>
            <li>To comply with legal and tax obligations under Indian law.</li>
          </ul>
        ),
      },
      {
        heading: '3. Who we share it with',
        body: (
          <p>
            We do not sell, rent, or trade your personal data. We share it only with trusted infrastructure providers (e.g. Supabase, Vercel, Resend, Cloudflare) strictly to the extent necessary to operate our services. We may disclose data when required by Indian law or to protect our legal rights.
          </p>
        ),
      },
      {
        heading: '4. Data retention',
        body: (
          <p>
            We retain enquiry data for up to 24 months after our last interaction. Client project data and invoicing records are retained for 8 years to comply with Indian tax and accounting requirements. You may request earlier deletion at any time, subject to legal retention requirements.
          </p>
        ),
      },
      {
        heading: '5. Your rights',
        body: (
          <p>
            You may request access to, correction of, or deletion of your personal data at any time by emailing <a href={`mailto:${CONTACT_EMAIL}`} className="text-pink-400 hover:underline">{CONTACT_EMAIL}</a>. We will respond within 30 days.
          </p>
        ),
      },
      {
        heading: '6. Security',
        body: (
          <p>
            We use industry-standard encryption (TLS 1.3 in transit, AES-256 at rest where applicable) and role-based access controls. No system is 100% secure — if a breach occurs that affects you, we will notify you within 72 hours of becoming aware of it.
          </p>
        ),
      },
      {
        heading: '7. Contact',
        body: (
          <p>
            Questions about this policy? Email us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-pink-400 hover:underline">{CONTACT_EMAIL}</a> or call <a href="tel:+916393640650" className="text-pink-400 hover:underline">+91 63936 40650</a>.
          </p>
        ),
      },
    ],
  },
  terms: {
    icon: FileText,
    tag: 'Terms of Service',
    title: 'The rules of working with us.',
    intro:
      'These Terms govern your use of pureflowstudios.com and any services delivered by Pureflow Studios. By using our website or engaging us for work, you agree to these Terms.',
    sections: [
      {
        heading: '1. Services',
        body: (
          <p>
            Pureflow Studios provides custom software development, CRM and dashboard development, mobile and web applications, brand and content services, and Meta ads management. Specific deliverables, timelines, and pricing for each engagement are defined in a written Statement of Work (SOW).
          </p>
        ),
      },
      {
        heading: '2. Payment',
        body: (
          <p>
            All projects are billed on a fixed-price basis as defined in the SOW. A 50% advance is payable on signing; the balance is due on production deployment. Recurring services (ads, social media, retainers) are billed monthly in advance. All prices are in INR and exclusive of GST (charged at the prevailing rate).
          </p>
        ),
      },
      {
        heading: '3. Intellectual property',
        body: (
          <p>
            On full payment of all invoices, the deliverables specifically built for you (source code, designs, content) become your property. Pre-existing tools, libraries, frameworks, and reusable code components remain ours. We reserve the right to showcase the work in our portfolio unless otherwise agreed in writing.
          </p>
        ),
      },
      {
        heading: '4. Revisions and scope',
        body: (
          <p>
            Each engagement includes the revisions stated in the SOW. Out-of-scope changes are billed separately at our prevailing hourly rate after written approval.
          </p>
        ),
      },
      {
        heading: '5. Post-launch support',
        body: (
          <p>
            We include 30 days of post-launch support to fix bugs and ship minor refinements. Continued support beyond this period is available under a retainer agreement.
          </p>
        ),
      },
      {
        heading: '6. Cancellation',
        body: (
          <p>
            You may cancel a project at any time. Work completed up to the cancellation date is billable. Refunds for prepaid recurring services are issued pro-rata for the unused portion of the current cycle.
          </p>
        ),
      },
      {
        heading: '7. Limitation of liability',
        body: (
          <p>
            Our maximum liability under any engagement is limited to the amount paid by you under the relevant SOW. We are not liable for indirect, consequential, or incidental damages.
          </p>
        ),
      },
      {
        heading: '8. Governing law',
        body: (
          <p>
            These Terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts in Lucknow, Uttar Pradesh.
          </p>
        ),
      },
      {
        heading: '9. Contact',
        body: (
          <p>
            Questions? Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-pink-400 hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        ),
      },
    ],
  },
  cookies: {
    icon: Cookie,
    tag: 'Cookie Policy',
    title: 'Cookies we set and why.',
    intro:
      'This Cookie Policy explains the cookies and similar technologies in use on pureflowstudios.com, what they do, and how you can control them.',
    sections: [
      {
        heading: '1. What cookies are',
        body: (
          <p>
            Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to the site operators.
          </p>
        ),
      },
      {
        heading: '2. Strictly necessary cookies',
        body: (
          <p>
            We use a small number of cookies essential for site security and core functionality (e.g. CSRF protection, session continuity). These cannot be disabled.
          </p>
        ),
      },
      {
        heading: '3. Analytics cookies',
        body: (
          <p>
            We use privacy-respecting analytics to understand aggregate traffic patterns (page views, referrers, broad device categories). No personally identifying information is collected or shared with third parties for marketing purposes.
          </p>
        ),
      },
      {
        heading: '4. Third-party services',
        body: (
          <p>
            Embedded content (Google Maps, video reviews hosted on Supabase) may set their own cookies governed by their respective privacy policies. We do not control these cookies directly.
          </p>
        ),
      },
      {
        heading: '5. Managing cookies',
        body: (
          <p>
            You can control or delete cookies through your browser settings. Disabling strictly necessary cookies may affect site functionality. See your browser's documentation for instructions.
          </p>
        ),
      },
      {
        heading: '6. Contact',
        body: (
          <p>
            Questions about cookies? Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-pink-400 hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        ),
      },
    ],
  },
};

export const LegalPage: React.FC<LegalPageProps> = ({ kind, onViewChange }) => {
  const { icon: Icon, tag, title, intro, sections } = CONTENT[kind];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [kind]);

  return (
    <div className="min-h-[100svh] bg-black pt-28 pb-24 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1100px] h-[900px] bg-brand/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          onClick={() => onViewChange('home')}
          className="group flex items-center gap-2 text-sm text-white/45 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>

        {/* Header */}
        <div className="border-b border-white/8 pb-9 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-300 text-[10px] font-bold tracking-[0.18em] uppercase mb-5">
            <Icon className="w-3 h-3" /> {tag}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.05] tracking-tight">
            {title}
          </h1>
          <p className="mt-5 text-white/55 text-base leading-relaxed max-w-2xl">{intro}</p>
          <p className="mt-4 text-xs text-white/35 uppercase tracking-[0.18em]">Last updated · {LAST_UPDATED}</p>
        </div>

        {/* Sections */}
        <div className="space-y-9">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl font-bold text-white mb-3 tracking-tight">{s.heading}</h2>
              <div className="text-white/65 text-[15px] leading-relaxed space-y-2">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
