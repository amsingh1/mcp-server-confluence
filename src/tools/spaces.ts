// src/tools/spaces.ts
import { z } from "zod";
import { ConfluenceClient } from "../api.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSpaceTools(server: McpServer, client: ConfluenceClient) {
  // Get Space
  server.tool(
    "getSpace",
    "Retrieve a Confluence space by ID",
    {
      spaceId: z.string().describe("The ID of the space to retrieve")
    },
    async ({ spaceId }: { spaceId: string }) => {
      try {
        const space = await client.getSpace(spaceId);
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(space, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error retrieving space: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Get Spaces
  server.tool(
    "getSpaces",
    "List all Confluence spaces",
    {
      limit: z.number().optional().default(25).describe("Maximum number of results"),
      start: z.number().optional().default(0).describe("Index of the first item to return")
    },
    async ({ limit, start }: { limit: number; start: number }) => {
      try {
        const spaces = await client.getSpaces(limit, start);
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(spaces, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error retrieving spaces: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
}