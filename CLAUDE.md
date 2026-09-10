# Texas Civic Guide

Repository: `cryptoqueen23/texas-civic-guide`
Live site: `texas-civic-guide.vercel.app`

## Purpose

Texas Civic Guide is an independent, bilingual (English/Spanish) civic education website that helps ordinary residents understand and navigate local government.

## Core rule

**NO SOURCE = NO ANSWER.**

Rely only on official government sources. Never guess, and never mix rules, records, contacts, agendas, or procedures between jurisdictions.

## Jurisdictions

- Copperas Cove, Texas
- Gatesville, Texas
- Coryell County, Texas

Never cross these boundaries just because two governments use similar software or terminology.

- Gatesville's agenda portal (`https://public.destinyhosted.com/agenda_publish.cfm?id=26773`) belongs to **Gatesville only**.
- Copperas Cove must use Copperas Cove official sources.
- Coryell County must use county sources.
- Example: "Narrows" is a **Copperas Cove** search topic. It must NOT be routed to Gatesville.

## Main UX goal

A resident should be able to type something natural — `water bill`, `pothole`, `council agenda`, `Narrows`, `chicken ordinance`, `2025 audit`, `property tax`, `public records` — and be routed to the correct information without needing to understand government structure. Search must be jurisdiction-specific.

### Search behavior (implemented)

`components/CityHome.tsx` contains deterministic search routing.

- Known terms route to: I Need Help, Meetings, Follow the Money, Documents, Public Records.
- Unknown searches route to Documents while preserving the exact query (no silent failures).
- Search URLs preserve `q=`, `lang=en`, `lang=es`.
- Jurisdiction-specific search phrases restrict city-specific subjects to the correct jurisdiction.

**Before changing this file, fetch the current version from `main`** — search and jurisdiction fixes are committed frequently; don't work from a stale copy.

### Future search upgrade (not yet built)

The next major feature is **actual official-record search** — e.g. searching "Narrows" on Copperas Cove should eventually return real Copperas Cove agendas, agenda packets, minutes, ordinances, resolutions, budgets, contracts, and project documents.

Each result should contain: document title, date, document type, jurisdiction, official source, direct official link, and a relevant excerpt/snippet when available.

Do not generate an AI answer unless supporting official records exist.

## Resident tools (planned/in progress)

- I Need Help
- Your Local Government
- Meetings
- Follow the Money
- Documents
- Your Rights
- Charter / Government Structure
- Texas Open Meetings Act
- Texas Public Information Act
- Official Sources
- Find It Before You PIR It
- (future) TPIA/PIR Builder
- (future) source-bound Ask the Records / Ask City Hall

## Council Citizen Guides

Bilingual feature: **Speaking at City Council / Hablar ante el Concejo Municipal**. Separate guides exist per city at `/gatesville/council-guide` and `/copperas-cove/council-guide` — **do not make the procedures identical.**

### Gatesville

Source: two-page citizen guide prepared by Leo Corona using the 2026 Open Meetings Act Handbook and Gatesville's January 10, 2023 Council Meeting Procedure Policy.

- Review the City's Formal Agenda and supporting documents.
- Contact City Hall: 803 Main Street, Gatesville, TX 76528, (254) 865-8951.
- Contact a council member by going through City Hall.
- "Report a Problem" covers code violations, manhole overflow, potholes, sewer problems, water leaks.
- After-hours water/sewer issues: Gatesville Police, (254) 865-2226.
- Citizen Forum permits **3 minutes**.
- Council generally cannot deliberate on a non-agenda Citizen Forum subject.
- Government may not unfairly discriminate among speakers based on viewpoint; lawful public criticism cannot be prohibited; residents may record open meetings.
- Gatesville-specific agenda-placement procedures apply and must stay Gatesville-specific.

### Copperas Cove

Separate guide because procedures differ.

- **Citizen Forum allows up to 5 minutes per person** (vs. Gatesville's 3 minutes).
- Never copy Gatesville's agenda-placement procedures, addresses, phone numbers, or other local rules onto the Copperas Cove page.

## Bilingual requirement

- Site is English/Spanish; use natural Spanish, not word-for-word machine translation.
- Language selector visibly shows **English / Español**.
- Changing languages should preserve the same city, section, and search whenever possible.

## Design

Feel like a serious resident civic field guide, not a government brochure or generic SaaS site.

**Avoid:** glassmorphism, gradient blobs, repetitive rounded cards, excessive pills, generic AI/SaaS layouts, robotic marketing copy, fake statistics, excessive symmetry.

**Favor:** editorial typography, purposeful hierarchy, restrained layouts, clear government-document cues, mobile-first design, accessibility, strong information architecture, obvious official-source links.

Target WCAG 2.2 AA (see global accessibility rules).

## Brand separation

Keep these projects and identities separate:

- **Texas Civic Guide** — civic education, official records, resident tools. Stays neutral and source-driven even when information discovered elsewhere is politically controversial.
- **The Coryell County Scoop** — investigation and accountability journalism/content.
- **Chronium** — evidence and research engine.
- **Phoenix Securitas** — umbrella/flywheel identity.

## Footer

Include: Texas Civic Guide · Independent civic education resource · Not affiliated with the City of Copperas Cove, City of Gatesville, or Coryell County · English/Español · Phoenix Securitas link · (eventually) Accessibility, Sources, Disclaimer, Last Legal Review.

## Development rule

Before changing a file, fetch the current version from `main`. Do not rely on a stale local copy, especially of `components/CityHome.tsx`.

**Copperas Cove = Copperas Cove records. Gatesville = Gatesville records. Coryell County = county records.** Never cross those boundaries.
