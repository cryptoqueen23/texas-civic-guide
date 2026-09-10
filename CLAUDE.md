# Texas Civic Guide — Project Canon

Repository: `cryptoqueen23/texas-civic-guide` (main branch: `main`)
Live site: `texas-civic-guide.vercel.app`

Treat this file as authoritative project rules. Do not reinterpret or override them unless the project owner explicitly changes them.

## 1. Mission

Texas Civic Guide is an **independent civic education and government-record navigation tool** for ordinary Texas residents — not a city website, political campaign site, investigative publication, or generic government directory. Its job is to make local government easier to understand and navigate.

Core rule: **NO SOURCE = NO ANSWER.** Official government records remain authoritative; Texas Civic Guide is the navigation and explanation layer, never the authority itself.

## 2. Jurisdictions

- Copperas Cove, Texas
- Gatesville, Texas
- Coryell County, Texas

These are separate jurisdictions with separate records, officials, procedures, contacts, meetings and search indexes. **Never mix them.**

## 3. Jurisdiction isolation (critical)

A search performed from `/copperas-cove` must use Copperas Cove information only. A search from `/gatesville` must use Gatesville information only. A search from `/coryell-county` must use Coryell County information only.

A record from one jurisdiction must NEVER satisfy a query from another jurisdiction merely because the terminology or software looks similar.

- **Narrows canon**: "Narrows" is a **Copperas Cove** topic (Narrows Project / Narrows Business & Technology Park). Searching it should search Copperas Cove agendas, packets, minutes, resolutions, contracts, budgets, and capital plans. Never associate it with Gatesville.
- **Gatesville agenda canon**: `https://public.destinyhosted.com/agenda_publish.cfm?id=26773` (`id=26773`) belongs to **Gatesville only**. Do not use it as a Copperas Cove source, and do not infer another DestinyHosted portal belongs to a city just because the URL structure looks similar.

**Fixed 2026-09-10**: `findRoute()` in `components/CityHome.tsx` used to search `cityRoutes` and `countyRoutes` together (with only a small score bonus for the matching area), so an out-of-jurisdiction query — e.g. "property tax" typed on the Gatesville page — could match the county-only route and present a county office name while linking to the city's own `officialUrl`. Fixed by restricting `findRoute` to only the current jurisdiction's own route pool; an unmatched out-of-jurisdiction query now correctly falls through to that jurisdiction's honest fallback route instead of borrowing another jurisdiction's answer.

## 4. Search has two jobs — do not conflate them

### Layer 1: Civic Router (implemented, in `components/CityHome.tsx`)

Handles service questions like "I have a water leak," "Where do I pay my ticket?", "Who handles potholes?" — routes the resident to the correct office/section (I Need Help, Meetings, Follow the Money, Documents, Public Records). Deterministic phrase matching, jurisdiction-scoped via the `cities` field and the per-jurisdiction route pool (see fix above). URL preserves `q=`, `lang=`, and the destination `#section`. Unmatched queries fall back to a honest per-jurisdiction "Documents" pointer rather than dead-ending or guessing.

### Layer 2: Official Record Search (NOT YET BUILT)

Handles record queries like "Narrows," "chicken ordinance," "2025 audit," "water rates," "Certificate of Obligation." These must search **actual indexed government records**, not scroll to a generic section.

**Do not solve this by stuffing hundreds of aliases into `CityHome.tsx`.** Build a jurisdiction-specific official-document index instead, e.g.:

- `data/search/copperas-cove.json`
- `data/search/gatesville.json`
- `data/search/coryell-county.json`

Each record roughly: `id, jurisdiction, title, documentType, date, meetingDate, description, keywords, officialUrl, sourcePage, retrievedAt` (optionally later: `text, snippet, checksum, archiveUrl, meetingId, agendaItem`). Search only the index belonging to the current jurisdiction.

**Ranking (V1, no AI needed):** exact title match → title contains query → keyword match → description match → document text match; then sort ties by date.

**Result UI**: an actual search-results view (title, date, document type, short excerpt, "View official record →", source jurisdiction) — not a SaaS card grid, not a bare scroll to "Documents."

**No-result behavior**: say *"We couldn't verify a public record matching '\_\_\_' yet"* with links to search the official city website / official agendas and minutes. **Never** say "there are no records" — absence from the index does not prove the government has no such record (see §5).

**Bilingual evidence**: English and Spanish searches must hit the **same** underlying record index — store one record with `keywordsEn`/`keywordsEs` (or equivalent), not two separate factual databases.

## 5. Search evidence rule

A search result must be traceable to an official source. If Texas Civic Guide cannot verify a result: **"We couldn't verify a matching public record yet."** Never claim "there are no records" — that's a claim only the government's own records can support.

## 6. Find It Before You PIR It

Before a resident files a Texas Public Information Act (TPIA) request, have them search existing public records first.

- If a likely responsive document already exists: *"We found records that may answer your question. You may not need to file a public-information request,"* then show the documents.
- If nothing relevant is found: offer the TPIA/PIR tools.

This feature depends on Layer 2 (the official-record index) existing.

## 7. Resident tools (planned/in progress)

- I Need Help
- Your Local Government (elected officials, appointed leadership, departments)
- Meetings (agendas, agenda packets, minutes, meeting videos)
- Follow the Money (budgets, audits, tax rates, debt, bonds, Certificates of Obligation, contracts, procurement, capital projects)
- Documents (ordinances, resolutions)
- Your Rights
- Charter / Government Structure
- Texas Open Meetings Act
- Texas Public Information Act
- Official Sources
- Find It Before You PIR It (§6)
- (future) TPIA/PIR Builder
- (future) source-bound Ask the Records / Ask City Hall

## 8. Direct office information (current weakness)

The civic router identifies the right office/department but many results still link to the jurisdiction's generic homepage instead of a direct department page or verified contact (phone/email). Target: store direct official URLs and verified contact data as structured jurisdiction data (not hard-coded generically) for Utility Billing, Streets, Solid Waste, Code Compliance, Animal Control, Municipal Court, Building/Permits, City Secretary, Finance/Budget, etc.

## 9. Source hierarchy

Whenever possible: **Texas Civic Guide explanation → direct official government document/page → original government source.** Don't send residents to a generic homepage when a verified direct department/agenda/document/service page is available.

## 10. Bilingual canon

- Site is English/Spanish; use natural Spanish, not word-for-word machine translation. Spanish is a first-class interface, not an afterthought.
- Language selector visibly shows **English / Español**.
- Changing language must preserve jurisdiction, search query, current section, and destination whenever practical (never throw the user back to the homepage). Example: `/copperas-cove?q=Narrows&lang=en` ↔ `/copperas-cove?q=Narrows&lang=es`.
- English and Spanish must search the **same** evidence base — no parallel factual databases (§4, §10).

## 11. Council Citizen Guides

Bilingual feature: **Speaking at City Council / Hablar ante el Concejo Municipal**. Separate guides at `/gatesville/council-guide` and `/copperas-cove/council-guide` — **do not make the procedures identical.**

### Gatesville

Source: two-page citizen guide prepared by Leo Corona using the 2026 Open Meetings Act Handbook and Gatesville's January 10, 2023 Council Meeting Procedure Policy.

- Review the City's Formal Agenda and supporting documents.
- Contact City Hall: 803 Main Street, Gatesville, TX 76528, (254) 865-8951.
- Contact a council member by going through City Hall.
- "Report a Problem" covers code violations, manhole overflow, potholes, sewer problems, water leaks.
- After-hours water/sewer issues: Gatesville Police, (254) 865-2226.
- Citizen Forum permits **3 minutes**.
- Council generally cannot deliberate on a non-agenda Citizen Forum subject; government may not unfairly discriminate among speakers by viewpoint; lawful public criticism cannot be prohibited; residents may record open meetings.
- Gatesville's agenda-placement procedure is specifically Gatesville's and must stay Gatesville-specific.

### Copperas Cove

Separate guide because procedures differ.

- **Citizen Forum allows up to 5 minutes per person** (vs. Gatesville's 3 minutes).
- Never copy Gatesville's agenda-placement procedures, addresses, phone numbers, or other local rules onto the Copperas Cove page.

## 12. Neutrality & brand separation

Texas Civic Guide is the education/official-record layer: factual, neutral, source-bound — even when information found elsewhere is politically controversial. It is not The Coryell County Scoop.

- **Texas Civic Guide** — civic education, official records, resident navigation.
- **The Coryell County Scoop** — investigation and accountability journalism/content.
- **Chronium** — evidence, archival research and investigation infrastructure.
- **Phoenix Securitas** — umbrella/flywheel identity.

Do not merge their editorial purposes.

## 13. Design canon

Feel like a Texas civic field guide, not a municipal brochure, generic SaaS app, or AI-generated landing page.

**Avoid:** glassmorphism, gradient blobs, repetitive rounded cards, excessive pills, generic AI/SaaS layouts, robotic marketing copy, fake statistics, excessive symmetry.

**Favor:** editorial typography, clear hierarchy, strong navigation, purposeful asymmetry, restrained layouts, obvious source attribution, excellent mobile usability, accessibility.

Target WCAG 2.2 AA (see global accessibility rules).

## 14. Footer

Include: Texas Civic Guide · Independent civic education resource · Not affiliated with the City of Copperas Cove, City of Gatesville, or Coryell County · English/Español · Phoenix Securitas link · (eventually) Accessibility, Sources, Disclaimer, Last Legal Review.

## 15. Development canon

- Before editing an existing file, fetch the current version from `main` — the repo changes rapidly (search/jurisdiction fixes land often); don't work from a stale copy.
- Don't claim something is live on Vercel merely because it was committed to GitHub — verify deployment separately.

## 16. Final rule

- Convenience vs. evidence → **evidence wins.**
- Clever AI behavior vs. predictable resident navigation → **predictable navigation wins.**
- Conflict between jurisdictions → **keep them separate.**
- No verified source → **do not invent the answer.**
