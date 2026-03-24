export interface Fragrance {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  image_url: string;
}

// Fields accepted from the client on create/update (id and timestamps are server-generated)
export type FragranceInput = Omit<Fragrance, "id" | "created_at" | "updated_at">;
