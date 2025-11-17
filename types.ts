
export interface Lead {
  GeneratedDate: string;
  SearchCity: string;
  SearchCountry: string;
  LeadNumber: number;
  CompanyName: string;
  Category: string;
  Description: string | null;
  Address: string | null;
  City: string | null;
  Country: string | null;
  Coordinates: { lat: number; lng: number } | null;
  Phone: string | null;
  Email: string | null;
  Website: string | null;
  LinkedIn: string | null;
  Facebook: string | null;
  Instagram: string | null;
  Rating: number | null;
  ReviewCount: number | null;
  BusinessHours: Record<string, string> | null;
  QualityScore: number;
  QualityReasoning: string;
  Status: string;
  Contacted: boolean;
  Notes: string;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}
