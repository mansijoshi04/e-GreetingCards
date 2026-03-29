export interface StaticTemplate {
  id: string;          // slug e.g. 'balloon-party'
  name: string;
  category: string;
  tier: string;
  priceCents: number;
  thumbnailUrl: string;
  designConfig: string; // JSON string
  isActive: boolean;
  createdAt: Date;      // static date, for interface compatibility
}
