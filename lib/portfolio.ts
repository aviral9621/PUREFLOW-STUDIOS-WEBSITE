import type { Project } from '../hooks/useProjects';
import type {
  DeviceKind,
  PortfolioItem,
  PreviewSource,
} from '../components/sections/ProjectShowcaseCard';

// ─────────────────────────────────────────────────────────────────────────────
// The single adapter between the project data layer (`hooks/useProjects` —
// Supabase rows, structured case studies and the hardcoded seed all normalised
// into `Project`) and the presentational showcase card.
//
// The card knows nothing about `Project`; anything that can produce a
// `PortfolioItem` can render one. Keep every "which field wins" decision here.
// ─────────────────────────────────────────────────────────────────────────────

/** Trim trailing punctuation and the " · Industry" suffix off a client string. */
function brandFrom(project: Project): string {
  if (project.name) return project.name;
  const client = project.client?.split('·')[0]?.trim();
  return client || project.title;
}

/**
 * Preference order for the preview, best-looking first:
 *   1. a real screenshot / product shot
 *   2. a designed in-app mockup (products with no public URL)
 *   3. the live site, embedded and scaled
 *   4. the first uploaded project image
 *   5. a neutral UI skeleton
 */
function previewFrom(project: Project, name: string): PreviewSource {
  if (project.cardImage) return { type: 'image', src: project.cardImage, alt: `${name} interface` };
  if (project.cardMockup) return { type: 'mockup', kind: project.cardMockup };
  if (project.previewUrl) return { type: 'live', src: project.previewUrl };
  if (project.images.length > 0) {
    const [first] = project.images;
    return { type: 'image', src: first.image_url, alt: first.alt_text ?? `${name} interface` };
  }
  return { type: 'placeholder' };
}

/** A phone frame only makes sense for content that renders a mobile layout. */
function deviceFrom(project: Project, preview: PreviewSource): DeviceKind {
  if (project.device === 'phone' && preview.type === 'live') return 'phone';
  if (project.device === 'phone' && preview.type === 'image') return 'phone';
  return 'browser';
}

export function toPortfolioItem(project: Project): PortfolioItem {
  const name = brandFrom(project);
  const preview = previewFrom(project, name);

  return {
    id: project.id,
    slug: project.slug,
    category: project.productType || project.category,
    name,
    description: project.blurb || project.description,
    device: deviceFrom(project, preview),
    preview,
  };
}

export function toPortfolioItems(projects: Project[]): PortfolioItem[] {
  return projects.map(toPortfolioItem);
}
