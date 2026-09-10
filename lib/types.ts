export type SourceRef = {
  title: string;
  url: string;
  retrieved: string;
  checksum?: string;
  archivedUrl?: string;
};

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
