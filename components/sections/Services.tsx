import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Code2,
  Globe2,
  LayoutDashboard,
  Megaphone,
  Smartphone,
} from 'lucide-react';
import { ViewState } from '../../types';

interface WordProps {
  text: string;
  delay: number;
  className?: string;
  reduced: boolean | null;
}

function Word({ text, delay: _delay, className = '', reduced: _reduced }: WordProps) {
  return (
    <span className="inline-block overflow-hidden leading-[0.95]">
      <span className={`inline-block ${className}`}>{text}</span>
    </span>
  );
}

interface ServicesProps {
  onViewChange: (view: ViewState) => void;
}

const serviceCards = [
  {
    id: 'development',
    icon: Code2,
    category: 'Development',
    title: 'Custom Software',
    description: 'Built for your business — not a template.',
    metric: '12+ systems shipped',
    view: 'service-software',
  },
  {
    id: 'product',
    icon: LayoutDashboard,
    category: 'Product',
    title: 'CRMs & Dashboards',
    description: '14 WhatsApp groups → one clean screen.',
    metric: '8 CRMs in production',
    view: 'service-crm',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    category: 'Mobile',
    title: 'Mobile Apps',
    description: 'iOS + Android, one budget. No drama.',
    metric: 'PWA + native covered',
    view: 'service-mobile',
  },
  {
    id: 'web',
    icon: Globe2,
    category: 'Web',
    title: 'Websites',
    description: 'Loads fast. Converts faster. Looks fire.',
    metric: '15+ sites live',
    view: 'service-website',
  },
  {
    id: 'marketing',
    icon: ChartNoAxesCombined,
    category: 'Marketing',
    title: 'Social Media',
    description: 'Reels, scripts, AI visuals — handled.',
    metric: '4 brands managed monthly',
    view: 'service-social',
  },
  {
    id: 'performance',
    icon: Megaphone,
    category: 'Performance',
    title: 'Ads Management',
    description: 'Meta ads that chase ROAS, not vanity.',
    metric: '₹10L+ ad spend managed',
    view: 'service-ads',
  },
] as const;

const cardGridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.56,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Services({ onViewChange }: ServicesProps) {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-black py-14 md:py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[940px] -translate-x-1/2 rounded-full bg-[#ff2f86]/10 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(236,72,153,0.18),transparent_32%),linear-gradient(180deg,#050307_0%,#020204_45%,#000_100%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          className="mb-9 flex flex-col items-center text-center md:mb-12"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-serif italic text-white/95 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.1] tracking-normal">
            What do you want to
          </span>
          <span
            className="hero-automation-text mt-1 inline-block leading-none text-[clamp(2.5rem,5.6vw,5rem)]"
            data-text="AUTOMATE?"
          >
            AUTOMATE?
          </span>
        </motion.div>

        <motion.div
          className="grid w-full grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3"
          variants={reduced ? undefined : cardGridVariants}
          initial={reduced ? false : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.18 }}
        >
          {serviceCards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.button
                key={card.id}
                type="button"
                onClick={() => onViewChange(card.view as ViewState)}
                variants={reduced ? undefined : cardVariants}
                className="service-card group relative min-h-[208px] overflow-hidden rounded-2xl border border-white/12 bg-[#08060d] p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff3f8d]/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3f8d] sm:min-h-[200px] sm:p-6"
                whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.2 } }}
                whileTap={reduced ? undefined : { scale: 0.985 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,47,134,0.18),transparent_34%),linear-gradient(145deg,rgba(168,85,247,0.10),transparent_55%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="service-card__glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                {/* Mobile-only corner arrow. On sm+ the arrow sits inline beside
                    the description instead (see below), matching the compact card. */}
                <ArrowUpRight
                  className="absolute right-5 top-5 h-4 w-4 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:hidden"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex h-full min-h-[184px] flex-col sm:min-h-0">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/85 bg-black text-white shadow-[0_0_24px_-12px_rgba(255,255,255,0.4)] sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl sm:border-[#a855f7]/70">
                    <Icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" strokeWidth={1.9} />
                  </div>

                  {/* Category and the metric footer below are mobile-only: the compact
                      desktop card is icon → title → description → arrow. */}
                  <p className="gradient-flow-text mb-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] sm:hidden">
                    {card.category}
                  </p>
                  <h3 className="text-[15px] font-medium leading-tight text-white sm:text-[21px] sm:font-semibold">
                    {card.title}
                  </h3>

                  <div className="mt-2 sm:mt-3 sm:flex sm:items-start sm:justify-between sm:gap-3">
                    <p className="max-w-[36ch] overflow-hidden text-[11px] font-normal leading-[1.35] text-white/62 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[13px] sm:leading-[1.48]">
                      {card.description}
                    </p>
                    <ArrowRight
                      className="mt-0.5 hidden h-5 w-5 shrink-0 text-[#a855f7] transition-transform duration-300 group-hover:translate-x-1 sm:block"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-auto border-t border-white/10 pt-3 sm:hidden">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-medium leading-snug text-white/78">
                        {card.metric}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#ff3f8d]">
                        Explore
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          strokeWidth={1.8}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
