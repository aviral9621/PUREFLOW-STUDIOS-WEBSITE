import React from 'react';
import {
  BarChart3,
  BedDouble,
  Bell,
  Building2,
  CalendarCheck,
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// WorkPreviews — the three product previews rendered inside the "Selected work"
// cards. Each one is a designed, non-interactive mockup of the real product
// (no iframes, no screenshots), so the previews stay sharp at any card width
// and cost nothing to load.
//
// SIZING — every preview is laid out in `em`, and `.sw-ui` (index.css) sets
// `font-size: 1cqw` against the card's preview box. So 1em is always 1% of the
// preview's width and the whole mockup scales with the card instead of
// collapsing into mush on a narrow column. Never put a `px` size in here.
// ─────────────────────────────────────────────────────────────────────────────

type Nav = { label: string; Icon: React.ComponentType<{ className?: string }>; active?: boolean };

/** Dark rail shared by the two dashboard mockups. */
const Sidebar: React.FC<{ brand: string; mark: string; nav: Nav[] }> = ({ brand, mark, nav }) => (
  <aside className="flex w-[23%] flex-col gap-[0.9em] bg-[#141420] p-[1.6em]">
    <div className="flex items-center gap-[0.9em]">
      <span className="flex h-[2.8em] w-[2.8em] items-center justify-center rounded-[0.7em] bg-gradient-to-br from-[#a855f7] to-[#d946ef] text-[1.5em] font-bold leading-none text-white">
        {mark}
      </span>
      <span className="text-[1.9em] font-semibold leading-[1.15] tracking-tight text-white/90">
        {brand}
      </span>
    </div>

    <div className="flex flex-col gap-[0.35em]">
      {nav.map(({ label, Icon, active }) => (
        <div
          key={label}
          className={`flex items-center gap-[0.8em] rounded-[0.6em] px-[0.8em] py-[0.55em] ${
            active ? 'bg-[#a855f7]/20 text-[#c9a6ff]' : 'text-white/40'
          }`}
        >
          <Icon className="h-[1.9em] w-[1.9em]" />
          <span className="text-[1.85em] font-medium leading-none">{label}</span>
        </div>
      ))}
    </div>
  </aside>
);

/** Dashboard top bar: page title on the left, search / bell / avatar on the right. */
const TopBar: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <header className="flex items-center justify-between">
    <div className="leading-[1.3]">
      <p className="text-[2.6em] font-bold tracking-tight text-[#0f172a]">{title}</p>
      <p className="text-[1.7em] text-[#94a3b8]">{sub}</p>
    </div>
    <div className="flex items-center gap-[1em]">
      <span className="flex h-[3em] items-center gap-[0.6em] rounded-[0.6em] border border-[#e2e8f0] bg-white px-[0.9em] text-[1.6em] text-[#94a3b8]">
        <Search className="h-[1.6em] w-[1.6em]" /> Search
      </span>
      <span className="flex h-[3em] items-center gap-[0.5em] rounded-[0.6em] border border-[#e2e8f0] bg-white px-[0.9em] text-[1.6em] text-[#475569]">
        This month <ChevronDown className="h-[1.4em] w-[1.4em]" />
      </span>
      <Bell className="h-[2.2em] w-[2.2em] text-[#94a3b8]" />
      <span className="h-[3em] w-[3em] rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899]" />
    </div>
  </header>
);

interface Kpi {
  label: string;
  value: string;
  delta: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const KpiRow: React.FC<{ items: Kpi[] }> = ({ items }) => (
  <div className="grid grid-cols-3 gap-[1.1em]">
    {items.map(({ label, value, delta, Icon }) => (
      <div key={label} className="rounded-[0.9em] border border-[#e9edf3] bg-white p-[1.1em]">
        <div className="flex items-start justify-between">
          <span className="text-[1.7em] text-[#94a3b8]">{label}</span>
          <Icon className="h-[1.9em] w-[1.9em] text-[#c4b5fd]" />
        </div>
        <p className="mt-[0.4em] text-[3em] font-bold leading-none tracking-tight text-[#0f172a]">
          {value}
        </p>
        <span className="mt-[0.5em] inline-flex items-center gap-[0.3em] text-[1.55em] font-semibold text-[#16a34a]">
          <TrendingUp className="h-[1.4em] w-[1.4em]" />
          {delta}
        </span>
      </div>
    ))}
  </div>
);

/** Panel shell for the chart / list row under the KPIs. */
const Panel: React.FC<{ title: string; className?: string; children: React.ReactNode }> = ({
  title,
  className = '',
  children,
}) => (
  <div
    className={`flex flex-col rounded-[0.9em] border border-[#e9edf3] bg-white p-[1.2em] ${className}`}
  >
    <p className="text-[1.8em] font-semibold tracking-tight text-[#0f172a]">{title}</p>
    <div className="relative mt-[0.9em] flex-1">{children}</div>
  </div>
);

// ─── 01 · Quick Hotels — booking site on a laptop, with the phone beside it ──

const ROOMS = [
  { name: 'Deluxe King', price: '₹2,499', sky: '#6d4b7a', ground: '#d9a06b' },
  { name: 'Premium Twin', price: '₹1,899', sky: '#4a4a86', ground: '#c98f7a' },
  { name: 'Garden Suite', price: '₹3,250', sky: '#3f6b64', ground: '#c7b07a' },
];

/**
 * Stand-in for a room photograph: a dusk gradient, a low warm sun and a
 * vignette. No `position` of its own — the caller passes one (`relative` in
 * flow, `absolute inset-0` behind content), because a base `relative` here
 * would beat an `absolute` from the caller in Tailwind's cascade order.
 */
const RoomShot: React.FC<{ sky: string; ground: string; className?: string }> = ({
  sky,
  ground,
  className = '',
}) => (
  <div
    className={`overflow-hidden ${className}`}
    style={{
      background: `
        radial-gradient(70% 55% at 76% 82%, rgba(255, 214, 160, 0.45), transparent 68%),
        radial-gradient(90% 70% at 12% 6%, rgba(255, 255, 255, 0.1), transparent 62%),
        linear-gradient(168deg, #150f1e 0%, ${sky} 44%, ${ground} 100%)
      `,
    }}
  >
    <span className="absolute inset-0 bg-[radial-gradient(75%_65%_at_50%_40%,transparent,rgba(8,5,14,0.55))]" />
    <span className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/60 to-transparent" />
  </div>
);

export const QuickHotelsPreview: React.FC = () => (
  <div className="sw-ui absolute inset-0 flex items-center justify-center bg-[#0a0a10]">
    {/* laptop */}
    <div className="absolute left-[0.5%] top-1/2 w-[73%] -translate-y-1/2">
      <div className="overflow-hidden rounded-[1em] border border-white/[0.13] bg-[#0d0d15] shadow-[0_3em_6em_-2.5em_rgba(0,0,0,0.95)]">
        {/* browser chrome */}
        <div className="flex h-[2.4em] items-center gap-[0.45em] border-b border-white/[0.07] bg-[#14141d] px-[0.9em]">
          <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/20" />
          <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/[0.14]" />
          <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/10" />
          <span className="ml-[0.7em] flex h-[1.2em] flex-1 items-center rounded-full bg-white/[0.06] px-[0.7em] text-[0.85em] text-white/35">
            quickhotels.co
          </span>
        </div>

        {/* site — a flex column, so the page can never outgrow the screen */}
        <div className="relative flex aspect-[16/10] w-full flex-col overflow-hidden bg-[#0b0b12]">
          {/* hero */}
          <div className="relative flex flex-[1.9] flex-col justify-between overflow-hidden">
            <RoomShot sky="#5d3f74" ground="#c98a5c" className="absolute inset-0" />

            <div className="relative flex items-center justify-between px-[1.8em] pt-[1.4em]">
              <span className="text-[1.8em] font-bold tracking-[0.06em] text-white">
                QUICK HOTELS
              </span>
              <div className="flex items-center gap-[1.2em] text-[1.5em] text-white/75">
                <span>Stays</span>
                <span>Cities</span>
                <span>Offers</span>
                <span className="rounded-[0.5em] bg-white/15 px-[0.8em] py-[0.3em] text-white">
                  Sign in
                </span>
              </div>
            </div>

            <div className="relative px-[1.8em] pb-[2.4em]">
              <p className="max-w-[66%] text-[4.2em] font-bold leading-[1.06] tracking-[-0.035em] text-white">
                Find your perfect stay
              </p>
              <p className="mt-[0.45em] text-[1.6em] text-white/75">
                All-inclusive pricing. No tax added at checkout.
              </p>
            </div>
          </div>

          {/* search bar, straddling the hero's bottom edge */}
          <div className="relative z-10 mx-[1.8em] -mt-[1.9em] flex items-center gap-[0.6em] rounded-[0.8em] bg-white p-[0.6em] shadow-[0_1.5em_3em_-1.5em_rgba(0,0,0,0.85)]">
            {['Delhi · Noida', 'Check in — out', '2 guests'].map((field) => (
              <div key={field} className="flex-1 rounded-[0.5em] bg-[#f1f3f8] px-[0.7em] py-[0.5em]">
                <p className="text-[1.2em] leading-none text-[#94a3b8]">{field}</p>
              </div>
            ))}
            <span className="rounded-[0.5em] bg-gradient-to-r from-[#a855f7] to-[#d946ef] px-[1.1em] py-[0.6em] text-[1.3em] font-semibold leading-none text-white">
              Search
            </span>
          </div>

          {/* room rail */}
          <div className="flex flex-1 flex-col justify-center px-[1.8em] pb-[1.4em] pt-[1.2em]">
            <p className="text-[1.6em] font-semibold tracking-tight text-white">Premium rooms</p>
            <div className="mt-[0.6em] grid grid-cols-3 gap-[0.8em]">
              {ROOMS.map((room) => (
                <div
                  key={room.name}
                  className="flex items-center gap-[0.6em] overflow-hidden rounded-[0.6em] border border-white/[0.08] bg-white/[0.04] p-[0.5em]"
                >
                  <RoomShot
                    sky={room.sky}
                    ground={room.ground}
                    className="relative h-[2.6em] w-[2.6em] flex-none rounded-[0.4em]"
                  />
                  <div className="min-w-0 leading-[1.35]">
                    <p className="truncate text-[1.25em] font-medium text-white/90">{room.name}</p>
                    <p className="flex items-center gap-[0.25em] text-[1.1em] text-white/45">
                      <Star className="h-[1em] w-[1em] text-[#fbbf24]" />
                      {room.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* laptop base */}
      <div className="mx-auto h-[0.9em] w-[112%] -translate-x-[5.35%] rounded-b-[0.6em] bg-gradient-to-b from-[#2a2a36] to-[#111118]" />
    </div>

    {/* phone */}
    <div className="absolute bottom-[4%] right-[0.5%] w-[24%]">
      <div className="rounded-[2em] border border-white/[0.16] bg-[#0d0d15] p-[0.4em] shadow-[0_3em_6em_-2em_rgba(0,0,0,0.95)]">
        <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[1.7em] bg-[#0b0b12]">
          <span className="absolute left-1/2 top-[0.5em] z-10 h-[0.7em] w-[36%] -translate-x-1/2 rounded-full bg-black" />

          <RoomShot sky="#5d3f74" ground="#c98a5c" className="relative h-[46%] w-full" />

          <div className="absolute inset-x-0 top-[34%] rounded-t-[1.2em] bg-[#0f0f18] p-[1em]">
            <p className="text-[1.6em] font-semibold leading-tight text-white">Premium rooms</p>
            <p className="mt-[0.25em] text-[1.15em] text-white/45">Delhi · from ₹1,899</p>

            <div className="mt-[0.9em] flex flex-col gap-[0.5em]">
              {ROOMS.slice(0, 2).map((room) => (
                <div
                  key={room.name}
                  className="flex items-center gap-[0.6em] rounded-[0.6em] border border-white/[0.07] bg-white/[0.03] p-[0.5em]"
                >
                  <RoomShot
                    sky={room.sky}
                    ground={room.ground}
                    className="relative h-[2.4em] w-[2.4em] flex-none rounded-[0.4em]"
                  />
                  <div className="min-w-0 leading-[1.35]">
                    <p className="truncate text-[1.15em] font-medium text-white/90">{room.name}</p>
                    <p className="text-[1.05em] text-white/45">{room.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[0.9em] rounded-[0.6em] bg-gradient-to-r from-[#a855f7] to-[#d946ef] py-[0.6em] text-center text-[1.25em] font-semibold text-white">
              Book now
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── 02 · UnSkills CRM — leads, admissions, fees across eight branches ───────

const UNSKILLS_NAV: Nav[] = [
  { label: 'Dashboard', Icon: LayoutDashboard, active: true },
  { label: 'Leads', Icon: MessageSquare },
  { label: 'Admissions', Icon: GraduationCap },
  { label: 'Fees', Icon: Wallet },
  { label: 'Branches', Icon: Building2 },
  { label: 'Reports', Icon: FileText },
  { label: 'Settings', Icon: Settings },
];

const UNSKILLS_KPIS: Kpi[] = [
  { label: 'Total leads', value: '1,248', delta: '12%', Icon: MessageSquare },
  { label: 'Admissions', value: '432', delta: '8%', Icon: GraduationCap },
  { label: 'Pending fees', value: '286', delta: '7%', Icon: Wallet },
];

const LEADS = [
  { name: 'Rahul Sharma', branch: 'Rohini', status: 'New', bg: '#ede9fe', fg: '#7c3aed' },
  { name: 'Priya Verma', branch: 'Pitampura', status: 'Follow up', bg: '#fef3c7', fg: '#b45309' },
  { name: 'Amit Singh', branch: 'Dwarka', status: 'Converted', bg: '#dcfce7', fg: '#15803d' },
  { name: 'Neha Gupta', branch: 'Noida', status: 'Converted', bg: '#dcfce7', fg: '#15803d' },
];

export const UnskillsCrmPreview: React.FC = () => (
  <div className="sw-ui absolute inset-0 flex bg-[#f4f6fa] font-sans">
    <Sidebar brand="UnSkills CRM" mark="U" nav={UNSKILLS_NAV} />

    <div className="flex flex-1 flex-col gap-[1.1em] p-[1.6em]">
      <TopBar title="Dashboard" sub="Institute overview · 8 branches" />
      <KpiRow items={UNSKILLS_KPIS} />

      <div className="flex flex-1 gap-[1.1em]">
        <Panel title="Applications overview" className="w-[58%]">
          <svg viewBox="0 0 200 72" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="sw-unskills-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[18, 36, 54].map((y) => (
              <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="#eef1f6" strokeWidth="1" />
            ))}
            <path
              d="M0 58 L20 52 L40 55 L60 40 L80 44 L100 28 L120 33 L140 18 L160 24 L180 10 L200 16 L200 72 L0 72 Z"
              fill="url(#sw-unskills-fill)"
            />
            <path
              d="M0 58 L20 52 L40 55 L60 40 L80 44 L100 28 L120 33 L140 18 L160 24 L180 10 L200 16"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
            />
          </svg>
        </Panel>

        <Panel title="Recent leads" className="w-[42%]">
          <div className="flex flex-col gap-[0.55em]">
            {LEADS.map((lead) => (
              <div key={lead.name} className="flex items-center gap-[0.6em]">
                <span className="h-[2.2em] w-[2.2em] flex-none rounded-full bg-gradient-to-br from-[#c4b5fd] to-[#f0abfc]" />
                <div className="min-w-0 flex-1 leading-[1.3]">
                  <p className="truncate text-[1.5em] font-medium text-[#0f172a]">{lead.name}</p>
                  <p className="text-[1.3em] text-[#94a3b8]">{lead.branch}</p>
                </div>
                <span
                  className="rounded-full px-[0.7em] py-[0.25em] text-[1.2em] font-semibold"
                  style={{ background: lead.bg, color: lead.fg }}
                >
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  </div>
);

// ─── 03 · Quick Hotels CRM — bookings, revenue and occupancy ─────────────────

const QH_CRM_NAV: Nav[] = [
  { label: 'Dashboard', Icon: LayoutDashboard, active: true },
  { label: 'Bookings', Icon: CalendarCheck },
  { label: 'Leads', Icon: Users },
  { label: 'Occupancy', Icon: BedDouble },
  { label: 'Revenue', Icon: Wallet },
  { label: 'Reports', Icon: BarChart3 },
  { label: 'Settings', Icon: Settings },
];

const QH_CRM_KPIS: Kpi[] = [
  { label: 'Total bookings', value: '1,256', delta: '12%', Icon: CalendarCheck },
  { label: 'Total revenue', value: '₹12.8L', delta: '10%', Icon: Wallet },
  { label: 'Occupancy', value: '78%', delta: '3%', Icon: BedDouble },
];

const REVENUE_BARS = [38, 52, 44, 61, 55, 72, 64, 81, 70, 88, 76, 95];
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const QuickHotelsCrmPreview: React.FC = () => (
  <div className="sw-ui absolute inset-0 flex bg-[#f4f6fa] font-sans">
    <Sidebar brand="Quick Hotels CRM" mark="Q" nav={QH_CRM_NAV} />

    <div className="flex flex-1 flex-col gap-[1.1em] p-[1.6em]">
      <TopBar title="Dashboard" sub="Bookings, revenue and occupancy" />
      <KpiRow items={QH_CRM_KPIS} />

      <div className="flex flex-1 gap-[1.1em]">
        <Panel title="Revenue overview" className="w-[58%]">
          {/* Absolute so the bar row has a definite height — a percentage bar
              height against an auto-height parent collapses to nothing. */}
          <div className="absolute inset-0 flex flex-col">
            <div className="flex min-h-0 flex-1 items-end gap-[0.45em]">
              {REVENUE_BARS.map((height, i) => (
                <div
                  key={MONTHS[i] + i}
                  className="flex-1 rounded-t-[0.25em] bg-gradient-to-t from-[#c4b5fd] to-[#a855f7]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex gap-[0.45em] pt-[0.4em]">
              {MONTHS.map((month, i) => (
                <span
                  key={month + i}
                  className="flex-1 text-center text-[1.1em] leading-none text-[#b6bdc9]"
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Occupancy" className="w-[42%]">
          <div className="flex h-full items-center justify-center">
            <div className="relative aspect-square h-full max-h-[11em]">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#eef1f6" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="76 100"
                  pathLength={100}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[2.4em] font-bold tracking-tight text-[#0f172a]">
                78%
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </div>
);

// ─── Registry ────────────────────────────────────────────────────────────────

/**
 * Case-study slug → its purpose-built mockup. A project listed here renders its
 * designed interface anywhere a `SelectedWorkCard` appears; anything missing
 * falls back to `PortfolioPreview` (screenshot / live embed / skeleton).
 */
export const DESIGNED_PREVIEWS: Record<string, React.ComponentType> = {
  'quick-hotels': QuickHotelsPreview,
  'unskills-computer-education-crm': UnskillsCrmPreview,
  'ecommerce-retail-platform': QuickHotelsCrmPreview,
};
