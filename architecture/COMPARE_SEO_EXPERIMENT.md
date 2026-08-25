# Compare SEO experiment

## Purpose

This controlled experiment tests whether richer pair-specific structure and stronger crawlable silo navigation improve discovery and query coverage without creating new URLs. Relationship outcomes are not predicted, and no compatibility scores are used.

## Control Group A

- `/en/compare/infj-vs-isfj`
- `/en/compare/enfj-vs-isfj`
- `/en/compare/entp-vs-esfp`
- `/en/compare/entp-vs-infj`
- `/en/compare/infp-vs-isfp`

Control A retains the authored content from the previous Compare optimization batch. Shared hub and related-link navigation may change, but its page-specific titles, descriptions, introductions, sections, and FAQs must remain unchanged.

## Test Group B

- `/en/compare/intp-vs-entp`
- `/en/compare/entj-vs-entp`
- `/en/compare/infj-vs-enfj`
- `/en/compare/entp-vs-istp`
- `/en/compare/istj-vs-isfj`

Test B adds a quick answer, structured at-a-glance comparison, deeper pair-specific intent coverage, and focused FAQs. Reverse query forms continue redirecting to these canonical owners.

## Baseline metrics

Enter verified Google Search Console values at the experiment start. Do not estimate missing data.

| Page | Group | Impressions | Clicks | Average position | Ranking query count | CTR |
| --- | --- | --- | --- | --- | --- | --- |
| INFJ vs ISFJ | Control A | TBD | TBD | TBD | TBD | TBD |
| ENFJ vs ISFJ | Control A | TBD | TBD | TBD | TBD | TBD |
| ENTP vs ESFP | Control A | TBD | TBD | TBD | TBD | TBD |
| ENTP vs INFJ | Control A | TBD | TBD | TBD | TBD | TBD |
| INFP vs ISFP | Control A | TBD | TBD | TBD | TBD | TBD |
| INTP vs ENTP | Test B | TBD | TBD | TBD | TBD | TBD |
| ENTJ vs ENTP | Test B | TBD | TBD | TBD | TBD | TBD |
| INFJ vs ENFJ | Test B | TBD | TBD | TBD | TBD | TBD |
| ENTP vs ISTP | Test B | TBD | TBD | TBD | TBD | TBD |
| ISTJ vs ISFJ | Test B | TBD | TBD | TBD | TBD | TBD |

## Evaluation windows

- 7 days: early crawling, indexing, impressions, and initial query discovery.
- 14 days: direction of query growth, position movement, and CTR.
- 28 days: compare sustained discovery and movement between Control A and Test B.

Use equivalent date ranges and the same Search Console property/filter rules for both groups. Record material indexing or deployment events alongside the observations.

## Primary questions

1. Does Test B gain impressions faster?
2. Does Test B gain more ranking queries?
3. Does Test B improve average position faster?
4. Does direct hub linking increase discovery and crawling?
5. Do comparison PAA-style sections expand query coverage?

## Release contract

- No new pair URLs or reverse-pair indexable pages.
- `/en/compare/{canonical-pair}` remains the English owner.
- All 120 canonical pairs remain directly discoverable in server-rendered hub HTML.
- Existing locale-specific canonical and hreflang behavior remains intact.
- Control A authored content fingerprints must pass before release.
- FAQ schema is emitted only for the FAQ content visibly rendered on each page.
