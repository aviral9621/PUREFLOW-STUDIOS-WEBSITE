import React from 'react';
import { BarChart3, LayoutGrid, ClipboardCheck, Workflow, Webhook, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CodeEditorVisual — the hero mark on the build-oriented service pages.
//
// A laptop running the editor, with the service's own capabilities floating
// beside it. Drawn entirely in markup rather than shipped as an image: it stays
// crisp at any density, weighs nothing, follows the theme, and the code inside
// is real text rather than pixels.
//
// Everything is sized in `em` against a container-relative font size, so the
// whole composition scales as one piece instead of reflowing into itself.
// ─────────────────────────────────────────────────────────────────────────────

const TREE = ['src', 'components', 'pages', 'api', 'utils', 'styles', 'public'];
const FILES = ['.env', 'package.json', 'tsconfig.json'];

const CHIP_ICONS = [LayoutGrid, ClipboardCheck, Workflow, Webhook];

interface Props {
  /** Four short capability labels shown floating beside the laptop. */
  chips: string[];
}

export const CodeEditorVisual: React.FC<Props> = ({ chips }) => (
  <div className="cev" aria-hidden="true">
    <div className="cev__stage">
      {/* The looping accent line, behind everything */}
      <svg className="cev__line" viewBox="0 0 300 210" fill="none">
        <defs>
          <linearGradient id="cevLine" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
            <stop offset="35%" stopColor="#EC4899" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M18 168 C -8 108, 34 24, 118 22 C 208 20, 268 10, 283 34"
          stroke="url(#cevLine)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="283" cy="34" r="4.5" fill="#F9A8D4" className="cev__line-dot" />
      </svg>

      {/* Laptop */}
      <div className="cev__laptop">
        <div className="cev__screen">
          <span className="cev__cam" />
          <div className="cev__editor">
            <nav className="cev__tree">
              <div className="cev__tree-head">
                <span className="cev__caret">&lt;</span>
                <span className="cev__caret">&gt;</span>
              </div>
              {TREE.map((name) => (
                <div key={name} className="cev__row">
                  <span className="cev__folder" />
                  {name}
                </div>
              ))}
              {FILES.map((name) => (
                <div key={name} className="cev__row cev__row--file">
                  <span className="cev__file" />
                  {name}
                </div>
              ))}
            </nav>

            <div className="cev__pane">
              <div className="cev__tabbar">
                <span className="cev__tab">
                  app.tsx
                  <span className="cev__tab-x">×</span>
                </span>
              </div>

              <pre className="cev__code">
                <span className="cev-kw">export default function </span>
                <span className="cev-fn">Home</span>
                <span className="cev-pn">() {'{'}</span>
                {'\n  '}
                <span className="cev-kw">return</span>
                <span className="cev-pn"> (</span>
                {'\n    '}
                <span className="cev-pn">&lt;</span>
                <span className="cev-tag">main</span>
                <span className="cev-at"> className</span>
                <span className="cev-pn">=</span>
                <span className="cev-st">&quot;min-h-screen&quot;</span>
                <span className="cev-pn">&gt;</span>
                {'\n      '}
                <span className="cev-pn">&lt;</span>
                <span className="cev-tag">h1</span>
                <span className="cev-pn">&gt;</span>
                {'\n        Ideas'}
                {'\n        into Impact'}
                {'\n      '}
                <span className="cev-pn">&lt;/</span>
                <span className="cev-tag">h1</span>
                <span className="cev-pn">&gt;</span>
                {'\n      '}
                <span className="cev-pn">&lt;</span>
                <span className="cev-tag">p</span>
                <span className="cev-pn">&gt;</span>
                {'\n        Building digital products'}
                {'\n        that work for you.'}
                {'\n      '}
                <span className="cev-pn">&lt;/</span>
                <span className="cev-tag">p</span>
                <span className="cev-pn">&gt;</span>
                {'\n    '}
                <span className="cev-pn">&lt;/</span>
                <span className="cev-tag">main</span>
                <span className="cev-pn">&gt;</span>
                {'\n  '}
                <span className="cev-pn">)</span>
                {'\n'}
                <span className="cev-pn">{'}'}</span>
              </pre>
            </div>
          </div>
        </div>
        <div className="cev__base" />
      </div>

      {/* Floating: the promise */}
      <div className="cev__vision">
        <span className="cev__vision-icon">
          <BarChart3 className="h-[1.15em] w-[1.15em]" strokeWidth={2.2} />
        </span>
        <span className="cev__vision-text">
          <span className="cev__vision-a">Your Vision</span>
          <span className="cev__vision-b">Our Development</span>
        </span>
        <ArrowRight className="cev__vision-arrow h-[1em] w-[1em]" strokeWidth={1.8} />
      </div>

      {/* Floating: what this service delivers */}
      <ul className="cev__chips">
        {chips.slice(0, 4).map((label, i) => {
          const Icon = CHIP_ICONS[i] ?? LayoutGrid;
          return (
            <li key={label} className="cev__chip">
              <span className="cev__chip-icon">
                <Icon className="h-[1.1em] w-[1.1em]" strokeWidth={1.7} />
              </span>
              {label}
            </li>
          );
        })}
      </ul>

      <span className="cev__script">Ideas into Impact</span>
    </div>
  </div>
);
