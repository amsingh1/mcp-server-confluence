#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ConfluenceClient } from "./api.js";
import { registerAllTools } from "./tools/index.js";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get Confluence credentials from environment variables
const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL || '';
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN || '';

if (!CONFLUENCE_BASE_URL || !CONFLUENCE_API_TOKEN) {
  console.error('Error: CONFLUENCE_BASE_URL and CONFLUENCE_API_TOKEN must be set in .env file');
  process.exit(1);
}

// Main server function
async function main() {
  // Initialize the server
  const server = new McpServer({
    name: "Confluence MCP Server",
    version: "0.1.0"
  });

  try {
    // Create the Confluence client with environment variables
    const confluenceClient = new ConfluenceClient({
      baseUrl: CONFLUENCE_BASE_URL,
      token: CONFLUENCE_API_TOKEN
    });
    
    // Test the connection to ensure it's working
    await confluenceClient.getSpaces(1, 0);
    console.error("Successfully connected to Confluence API!");
    
    // Register all tools with the working connection
    registerAllTools(server, confluenceClient);
    
    // Start the server with stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error("Confluence MCP Server running...");
  } catch (error: any) {
    console.error(`Failed to connect to Confluence API: ${error.message}`);
    process.exit(1);
  }
}

// Run the server
main().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});