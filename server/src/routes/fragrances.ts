import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { Fragrance, FragranceInput } from "../types/fragrance";

const router = Router();
const STORAGE_KEY = "fragrances";

async function readFragrances(): Promise<Fragrance[]> {
  const result = await storage.get<{ value: string }>(STORAGE_KEY);
  const value = "value" in result ? result.value : null;
  return value ? (JSON.parse(value) as Fragrance[]) : [];
}

async function writeFragrances(fragrances: Fragrance[]): Promise<void> {
  await storage.set(STORAGE_KEY, JSON.stringify(fragrances));
}

// GET /api/fragrances
router.get("/", async (_req: Request, res: Response) => {
  const fragrances = await readFragrances();
  res.json(fragrances);
});

// POST /api/fragrances
router.post("/", async (req: Request, res: Response) => {
  const body = req.body as FragranceInput;

  if (!body.name || !body.category) {
    res.status(400).json({ error: "name and category are required" });
    return;
  }

  const now = new Date().toISOString();
  const fragrance: Fragrance = {
    id: crypto.randomUUID(),
    name: body.name,
    description: body.description ?? "",
    category: body.category,
    image_url: body.image_url ?? "",
    created_at: now,
    updated_at: now,
  };

  const fragrances = await readFragrances();
  fragrances.push(fragrance);
  await writeFragrances(fragrances);

  res.status(201).json(fragrance);
});

// PUT /api/fragrances/:id
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body as Partial<FragranceInput>;

  const fragrances = await readFragrances();
  const index = fragrances.findIndex((f) => f.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Fragrance not found" });
    return;
  }

  fragrances[index] = {
    ...fragrances[index],
    ...body,
    id,
    created_at: fragrances[index].created_at,
    updated_at: new Date().toISOString(),
  };

  await writeFragrances(fragrances);
  res.json(fragrances[index]);
});

// DELETE /api/fragrances/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const fragrances = await readFragrances();
  const index = fragrances.findIndex((f) => f.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Fragrance not found" });
    return;
  }

  const [deleted] = fragrances.splice(index, 1);
  await writeFragrances(fragrances);
  res.json(deleted);
});

export default router;
