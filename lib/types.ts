export type SourceRef = {
  title: string;
  url: string;
  retrieved: string;
  checksum?: string;
  archivedUrl?: string;
};

/** @deprecated Unused. Its jurisdiction enum is wrong (missing 'coryell-county', includes non-jurisdiction 'texas') and it predates the bilingual OfficialRecord schema. Use OfficialRecord instead. */
export type CivicDocument = {
  title: string;
  city: 'copperas-cove' | 'gatesville' | 'texas';
  documentType: string;
  date: string;
  originalUrl: string;
  dateRetrieved: string;
  checksum?: string;
  archivedCopy?: string;
  officialSource: string;
};

export type JurisdictionSlug = 'copperas-cove' | 'gatesville' | 'coryell-county';

export type OfficialRecord = {
  id: string;
  jurisdiction: JurisdictionSlug;
  title: string;
  documentType: 'ordinance' | 'resolution' | 'agenda' | 'minutes' | 'budget' | 'contract' | 'audit' | 'other';
  date: string;
  meetingDate?: string;
  descriptionEn: string;
  descriptionEs: string;
  keywordsEn: string[];
  keywordsEs: string[];
  officialUrl: string;
  sourcePage: string;
  retrievedAt: string;
};

export type DocumentSearchIndex = {
  schemaVersion: 1;
  jurisdiction: JurisdictionSlug;
  lastVerified: string | null;
  notice: string;
  records: OfficialRecord[];
};

export type Official = {
  name: string;
  role: string;
  classification: 'ELECTED' | 'APPOINTED/STAFF';
  placeOrWard?: string;
  term?: string;
  phone?: string;
  email?: string;
  source: SourceRef;
};
