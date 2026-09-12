import React from 'react';
import { LiveCardPreview } from './LiveCardPreview';
import { Mockup } from '../casestudy/Mockup';
import type { DeviceKind, PreviewSource } from './ProjectShowcaseCard';

// ─────────────────────────────────────────────────────────────────────────────
// PortfolioPreview — renders a project's `PreviewSource` (screenshot, live
// embed, designed mockup, or nothing) for any project that has no purpose-built
// mockup in `WorkPreviews.tsx`.
//
// Two shells, picked by device: a browser window that fills the whole preview
// box, or a phone centred in it. Sizes are in `em` against `.sw-ui`
// (`font-size: 1cqw` — see index.css), so the chrome scales with the card the
// same way the designed mockups do.
//
// `PreviewContent` is also used by the older `ProjectShowcaseCard`, which draws
// its own device frames; it is exported unwrapped for that reason.
// ─────────────────────────────────────────────────────────────────────────────

/** Neutral product-UI skeleton, used when a project has no preview asset yet. */
export const PlaceholderUI: React.FC = () => (
  <div className="absolute inset-0 bg-[linear-gradient(150deg,#0e0b18,#08070d)]">
    <div
      className="absolute inset-0 opacity-60"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    />
    <div className="absolute inset-0 flex">
      <div className="w-[22%] space-y-2 border-r border-white/[0.06] bg-black/25 p-3">
        <div className="h-2 w-full rounded-full bg-white/10" />
        <div className="h-2 w-3/4 rounded-full bg-white/[0.06]" />
        <div className="h-2 w-2/3 rounded-full bg-white/[0.05]" />
      </div>
      <div className="flex-1 space-y-2.5 p-3.5">
        <div className="h-3 w-1/2 rounded-full bg-white/[0.12]" />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-9 rounded-lg bg-white/[0.07]" />
          <div className="h-9 rounded-lg bg-white/[0.05]" />
          <div className="col-span-2 h-7 rounded-lg bg-white/[0.05]" />
        </div>
      </div>
    </div>
  </div>
);

export const PreviewContent: React.FC<{
  preview: PreviewSource;
  name: string;
  device: DeviceKind;
}> = ({ preview, name, device }) => {
  switch (preview.type) {
    case 'image':
      return (
        <img
          src={preview.src}
          alt={preview.alt ?? `${name} product preview`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      );
    case 'live':
      return (
        <LiveCardPreview
          url={preview.src}
          siteName={name}
          logicalWidth={device === 'phone' ? 390 : 1440}
        />
      );
    case 'mockup':
      return <Mockup kind={preview.kind} />;
    default:
      return <PlaceholderUI />;
  }
};

interface Props {
  preview: PreviewSource;
  name: string;
  device: DeviceKind;
}

export const PortfolioPreview: React.FC<Props> = ({ preview, name, device }) => {
  if (device === 'phone') {
    return (
      <div className="sw-ui absolute inset-0 flex items-center justify-center bg-[#0a0a10]">
        <div className="aspect-[9/19] h-[92%] rounded-[2em] border border-white/[0.16] bg-[#0d0d15] p-[0.4em] shadow-[0_3em_6em_-2em_rgba(0,0,0,0.95)]">
          <div className="relative h-full w-full overflow-hidden rounded-[1.7em] bg-black">
            <PreviewContent preview={preview} name={name} device={device} />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[0.5em] h-[0.7em] w-[36%] -translate-x-1/2 rounded-full bg-black"
            />
          </div>
        </div>
      </div>
    );
  }

  // Browser: the preview box itself becomes the window.
  return (
    <div className="sw-ui absolute inset-0 flex flex-col bg-[#0d0d15]">
      <div className="flex h-[2.6em] flex-none items-center gap-[0.45em] border-b border-white/[0.07] bg-[#14141d] px-[0.9em]">
        <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/20" />
        <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/[0.14]" />
        <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/10" />
        <span className="ml-[0.7em] h-[1.2em] flex-1 rounded-full bg-white/[0.05]" />
      </div>
      <div className="relative flex-1 overflow-hidden bg-[#07070c]">
        <PreviewContent preview={preview} name={name} device={device} />
      </div>
    </div>
  );
};
