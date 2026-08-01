import React, { useEffect } from 'react';
import { ArrowLeft, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { ViewState } from '../types';

interface RefundPolicyPageProps {
  onViewChange: (view: ViewState) => void;
}

const CONTACT_EMAIL = 'support@pureflowdesigns.com';

export const RefundPolicyPage: React.FC<RefundPolicyPageProps> = ({ onViewChange }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-black pt-24 pb-24 text-white sm:pt-28">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[900px] w-[1100px] rounded-full bg-brand/5 opacity-30 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <button
          onClick={() => onViewChange('home')}
          className="group mb-10 flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </button>

        {/* Header */}
        <div className="mb-10 border-b border-white/8 pb-9">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-500/25 bg-pink-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-pink-300">
            <ShieldAlert className="h-3 w-3" /> Refund Policy
          </div>
          <h1 className="font-sans text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
            Our refund policy.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55">
            We stand by our results. This refund policy covers our guaranteed-growth social media engagements
            and one-time project services. Read the terms below carefully.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/35">Last updated · May 2026</p>
        </div>

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 font-sans text-xl font-bold tracking-tight text-white">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" strokeWidth={1.8} />
            1. When you're eligible
          </h2>
          <ul className="space-y-2 pl-7 text-[15px] leading-relaxed text-white/65">
            <li className="list-disc">If we fail to deliver the agreed scope within the agreed timeline (excluding delays caused by client review or third-party platforms).</li>
            <li className="list-disc">If a guaranteed-growth retainer fails to meet the agreed monthly KPIs after two consecutive cycles.</li>
            <li className="list-disc">If you cancel a one-time project before any production work has begun — full refund of the advance.</li>
          </ul>
        </section>

        {/* Not eligible */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 font-sans text-xl font-bold tracking-tight text-white">
            <XCircle className="h-5 w-5 text-rose-400" strokeWidth={1.8} />
            2. When you're not eligible
          </h2>
          <ul className="space-y-2 pl-7 text-[15px] leading-relaxed text-white/65">
            <li className="list-disc">After production deployment of a custom software or website project.</li>
            <li className="list-disc">For monthly retainer services already rendered in the current billing cycle.</li>
            <li className="list-disc">For ad spend already disbursed to Meta or any third-party platform.</li>
            <li className="list-disc">If the project was paused or delayed because of unresponsive client feedback for more than 30 consecutive days.</li>
          </ul>
        </section>

        {/* Process */}
        <section className="mb-10">
          <h2 className="mb-4 font-sans text-xl font-bold tracking-tight text-white">3. Refund process</h2>
          <ol className="space-y-3 pl-7 text-[15px] leading-relaxed text-white/65">
            <li className="list-decimal">
              Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-pink-400 hover:underline">{CONTACT_EMAIL}</a> with the subject line "Refund Request" and your project reference.
            </li>
            <li className="list-decimal">We review the request and respond within 5 business days with our decision and reasoning.</li>
            <li className="list-decimal">Approved refunds are processed within 7–10 business days via the original payment method, minus any non-refundable third-party fees (e.g. payment gateway charges, ad spend already deployed).</li>
          </ol>
        </section>

        {/* Pro-rata */}
        <section className="mb-10">
          <h2 className="mb-4 font-sans text-xl font-bold tracking-tight text-white">4. Pro-rata refunds</h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            For monthly retainers, we offer pro-rata refunds for the unused portion of the current cycle, provided written
            cancellation is received at least 7 days before the next billing date.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="mb-4 font-sans text-xl font-bold tracking-tight text-white">5. Contact</h2>
          <p className="text-[15px] leading-relaxed text-white/65">
            Questions about this policy? Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-pink-400 hover:underline">{CONTACT_EMAIL}</a> or call{' '}
            <a href="tel:+916393640650" className="text-pink-400 hover:underline">+91 63936 40650</a>.
          </p>
        </section>
      </div>
    </main>
  );
};
