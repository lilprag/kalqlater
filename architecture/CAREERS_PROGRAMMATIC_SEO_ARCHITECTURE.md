# KalQLater Careers Programmatic SEO Architecture

Status: architecture proposal only. This document does not create routes, publish entities, change redirects, or alter indexability.

Audited against `release/insights-live` at commit `cc64821` on 2026-08-26.

## Product contract

KalQLater Careers is career intelligence, not type-based career prescription. Its durable graph is:

```text
Career -> skills -> work environment -> progression -> related careers
       -> verified jobs -> companies currently hiring
       -> optional work-style reflection
```

Personality may prompt reflection about observable work preferences. It must never determine employability, rank candidates, create a suitability percentage, or become a job-matching input.

## Current-state audit

### Routes and ownership

| Route | Owner | Current behavior | SEO state |
|---|---|---|---|
| `/{locale}/careers` | `frontend-next/app/[locale]/careers/page.jsx` | English discovery hub listing the 16 type guides | EN 200/indexable/self-canonical; HI/FR/JA 404 |
| `/{locale}/personality/{type}/careers` | `frontend-next/app/[locale]/personality/[type]/careers/page.jsx` | Personality-conditioned exploration guide, not a role page | 16 entity keys; public in EN/HI/FR/JA; preview packages for configured preview locales |
| `/{locale}/jobs` | frontend-next plus Jobs API | Fresh job inventory and editable keyword search | EN indexable; non-EN noindex in page metadata |
| `/{locale}/jobs/{slug}` | frontend-next plus Jobs API | Individual live or inactive source job | Active, complete EN records may index; inactive records noindex |

There is no `/{locale}/careers/{career-slug}` route, career-family route, skill route, or company SEO route. There are no legacy career URLs or Careers redirects in `next.config.mjs` or `proxy.js`. The only related legacy overlap is Jobs/Community, not evergreen career content.

### Existing page count and content model

- One English Careers hub.
- Sixteen personality-conditioned career guide entities. At four public locales, this is 64 public localized guide URLs, but only 16 conceptual guides.
- Each guide presents 12 role directions, producing 192 role mentions per locale. These are embedded labels, not canonical career entities, and repeated roles occur across type guides.
- Guide data is generated from `frontend-next/data/career-guides.js` for EN/HI. Additional locale packages are loaded by `frontend-next/localization/runtime`; Spanish has a special preview implementation in `frontend-next/localization/career-guide.js`.
- The current guide object contains `code`, `lens`, `careers`, `skill`, generated `roleDetails`, `settings`, `formats`, `skills`, `stages`, `industries`, `title`, `description`, `hero`, `disclaimer`, and `faq`.
- Much of the role-level prose is template-generated from a role title. It is appropriate for a type exploration guide but is too repetitive and too shallow to become a 1,000-page role database.

### Metadata, schema, sitemap, and crawl graph

- The EN hub uses `pageMetadata`, an EN self-canonical and EN/x-default alternates. Its JSON-LD is `CollectionPage` + `ItemList` + `BreadcrumbList`.
- Type career guides use entity-aware `pageMetadata`. Canonical and hreflang are derived from the entity publication registry. The page emits `BreadcrumbList` and visible `FAQPage` JSON-LD.
- `frontend-next/app/sitemap.js` owns the static Careers entries. It includes the EN hub and all published locale/type guide combinations. It declares `monthly`, but has no `lastModified`; that is preferable to fabricated build-time dates.
- `sitemap-jobs.xml` is separately inventory-driven and uses verified source timestamps.
- EN Header links to `/en/careers`; Footer does not. The homepage itself has no dedicated Careers section.
- Personality pages link directly to their type career guide. Compare pairs also link to the two relevant type guides. Type career guides link back to the personality page, Insights, Community, and Jobs.
- Type guides transfer the first or selected role label to Jobs as `?q=...`. Jobs accepts this as an editable keyword and explicitly says it is not an eligibility filter.
- Job details link back only to the generic `/en/careers` hub. No normalized role-to-career reverse link exists.
- Existing role mentions are not crawlable role links, so they do not form a career-entity graph.

### Current risks

1. The word “career” currently identifies personality-conditioned guides, while search intent for an occupation is role-based.
2. Repeated roles across 16 guides have no canonical identity, synonym policy, or deduplication owner.
3. Generated role-detail patterns would create title-substitution pages if reused.
4. The hub is a thoughtful orientation page but not a scalable role discovery surface.
5. The current Jobs query relies on free text; title aliases, skills, department, and seniority are not governed by a career entity.
6. `Analytics.jsx` recognizes a career slug under `/careers/{slug}`, although that route does not exist yet; its payload label should eventually be changed from `type` to `career_id` without changing historical events.
7. Existing architecture prose once described the Careers hub as missing; actual code and the route registry now show the EN hub as current. Code is authoritative.

## Target URL taxonomy

### Canonical families

```text
/en/careers                         career discovery hub
/en/careers/{career-slug}           canonical role entity
/en/careers/{family-slug}           optional family hub, only when eligible
```

The route resolver must distinguish a family from a career by registry lookup, not naming heuristics. A cleaner implementation is a single dynamic segment backed by one canonical registry in which each slug has exactly one entity type. If operational ambiguity becomes likely, use `/en/careers/family/{family-slug}` before publication; do not allow a slug to resolve to two meanings.

Do not create type-role combinations. Existing `/{locale}/personality/{type}/careers` pages remain self-canonical contextual guides and link to canonical role entities.

### Slug and identity rules

- `career_id` is immutable and independent of title and slug, for example `career:software-engineer` or an internal UUID plus stable public key.
- Slugs are lowercase ASCII kebab-case, singular role concepts, stripped of punctuation and employer language.
- The canonical title—not the currently popular synonym—owns the canonical slug.
- Alternate titles are normalized aliases used for search, Jobs matching, and redirects; aliases do not create indexable pages.
- A changed canonical slug receives one direct permanent redirect from every known former slug to the current slug. Never chain redirects.
- Closely related occupations remain separate only when their responsibilities, skills, work context, progression, and search intent are materially distinct.
- Specializations may be separate careers when they pass the full content threshold. Otherwise they are aliases or child specializations on the parent.
- Seniority is normally a progression field, not a URL. Create a seniority-specific career only when it is a genuinely distinct occupation with independent intent and content, not merely the same role with “senior” prepended.
- Deprecated careers return a direct 308 to a true successor only when meanings match. Otherwise retain an explanatory noindex page with related current careers; do not redirect unrelated concepts.

## Canonical career entity model

Store canonical facts separately from localized authored content and inventory-derived observations.

```ts
type CareerEntity = {
  career_id: string;                    // immutable
  slug: string;
  canonical_title: string;
  alternate_titles: string[];
  former_slugs: string[];
  career_family_id: string;
  career_category_ids: string[];
  status: 'draft' | 'published_noindex' | 'published_indexable' | 'deprecated';

  summary: string;
  what_they_do: string;
  responsibilities: AuthoredItem[];
  core_skill_ids: string[];
  secondary_skill_ids: string[];
  common_tools: SourcedItem[];
  industry_ids: string[];
  education_paths: SourcedItem[];
  experience_expectations: SourcedText | null;
  work_environment: string;
  work_modes: SourcedItem[];

  work_dimensions: {
    collaboration_level: DimensionValue;
    autonomy_level: DimensionValue;
    structure_level: DimensionValue;
    ambiguity_level: DimensionValue;
    analytical_intensity: DimensionValue;
    creative_intensity: DimensionValue;
    people_interaction: DimensionValue;
    communication_intensity: DimensionValue;
    decision_speed: DimensionValue;
    leadership_responsibility: DimensionValue;
  };

  career_progression: ProgressionPath[];
  related_career_ids: RelatedCareerEdge[];
  entry_routes: SourcedItem[];
  common_challenges: AuthoredItem[];
  success_patterns: AuthoredItem[];
  learning_priorities: SkillEdge[];
  job_match: JobMatchConfig;
  faq: AuthoredFaq[];

  provenance: ProvenanceRecord[];
  content_version: number;
  content_fingerprint: string;
  last_content_reviewed_at: string;
  index_eligible: boolean;
  index_reason: string[];
};
```

`DimensionValue` should contain a bounded ordinal (for example 1–5), a plain-language label, evidence/provenance, confidence, and applicability notes. It must not be a personality fit score.

### Field ownership

| Owner | Fields |
|---|---|
| Curated/authored | summary, what_they_do, responsibilities, work_environment explanation, progression narrative, entry routes, challenges, success patterns, learning priorities, FAQ, dimension explanations |
| Taxonomy-derived | canonical ID/title, aliases, family/category, standardized skill IDs, tool IDs, related-career candidates, source occupation codes |
| Deterministically derived | slug, fingerprints, completeness metrics, internal-link candidates, index eligibility report, localized URL set |
| Job-inventory-derived | active job IDs/count, currently hiring companies, observed title aliases, observed skills/tools, work-mode distribution, latest verification time |

Inventory observations must be timestamped and labeled as current-market evidence. They must not silently overwrite evergreen authored facts. Salary, employment projections, education norms, or market statistics remain absent until a trustworthy source, geography, period, and update policy exist.

## Relationship graph

### Career to skills

Use canonical many-to-many edges rather than embedded display strings.

```ts
type CareerSkillEdge = {
  career_id: string;
  skill_id: string;
  relationship: 'core' | 'secondary' | 'tool' | 'learning_priority';
  proficiency_context?: 'foundation' | 'working' | 'advanced';
  evidence: ProvenanceRef[];
  confidence: 'high' | 'medium' | 'low';
  reviewed_at: string;
};
```

Skills own their canonical name, aliases, and normalization. Careers own the relevance and explanatory context. Reverse lookup (`skill -> careers`) is generated from approved edges. Skill pages are out of scope until enough careers and unique skill-level value justify indexing.

### Career to Jobs

Each career owns a conservative matching configuration:

```ts
type JobMatchConfig = {
  normalized_titles: string[];
  excluded_title_patterns: string[];
  department_terms: string[];
  required_signals?: string[];
  skill_ids: string[];
  seniority_policy: 'all' | string[];
  minimum_match_confidence: number;
  version: number;
};
```

The resolver scores title/alias first, then department and explicit skills, with exclusions preventing common collisions. Personality is never a signal. The career page requests active, recently verified jobs, returns count plus a bounded list, and links to `/en/jobs?q={canonical query}`. Zero inventory displays a stable evergreen section with related careers, skills, and an optional alert/profile CTA; it never removes or noindexes the career page.

Jobs should eventually expose a normalized `career_id` and match evidence at read time. Job detail pages can then link back to the career entity. This can begin as a versioned resolver over existing records and does not require mutating source descriptions.

### Career to companies

`career_id -> active jobs -> company_id` is inventory-derived. Show “Companies currently hiring” only when at least one active, recently verified matching job exists. Deduplicate companies, show the evidence count, and remove the module when inventory expires. Do not create company SEO pages until company identity, canonical domains, active inventory, unique company content, indexing criteria, and takedown behavior are defined.

### Career to work style and personality

Career pages expose observable dimensions only: autonomy, collaboration, structure, ambiguity, analysis, creativity, people interaction, communication, leadership responsibility, and decision pace. A later user reflection may compare stated preferences with these characteristics using descriptive differences and uncertainty—not a percentage, verdict, or hiring recommendation.

Type career guides may link to roles with language such as “explore this work” or “compare the work environment.” They must not say a role is best for a type. Career pages may link to optional assessments as reflection tools, with the same disclaimer. Assessment results must never alter public career facts or employer-facing ranking.

## Career page V1

1. Breadcrumbs: Careers > Family (when public) > Career.
2. H1 and concise, sourced definition.
3. Quick answer: “What does a {career} do?”
4. Role at a glance: focus, collaboration, environment, core skills, tools.
5. What this role actually does.
6. Typical responsibilities.
7. Core and secondary skills.
8. Tools and technologies, only where supported.
9. Example workday, explicitly variable by employer/industry and omitted if evidence is weak.
10. Work environment and work-style dimensions.
11. Career progression, allowing multiple paths and “varies” rather than a universal ladder.
12. How to enter the career: education, experience, portfolio/project and transition routes where sourced.
13. Skills to learn next.
14. Common challenges and success patterns.
15. Related careers with a reason for each edge.
16. Current verified jobs with zero-inventory fallback.
17. Companies currently hiring, conditional on inventory.
18. Visible, entity-specific FAQ.
19. Contextual CTA: explore jobs, build career profile, or optional work-style reflection.

Shared layout copy is acceptable. The definition, core sections, responsibilities, progression, challenges, FAQ, and relationship rationales must be entity-specific.

## Careers hub and family hubs

### `/en/careers`

Evolve the existing hub without removing its current safety framing:

- Search canonical titles and aliases.
- Popular careers based on disclosed, durable evidence—not random rotation.
- Browse by eligible career family.
- Careers with verified openings.
- Recently reviewed guides based on real `last_content_reviewed_at`.
- All indexable careers A–Z as crawlable HTML links, paginated only if every page remains crawlable.
- Keep the type-guide selector as a secondary “work-style reflection” section.

### Family eligibility

A family hub may become indexable only when it has:

- at least 8 indexable child careers (recommended launch threshold; review empirically),
- a stable taxonomy definition and no collision with a career slug,
- unique authored family overview, skill patterns, work contexts, and progression distinctions,
- at least 5 contextual links to representative children plus crawlable access to all children,
- meaningful differentiation from the root hub and other families,
- valid metadata, breadcrumbs, ItemList, provenance, and review date.

Below threshold, the family remains a non-indexable filter or UI grouping. Zero current jobs does not disqualify a family.

## Index eligibility

Route existence and publication are separate. Default every new entity to `draft`.

### State behavior

| State | Route | Robots | Sitemap/internal discovery |
|---|---|---|---|
| `draft` | unavailable outside editorial tooling | none | excluded |
| `published_noindex` | 200 for QA or useful product access | `noindex,follow` | excluded from sitemap; do not feature as canonical discovery result |
| `published_indexable` | 200 | `index,follow` | included and linked from hub/family |
| `deprecated` | 308 to exact successor, or retained explanatory noindex page | depends on disposition | old URL excluded |

### Minimum `published_indexable` gate

All conditions are required:

1. Unique canonical entity and slug; aliases and former slugs collision-free.
2. Approved title, summary, definition, and materially unique `what_they_do`.
3. At least 5 non-duplicative responsibilities.
4. At least 5 approved skills, including at least 3 core skills.
5. Work environment plus at least 6 reviewed work dimensions.
6. At least one defensible entry route and one progression path; uncertainty explicitly represented.
7. At least 3 related career edges with written rationales and reciprocal-link review.
8. At least 3 common challenges and 3 learning priorities.
9. At least 4 visible, role-specific FAQs.
10. Provenance coverage for factual claims; no unsupported salary/statistics.
11. Unique title/description/H1, self-canonical, valid breadcrumb, and schema checks.
12. At least one crawlable parent link and three useful outbound internal links.
13. Search/product intent review completed. Existence in a taxonomy alone is insufficient.
14. Duplicate, near-duplicate, thin-content, and title-substitution validators pass.
15. Editorial approval, content version, fingerprint, and truthful review timestamp recorded.

Live-job count is not an eligibility requirement because a career page is evergreen.

## Duplication protection

Add a deterministic Careers validator before any scaled release. It should parse the final normalized entity representation and rendered visible text.

- Fail identical normalized `summary`, `what_they_do`, long section bodies, responsibility sets, progression narratives, challenge sets, or FAQ answer sets across different entities.
- Calculate pairwise token shingles/MinHash or cosine similarity for long sections and whole-page entity-owned text. Flag high similarity for editorial review; use stricter thresholds within the same family.
- Detect title-only substitution by replacing each page’s title/aliases with a placeholder before comparison.
- Measure repeated responsibility and FAQ sentences across the corpus; allow a small explicit shared-copy allowlist only for legal/safety UI.
- Fail alias-to-canonical, canonical-to-canonical, former-slug, and family-slug collisions.
- Flag seniority pairs whose substantive bodies are near-identical.
- Fail missing/empty arrays, minimum-count violations, weak provenance, broken related IDs, non-reciprocal unexplained edges, orphan entities, and invalid states.
- Render-check canonical, robots, hreflang, JSON-LD, H1, internal links, visible FAQ/schema parity, and absence of English fallback in localized pages.
- Produce a machine-readable report with entity pair, field, similarity score, and sampled overlaps. Do not “pass” by hiding duplicated text from the validator.

## Internal linking and click depth

```text
Homepage -> Careers hub -> family hub -> career
                      \-> career (popular/A-Z/openings)
Career <-> related careers
Career <-> skills (when skill pages are eligible)
Career -> filtered Jobs -> job detail
Job detail -> normalized career
Career -> inventory-derived companies
Personality/type guide -> selected canonical careers
```

- Every indexable career must have a crawlable `<a>`/`Link` from the A–Z hub and at least one family or curated module.
- Target maximum depth from homepage: 3 clicks for every career; 2 clicks for priority careers.
- Related-career edges should normally be reciprocal, with direction-specific rationale allowed.
- Query URLs remain actions/filter states and should canonicalize to the Jobs directory policy; they are not career landing pages.
- Do not rely on client-side search, random modules, or live inventory as the only discovery path.

## Homepage integration

Add one stable “Explore Careers” section only during implementation. It should link to the hub and a small set of canonical careers selected by a documented signal: editorial priority, sustained first-party navigation, meaningful Search Console evidence, recently reviewed guides, or sufficient current job inventory. Store the reason and effective period. Recompute deliberately, not per request or random rotation. Changes should represent real product/content evidence.

## Sitemap and `lastmod`

- Keep the hub and the first controlled role batch in the main sitemap initially.
- Introduce `/sitemap-careers.xml` when operational separation is useful (recommended before or around 500 role URLs, not because of the 50,000 URL protocol limit).
- Include only `published_indexable` canonical URLs.
- `lastmod` is the latest material authored content review/update for that locale. Job-count changes, page renders, deployments, and builds do not change evergreen career `lastmod`.
- Family `lastmod` changes only when its authored content or curated membership materially changes.
- Sitemap generation must fail closed for invalid records and must not publish draft/noindex/deprecated aliases.
- Add the Careers sitemap to `robots.js` only when the endpoint exists and validates.

## Structured data

- Career page: `WebPage` and `BreadcrumbList`.
- Hub/family: `CollectionPage`, `BreadcrumbList`, and an `ItemList` matching visible links.
- `FAQPage` only when every question and answer is visible and eligible under current search-engine policy; schema adds clarity, not guaranteed rich results.
- Never put `JobPosting` on an evergreen career page. Keep it only on a specific active job page with required source data.
- Do not use `Review` or `AggregateRating`.
- `Occupation` may be evaluated later only if the entity maps reliably to a recognized occupation and the implemented properties are supported by sourced data. Avoid unsupported `estimatedSalary`, `educationRequirements`, experience, or occupational category claims. `Occupation` is not required for V1.

## Localization

- Launch the scalable role family in English first. EN records alone may be `published_indexable` initially.
- HI/FR/JA role URLs should 404 until a complete localized entity and route publication state exist; do not render English under localized URLs.
- Translation is per entity and per locale, with native editorial review of title/aliases, meaning, labor-market terminology, FAQs, metadata, and internal links. Machine completeness alone is insufficient.
- Publish localized pages only when the localized version independently passes content, duplication, provenance, metadata, and crawl checks.
- Emit hreflang only among truly public equivalents, always self-referential, with `x-default` to EN. A missing translation simply has no alternate.
- Local job inventory may remain source-language content; label it clearly. Do not claim a localized job description when none exists.
- Existing type career guides and their EN/HI/FR/JA canonicals remain unchanged during the role rollout.

## Provenance and review

Use three source classes:

1. Official occupational taxonomies and government labor sources for definitions, tasks, classifications, and broadly supported pathways.
2. Current verified job descriptions for observed titles, tools, skills, work modes, and hiring companies. Aggregate observations; do not copy employer prose into evergreen content.
3. Curated KalQLater interpretation for plain-language synthesis, work-style explanations, challenges, progression caveats, and navigation.

Each factual block or list item stores:

```ts
type ProvenanceRecord = {
  provenance_id: string;
  source_class: 'official_taxonomy' | 'government_dataset' | 'job_inventory' | 'authored';
  source_name: string;
  source_url?: string;
  source_record_id?: string;
  jurisdiction?: string;
  observed_from?: string;
  observed_to?: string;
  retrieved_at?: string;
  reviewed_at: string;
  reviewer: string;
  supports_fields: string[];
  license_or_usage_note?: string;
};
```

Store source snapshots or durable references where licensing permits, a transformation/version log, and claim-to-source links. Job-derived claims require minimum sample and recency policies defined before use. Conflicting evidence is retained and resolved editorially, not averaged into invented certainty.

## Dataset rollout

### Phase 1: 50–100 careers

Recommended target: 75. Begin with broad families and roles that are useful to the product, represented in verified Jobs inventory, already recur in existing type guides, and/or have defensible Search Console evidence. Do not claim keyword volume without a measured source.

Suggested seed set for editorial/source validation—not a volume ranking:

- Software Engineer, Backend Engineer, Frontend Engineer, Data Engineer, Cybersecurity Specialist, Systems Analyst
- Product Manager, Product Marketing Manager, Product Analyst, UX Researcher, UX Designer, Service Designer
- Data Scientist, Data Analyst, Business Analyst, Research Scientist, Policy Analyst, Financial Analyst
- SEO Manager, Growth Marketing Manager, Performance Marketing Manager, Brand Strategist, Content Strategist, Communications Manager
- Sales Manager, Business Development Manager, Account Manager, Customer Success Manager, Partnerships Manager, Recruitment Specialist
- Operations Manager, Project Manager, Program Manager, Supply Chain Planner, Quality Manager, Compliance Specialist
- Visual Designer, Technical Writer, Learning Designer, Educator, Community Manager, People Operations Specialist
- Healthcare Administrator, Healthcare Operations Manager, Public Administration Manager, Nonprofit Manager

This list intentionally spans existing guide vocabulary and observed Jobs matching capabilities. Each candidate still must pass source, intent, uniqueness, and eligibility review; unsupported candidates remain draft.

### Later phases

- Phase 2 (~250): deepen validated families and occupational coverage; calibrate aliases and Jobs resolver from real mismatches.
- Phase 3 (~500): add specializations with distinct intent, introduce a separate Careers sitemap, and consider only proven skill hubs.
- Phase 4 (1,000+): extend coverage through real canonical occupations and defensible specializations, with editorial review capacity and automated duplicate gates scaled first.

Priority inputs are broad occupational coverage, current verified job inventory, existing role references, product journeys, and measured Search Console/search-demand evidence. No phase publishes a fixed quota at the expense of quality.

## Migration and legacy safety

The new role family does not conflict with current route shapes. Preserve current canonicals:

| Existing owner | Target relationship | Migration action |
|---|---|---|
| `/en/careers` hub | Root of role discovery plus secondary type exploration | Evolve in place; preserve canonical |
| `/{locale}/personality/{type}/careers` | Work-style/personality context | Keep URL and self-canonical; replace plain role mentions selectively with links to published equivalent-locale role entities |
| `/{locale}/jobs?q=...` | Live inventory action | Preserve behavior; generate queries from career match config |
| `/{locale}/jobs/{slug}` | Specific job | Add career link only when resolver confidence passes |

Do not redirect type career guides to roles: one guide discusses many roles and owns different intent. Do not canonicalize them to the hub or a role. When role entities launch, update sitemap, entity registry, hub ItemList, breadcrumbs, analytics, and internal links atomically. Verify no alias shadows a family or existing static child route.

## Risks and controls

### SEO risks

- Thin/title-swapped pages: blocked by field thresholds and normalized-content similarity checks.
- Cannibalization among aliases, specializations, families, type guides, and Jobs: one canonical registry, explicit intent ownership, redirects only for true synonyms.
- Stale facts: per-field provenance and review timestamps; no build-time `lastmod`.
- Index bloat: draft/noindex default and sitemap allowlist from publication state.
- Orphans: hub A–Z coverage plus graph validation and click-depth checks.
- Structured-data misuse: conservative schema contract; no JobPosting on evergreen pages.
- Locale duplication: locale-level publishing gate and no English fallback.

### Product and safety risks

- Personality determinism: prohibited copy patterns and automated checks for “best type,” fit percentages, and suitability claims.
- Misleading labor-market certainty: qualify variability and prohibit unsupported salary/statistics.
- Bad job matching: expose match rationale, apply confidence thresholds, permit editable searches, never use personality.
- Empty live inventory: evergreen content and stable zero-state remain useful.
- Taxonomy over-complexity: one immutable career identity and one accountable editorial owner.

## 10K+ entity-graph capacity

Scale comes from independently useful entities, not combinatorial URLs:

```text
Personality guides <-> Compare pairs
        |                  |
        +----> Careers <-> Skills
                  |          |
                  v          v
                 Jobs ----> Companies
```

A plausible architecture can support 1,000–1,500 careers, a curated set of genuinely useful skill entities, active canonical job details, and eventually qualified company entities. Compare and personality pages add distinct intents. The system must never multiply career × personality × locale × seniority merely to increase URL count. Each indexable URL needs its own entity, intent, evidence, useful page, and lifecycle.

## Recommended first implementation batch

1. Add a career entity schema/registry and validators only; seed 10–15 draft entities across at least five families.
2. Establish source/provenance records, alias collision checks, content fingerprints, and publication-state enforcement.
3. Implement one non-indexable preview route/template behind draft/editorial access and validate rendered metadata/schema/content. Do not add it to sitemap or public navigation.
4. Build and test the career-to-job resolver against current inventory, including zero-result behavior and false-positive review.
5. Run editorial and SEO review. Only then publish a controlled 10–15 page pilot, update the EN hub and internal links, and observe indexing/engagement before completing the 50–100 page Phase 1 set.

The first engineering deliverable should therefore be the canonical entity contract plus validation pipeline, not bulk content or route generation.
