import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PROJECTS as FALLBACK, type Project as LegacyProject } from '../lib/projects';
import { CASE_STUDIES, type CaseStudy } from '../lib/caseStudies';

// ─────────────────────────────────────────────────────────────────────────────
// Live "Stuff we shipped" projects, fetched from Supabase. Falls back to the
// hardcoded seed in `lib/projects.ts` if the DB is unreachable so the page
// never blanks out in dev.
// ─────────────────────────────────────────────────────────────────────────────

export interface BodyBlock {
  type:
    | 'heading'
    | 'paragraph'
    | 'list'
    | 'quote'
    | 'code'
    | 'image'
    | 'image-grid'
    | 'image-slider'
    | 'stats'
    | 'divider';
  text?: string;
  items?: string[];
  /** Single image block: image_url + optional caption (text). */
  image_url?: string;
  alt_text?: string;
  caption?: string;
  /** image-grid / image-slider: array of {url, alt, caption}. */
  images?: Array<{ url: string; alt?: string; caption?: string }>;
  /** image-grid only. Mobile always 1. */
  cols?: 2 | 3;
  /** stats block: array of {value, label}. */
  stats?: Array<{ value: string; label: string }>;
}

export interface ProjectImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface Project {
  id: string;
  slug: string;
  year: string;
  category: string;
  client: string;
  title: string;
  description: string;
  tech: string[];
  url: string;             // live_url without https://
  from: string;            // tailwind gradient class (fallback mockup)
  to: string;
  body_blocks: BodyBlock[];
  images: ProjectImage[];
  display_order: number;
  published: boolean;
  /** Optional live URL to embed as the card thumbnail (structured case studies). */
  previewUrl?: string;
  /** Optional designed mockup to render as the card thumbnail. */
  cardMockup?: 'ai-dashboard' | 'unskills-crm';

  // ── Showcase-card fields (see `lib/portfolio.ts` → ProjectShowcaseCard) ──
  /** Short brand name used as the showcase-card headline ("Quick Hotels"). */
  name?: string;
  /** Product-type label for the showcase-card pill ("Website", "Custom CRM"). */
  productType?: string;
  /** Short description for the showcase card; falls back to `description`. */
  blurb?: string;
  /** Device frame the showcase card renders the preview in. */
  device?: 'browser' | 'phone';
  /** Static image used as the showcase-card preview. */
  cardImage?: string;
}

// Map a fallback LegacyProject to the new shape (no images, no slug → derived)
const fromLegacy = (p: LegacyProject, idx: number): Project => ({
  id: `legacy-${idx}`,
  slug: p.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80),
  year: p.year,
  category: p.category,
  client: p.client,
  title: p.title,
  description: p.description,
  tech: [...p.tech],
  url: p.url,
  from: p.from,
  to: p.to,
  body_blocks: [],
  images: [],
  display_order: idx,
  published: true,
});

// Map a structured CaseStudy to a listing card. These render the new premium
// detail page (see App.tsx work-post branch) when their slug is opened.
const fromCaseStudy = (cs: CaseStudy, idx: number): Project => ({
  id: `cs-${cs.slug}`,
  slug: cs.slug,
  year: cs.card?.year ?? '2026',
  category: cs.category,
  client: `${cs.snapshot.client} · ${cs.snapshot.industry}`,
  title: cs.card?.title ?? cs.name,
  description: cs.card?.description ?? cs.tagline,
  tech: cs.techStack.map((t) => t.name),
  url: cs.liveUrl.replace(/^https?:\/\//, ''),
  from: cs.card?.from ?? 'from-fuchsia-950/70',
  to: cs.card?.to ?? 'to-purple-950/50',
  body_blocks: [],
  images: cs.card?.image
    ? [{ id: `cs-${cs.slug}-img`, image_url: cs.card.image, alt_text: cs.name, display_order: 0 }]
    : [],
  display_order: idx - 1000, // sort structured case studies first
  published: true,
  previewUrl: cs.showcase?.desktop?.type === 'live' ? cs.showcase.desktop.src : undefined,
  cardMockup: cs.card?.mockup,
  name: cs.card?.name ?? cs.name,
  productType: cs.card?.type ?? cs.category,
  blurb: cs.card?.blurb,
  device: cs.card?.device,
  cardImage:
    cs.card?.image ?? (cs.showcase?.desktop?.type === 'image' ? cs.showcase.desktop.src : undefined),
});

// Structured case studies always appear in the listing (DB-independent) and take
// precedence over any DB/legacy row sharing their slug.
const CASE_STUDY_CARDS = CASE_STUDIES.map(fromCaseStudy);
const CASE_STUDY_SLUGS = new Set(CASE_STUDIES.map((cs) => cs.slug));
const mergeCaseStudies = (list: Project[]): Project[] => [
  ...CASE_STUDY_CARDS,
  ...list.filter((p) => !CASE_STUDY_SLUGS.has(p.slug)),
];

// Shared cache so multiple hook callers don't refetch on every mount
let cache: { projects: Project[]; ts: number } | null = null;
const STALE_MS = 60_000; // 60s soft refresh

async function fetchProjects(): Promise<Project[]> {
  // 1) projects
  const { data: rows, error } = await supabase
    .from('website_projects')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  const projects = (rows ?? []) as unknown as Array<{
    id: string; slug: string; year: string; category: string; client: string;
    title: string; description: string; tech: string[]; live_url: string | null;
    hero_color_from: string; hero_color_to: string; body_blocks: BodyBlock[] | null;
    display_order: number; published: boolean;
  }>;
  if (projects.length === 0) return [];

  // 2) images, one round trip
  const ids = projects.map((p) => p.id);
  const { data: imgRows } = await supabase
    .from('website_project_images')
    .select('id, project_id, image_url, alt_text, display_order')
    .in('project_id', ids)
    .order('display_order', { ascending: true });
  const imgs = (imgRows ?? []) as unknown as Array<{
    id: string; project_id: string; image_url: string; alt_text: string | null; display_order: number;
  }>;
  const byProject = new Map<string, ProjectImage[]>();
  for (const i of imgs) {
    const arr = byProject.get(i.project_id) ?? [];
    arr.push({ id: i.id, image_url: i.image_url, alt_text: i.alt_text, display_order: i.display_order });
    byProject.set(i.project_id, arr);
  }

  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    year: p.year,
    category: p.category,
    client: p.client,
    title: p.title,
    description: p.description,
    tech: p.tech ?? [],
    url: p.live_url ?? '',
    from: p.hero_color_from,
    to: p.hero_color_to,
    body_blocks: Array.isArray(p.body_blocks) ? p.body_blocks : [],
    images: byProject.get(p.id) ?? [],
    display_order: p.display_order,
    published: p.published,
  }));
}

interface UseProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

/** All published projects, ordered for the public site. Live (60s soft-refresh). */
export function useAllProjects(): UseProjectsState {
  const [state, setState] = useState<UseProjectsState>({
    projects: cache?.projects ?? mergeCaseStudies(FALLBACK.map(fromLegacy)),
    loading: !cache,
    error: null,
  });

  useEffect(() => {
    let alive = true;

    const load = async (force = false) => {
      if (!force && cache && Date.now() - cache.ts < STALE_MS) {
        setState({ projects: cache.projects, loading: false, error: null });
        return;
      }
      try {
        const fresh = await fetchProjects();
        const merged = mergeCaseStudies(fresh.length > 0 ? fresh : FALLBACK.map(fromLegacy));
        cache = { projects: merged, ts: Date.now() };
        if (alive) {
          setState({ projects: merged, loading: false, error: null });
        }
      } catch (err) {
        if (alive) {
          setState((s) => ({
            ...s,
            loading: false,
            error: (err as Error).message ?? 'fetch failed',
          }));
        }
      }
    };

    load();
    // Soft refresh every 60s so CRM edits surface without a hard reload
    const t = setInterval(() => load(true), STALE_MS);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return state;
}

// NOTE: `useFeaturedProjects(limit)` used to live here. The homepage Work
// section now calls `useAllProjects` and slices locally, because it needs the
// full count for its "See all N projects" link — a pre-sliced list can't tell
// it how many projects it is hiding.

/** A single project by slug (for the detail page). */
export function useProjectBySlug(slug: string | null): {
  project: Project | null;
  loading: boolean;
  error: string | null;
} {
  const all = useAllProjects();
  const project = slug ? all.projects.find((p) => p.slug === slug) ?? null : null;
  return { project, loading: all.loading, error: all.error };
}
