import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { Fragrance, FragranceInput } from "../types/fragrance";
import { addDropdownLabel, renameDropdownLabel, deactivateDropdownLabel } from "../helpers/fragrances";

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
  const { boardId, ...fragranceData } = req.body as FragranceInput & { boardId?: string };

  if (!fragranceData.name || !fragranceData.category) {
    res.status(400).json({ error: "name and category are required" });
    return;
  }

  const now = new Date().toISOString();
  const fragrance: Fragrance = {
    id: crypto.randomUUID(),
    name: fragranceData.name,
    description: fragranceData.description ?? "",
    category: fragranceData.category,
    image_url: fragranceData.image_url ?? "",
    created_at: now,
    updated_at: now,
  };

  const fragrances = await readFragrances();
  fragrances.push(fragrance);
  await writeFragrances(fragrances);

  // update board dropdown column
  if (boardId) {
    try {
      await addDropdownLabel(boardId, fragrance.name);
    } catch (err) {
      console.error("Failed to add dropdown label:", err);
    }
  }

  res.status(201).json(fragrance);
});

// PUT /api/fragrances/:id
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { boardId, ...fragranceData } = req.body as FragranceInput & { boardId?: string };

  const fragrances = await readFragrances();
  const index = fragrances.findIndex((f) => f.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Fragrance not found" });
    return;
  }

  const oldName = fragrances[index].name;

  fragrances[index] = {
    ...fragrances[index],
    ...fragranceData,
    id,
    created_at: fragrances[index].created_at,
    updated_at: new Date().toISOString(),
  };

  await writeFragrances(fragrances);

  // update board dropdown column
  if (boardId && oldName !== fragranceData.name) {
    try {
      await renameDropdownLabel(boardId, oldName, fragranceData.name);
    } catch (err) {
      console.error("Failed to rename dropdown label:", err);
    }
  }

  res.json(fragrances[index]);
});

// DELETE /api/fragrances/:id
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { boardId } = req.body;
  const fragrances = await readFragrances();
  const index = fragrances.findIndex((f) => f.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Fragrance not found" });
    return;
  }

  // update board dropdown column
  const deactivatedName = fragrances[index].name;

  const [deleted] = fragrances.splice(index, 1);
  await writeFragrances(fragrances);

  if (boardId) {
    try {
      await deactivateDropdownLabel(boardId, deactivatedName);
    } catch (err) {
      console.error("Failed to deactivate dropdown label:", err);
    }
  }
  res.json(deleted);
});

export default router;
