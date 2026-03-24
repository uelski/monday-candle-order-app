import { Storage } from "@mondaycom/apps-sdk";

const token = process.env.MONDAY_API_TOKEN;
if (!token) {
  throw new Error("MONDAY_API_TOKEN environment variable is not set");
}

// Singleton — monday-code reuses the same process between requests.
export const storage = new Storage(token);
