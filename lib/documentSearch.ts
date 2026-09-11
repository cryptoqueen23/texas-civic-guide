import { normalize } from '@/lib/searchText';
import type { DocumentSearchIndex, JurisdictionSlug, OfficialRecord } from '@/lib/types';
import copperasCoveIndex from '@/data/search/copperas-cove.json';
import gatesvilleIndex from '@/data/search/gatesville.json';
import coryellCountyIndex from '@/data/search/coryell-county.json';

const INDEXES: Record<JurisdictionSlug, DocumentSearchIndex> = {
  'copperas-cove': copperasCoveIndex as DocumentSearchIndex,
  gatesville: gatesvilleIndex as DocumentSearchIndex,
  'coryell-county': coryellCountyIndex as DocumentSearchIndex,
};

export const DOCUMENT_TYPE_LABELS: Record<string, { en: string; es: string }> = {
  ordinance: { en: 'Ordinance', es: 'Ordenanza' },
  resolution: { en: 'Resolution', es: 'Resolución' },
  agenda: { en: 'Agenda', es: 'Agenda' },
  minutes: { en: 'Minutes', es: 'Actas' },
  budget: { en: 'Budget', es: 'Presupuesto' },
  contract: { en: 'Contract', es: 'Contrato' },
  audit: { en: 'Audit', es: 'Auditoría' },
  other: { en: 'Document', es: 'Documento' },
};

/** Only populated for jurisdictions with a specific, verified agendas/minutes portal — never guess one. */
export const AGENDA_PORTAL_URLS: Partial<Record<JurisdictionSlug, string>> = {
  gatesville: 'https://public.destinyhosted.com/agenda_publish.cfm?id=26773',
  'copperas-cove': 'https://public.destinyhosted.com/agenda_publish.cfm?id=26773',
};

const MAX_RESULTS = 8;

function fieldScore(q: string, values: string[]): number {
  let best = 0;
  for (const raw of values) {
    const v = normalize(raw);
    if (!v) continue;
    if (q === v) best = Math.max(best, 3000 + v.length);
    else if (v.includes(q)) best = Math.max(best, 2000 + q.length);
    else if (q.includes(v) && v.length >= 4) best = Math.max(best, 500 + v.length);
  }
  return best;
}

function scoreRecord(q: string, record: OfficialRecord, lang: 'en' | 'es'): number {
  const title = normalize(record.title);
  const keywords = lang === 'en' ? record.keywordsEn : record.keywordsEs;
  const description = normalize(lang === 'en' ? record.descriptionEn : record.descriptionEs);

  if (q === title) return 5000 + title.length;
  if (title.includes(q)) return 4000 + q.length;

  const keywordScore = fieldScore(q, keywords);
  if (keywordScore > 0) return 3000 + keywordScore;

  if (description.includes(q)) return 1000 + q.length;

  return 0;
}

export function searchDocuments(jurisdiction: JurisdictionSlug, query: string, lang: 'en' | 'es'): OfficialRecord[] {
  const q = normalize(query);
  if (!q) return [];
  const records = INDEXES[jurisdiction].records;
  return records
    .map(record => ({ record, score: scoreRecord(q, record, lang) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.record.date < b.record.date ? 1 : -1))
    .slice(0, MAX_RESULTS)
    .map(x => x.record);
}
