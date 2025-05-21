// src/tools/index.ts
import { registerPageTools } from "./pages.js";
import { registerSpaceTools } from "./spaces.js";
import { registerSearchTools } from "./search.js";
import { ConfluenceClient } from "../api.js";

export function registerAllTools(server: any, client: ConfluenceClient) {
  registerPageTools(server, client);
  registerSpaceTools(server, client);
  registerSearchTools(server, client);
}
