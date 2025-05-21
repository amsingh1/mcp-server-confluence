// src/tools/search.ts
import { z } from "zod";
import { ConfluenceClient } from "../api.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSearchTools(server: McpServer, client: ConfluenceClient) {
  // Search Confluence
  server.tool(
    "search",
    "Search Confluence content using CQL",
    { 
      cql: z.string().describe("Confluence Query Language (CQL) query string"),
      limit: z.number().optional().default(25).describe("Maximum number of results"),
      start: z.number().optional().default(0).describe("Index of the first item to return")
    },
    async ({ cql, limit, start }: { cql: string; limit: number; start: number }) => {
      try {
        const results = await client.search(cql, limit, start);
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(results, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error performing search: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
}