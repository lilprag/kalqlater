# KalQLater Profile and User-Data Ownership

Audited at commit `6ca8b91`. The machine-readable contract is `profile-field-registry.json`.

## Target rule

`community_users.id` is the single user identity. It should own references to private profile facts, assessment records, Community projections, career preferences, saved jobs, applications, and connections.

One semantic fact must have one canonical writer. Public visibility is a projection/consent decision, not a second copy of the fact.

## Data layers

### Core identity

Private account and reusable person facts:

- User ID and email
- Full name
- Current role
- Years of experience
- Skills
- Industries of experience
- Languages spoken
- Structured city and country
- LinkedIn and portfolio URLs

Credentials remain isolated from profile data. Public visibility flags do not belong inside the private fact itself.

### Public Community projection

Only information deliberately shown to other people:

- Username
- Public display name
- Bio
- Selected public role, skills, industries, location, languages, and experience
- Connection intentions
- Community availability
- Selected social links
- Visibility and publication consent
- Optional personality type projection

A Jobs user must not be forced to publish this projection.

### Private career preferences

- Target roles
- Preferred locations
- Remote/work-mode preference
- Salary expectation and currency
- Notice period
- Employment status
- Open-to-work status
- Résumé URL
- Job-alert frequency

These are private by default and must not be inferred as Community availability.

### Assessment data

- Personality submissions, raw answers, calculated type, and dimension percentages
- Behavioral sessions, tokens, responses, result snapshots, recommendations, and challenges
- Assessment locale, version, timestamps, and optional personality context

Assessment records should be claimable by the single account ID. Public projection requires separate consent.

### Job activity

- Saved jobs
- Application records and statuses
- Legacy Community apply intents during migration

Current saved jobs and applications already reference `community_users.id`, which is the desired ownership direction.

## Current duplicate ownership

| Meaning | Community location | Career/other location | Current sync | Target |
|---|---|---|---|---|
| Full/display name | `display_name` | `full_name` | Bidirectional | Core name plus public display projection |
| Current role | `profession` | `current_job_title` | Bidirectional | One core role field |
| Experience | `years_experience` | `years_experience` | Bidirectional | One core fact |
| Skills | `skills` | `skills` | Bidirectional | One core list with optional projection |
| Industries | `industries` | `industries` | Bidirectional | Separate experience from target preferences if needed |
| Languages | `languages` | `languages` | Bidirectional | One core list with optional projection |
| Country/city | `country`, `city` | same plus `current_location` | Bidirectional/derived | Structured core location; display string derived |
| LinkedIn | `social_links.linkedin` | `linkedin_url` | Bidirectional | One core URL plus public visibility |
| Portfolio | `social_links.portfolio` | `portfolio_url` | Bidirectional | One core URL plus public visibility |
| Availability | Community availability | open-to-work, employment status, notice | No direct sync | Keep public networking and private job intent separate |
| Personality type | Community profile | submission and browser result | Fragmented | Claimed assessment result plus optional projection |
| Application intent | legacy apply intents | current applications | Separate systems | Unified Jobs activity or deliberate archival mapping |

## Current write behavior

- Community profile creation/update writes shared identity fields into `career_profiles`.
- Career profile update writes shared identity fields and LinkedIn/portfolio into `community_profiles` when a Community profile exists.
- The Jobs unified-profile reader merges Community-derived identity with Career Profile, with Career Profile values winning.
- Behavior results use assessment access tokens and do not reference the account ID.
- Personality submissions do not reference the account ID.
- Dashboard reads assessment activity from browser storage rather than an account-owned activity index.

## Migration requirements

1. Introduce a canonical private profile representation keyed by user ID.
2. Establish field-level migration precedence and conflict reporting before removing double writes.
3. Convert Community to a projection of selected canonical facts plus Community-only fields.
4. Keep career-only preferences in a private extension.
5. Make composite `current_location` derived from structured fields.
6. Preserve public visibility and publishing consent independently of canonical values.
7. Add optional user ownership/claim records for anonymous assessments.
8. Reconcile legacy personality submissions with current test results before declaring a canonical result.
9. Reconcile legacy apply intents with current application records only where semantics match.
10. Define account deletion/export coverage across every referenced collection.

## Privacy requirements

- Credentials, career preferences, assessment responses/results, saved jobs, and applications are private.
- Community fields are public only according to explicit field and profile visibility decisions.
- Personality type is not public merely because an assessment was completed.
- Open-to-work and salary information never inherit Community visibility.
- Assessment access tokens are credentials and must not appear in public links, analytics, or logs.
- Public profile indexing requires separate SEO eligibility in addition to publication consent.

## Change-control questions

Before adding or editing a user field:

1. What semantic fact does it represent?
2. Which layer owns it?
3. Is it private, public, or user-selectable?
4. Is another field already representing the same fact?
5. Who may write it?
6. Which consumers read it?
7. Is sync temporary migration behavior or the permanent design?
8. What happens during export, deletion, deactivation, and consent withdrawal?

