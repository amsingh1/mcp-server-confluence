// src/tools/pages.ts
import { z } from "zod";
import { ConfluenceClient } from "../api.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPageTools(server: McpServer, client: ConfluenceClient) {
  // Get Page
  server.tool(
    "getPage",
    "Retrieve a Confluence page by ID",
    { 
      pageId: z.string().describe("The ID of the page to retrieve")
    },
    async ({ pageId }: { pageId: string }) => {
      try {
        const page = await client.getPage(pageId);
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(page, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error retrieving page: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Get Pages in Space
  server.tool(
    "getPages",
    "List pages in a Confluence space",
    { 
      spaceId: z.string().describe("The ID of the space"),
      limit: z.number().optional().default(25).describe("Maximum number of results"),
      start: z.number().optional().default(0).describe("Index of the first item to return")
    },
    async ({ spaceId, limit, start }: { spaceId: string; limit: number; start: number }) => {
      try {
        const pages = await client.getPages(spaceId, limit, start);
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(pages, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error retrieving pages: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Create Page
  server.tool(
    "createPage",
    "Create a new Confluence page",
    {
      spaceId: z.string().describe("The ID of the space where the page will be created"),
      title: z.string().describe("The title of the page"),
      parentId: z.string().optional().describe("The ID of the parent page (optional)"),
      content: z.string().describe("The body content of the page in storage format")
    },
    async ({ spaceId, title, parentId, content }: { 
      spaceId: string; 
      title: string; 
      parentId?: string; 
      content: string 
    }) => {
      try {
        const pageData: any = {
          type: "page",
          space: { key: spaceId },
          status: "current",
          title,
          body: {
            storage: {
              value: content,
              representation: "storage"
            }
          }
        };

        if (parentId) {
          pageData.ancestors = [{ id: parentId }];
        }

        const result = await client.createPage(pageData);
        return {
          content: [{ 
            type: "text", 
            text: `Page created successfully with ID: ${result.id}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error creating page: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Update Page
  server.tool(
    "updatePage",
    "Update an existing Confluence page",
    {
      pageId: z.string().describe("The ID of the page to update"),
      title: z.string().optional().describe("The new title of the page (optional)"),
      content: z.string().optional().describe("The new body content of the page in storage format (optional)"),
      version: z.number().describe("The current version number of the page")
    },
    async ({ pageId, title, content, version }: { 
      pageId: string; 
      title?: string; 
      content?: string; 
      version: number 
    }) => {
      try {
        // First get the current page to preserve fields we're not updating
        const currentPage = await client.getPage(pageId);
        
        const updateData: any = {
          id: pageId,
          status: "current",
          title: title || currentPage.title,
          version: {
            number: version + 1
          }
        };

        if (content) {
          updateData.body = {
            representation: "storage",
            value: content
          };
        }

        const result = await client.updatePage(pageId, updateData);
        return {
          content: [{ 
            type: "text", 
            text: `Page updated successfully. New version: ${result.version.number}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error updating page: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );

  // Delete Page
  server.tool(
    "deletePage",
    "Delete a Confluence page",
    {
      pageId: z.string().describe("The ID of the page to delete")
    },
    async ({ pageId }: { pageId: string }) => {
      try {
        await client.deletePage(pageId);
        return {
          content: [{ 
            type: "text", 
            text: `Page with ID ${pageId} was successfully deleted`
          }]
        };
      } catch (error: any) {
        return {
          content: [{ 
            type: "text", 
            text: `Error deleting page: ${error.message}`
          }],
          isError: true
        };
      }
    }
  );
  // Confluence Format Helper
server.tool(
  "confluenceFormatHelp",
  "Get examples and information about Confluence storage format",
  {
    formatType: z.enum(["basic", "macros", "tables", "code", "full"]).describe("The type of formatting examples to provide")
  },
  async ({ formatType }: { formatType: "basic" | "macros" | "tables" | "code" | "full" }) => {
    const examples: Record<string, string> = {
      basic: `
# Basic HTML formatting in Confluence

## Headings
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>

## Paragraphs and text formatting
<p>Regular paragraph text</p>
<p><strong>Bold text</strong></p>
<p><em>Italic text</em></p>
<p><u>Underlined text</u></p>

## Lists
<ul>
  <li>Unordered list item 1</li>
  <li>Unordered list item 2</li>
</ul>

<ol>
  <li>Ordered list item 1</li>
  <li>Ordered list item 2</li>
</ol>

## Links
<a href="https://www.example.com">External link</a>
<a href="/wiki/spaces/SPACEKEY/pages/123456">Internal link to page</a>
      `,
      
      macros: `
# Common Confluence Macros

## Info Panel
<ac:structured-macro ac:name="info">
  <ac:parameter ac:name="title">Note</ac:parameter>
  <ac:rich-text-body>
    <p>This is an information panel</p>
  </ac:rich-text-body>
</ac:structured-macro>

## Warning Panel
<ac:structured-macro ac:name="warning">
  <ac:parameter ac:name="title">Warning</ac:parameter>
  <ac:rich-text-body>
    <p>This is a warning panel</p>
  </ac:rich-text-body>
</ac:structured-macro>

## Code Block
<ac:structured-macro ac:name="code">
  <ac:parameter ac:name="language">javascript</ac:parameter>
  <ac:plain-text-body><![CDATA[
function helloWorld() {
  console.log("Hello World!");
}
  ]]></ac:plain-text-body>
</ac:structured-macro>

## Table of Contents
<ac:structured-macro ac:name="toc">
  <ac:parameter ac:name="printable">true</ac:parameter>
  <ac:parameter ac:name="style">disc</ac:parameter>
  <ac:parameter ac:name="maxLevel">3</ac:parameter>
  <ac:parameter ac:name="minLevel">1</ac:parameter>
</ac:structured-macro>
      `,
      
      tables: `
# Tables in Confluence

<table>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
  <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
  </tr>
  <tr>
    <td>Cell 3</td>
    <td>Cell 4</td>
  </tr>
</table>

## Table with formatting
<table>
  <tr>
    <th style="background-color: #f4f5f7">Command</th>
    <th style="background-color: #f4f5f7">Description</th>
  </tr>
  <tr>
    <td><code>git status</code></td>
    <td>Check repository status</td>
  </tr>
</table>
      `,
      
      code: `
# Code examples in Confluence

## Inline code
<p>Use <code>git status</code> to check the status</p>

## Code block with syntax highlighting
<ac:structured-macro ac:name="code">
  <ac:parameter ac:name="language">javascript</ac:parameter>
  <ac:plain-text-body><![CDATA[
function calculateSum(a, b) {
  return a + b;
}

// Call the function
const result = calculateSum(5, 3);
console.log(result); // Outputs: 8
  ]]></ac:plain-text-body>
</ac:structured-macro>

## Code block for bash/shell
<ac:structured-macro ac:name="code">
  <ac:parameter ac:name="language">bash</ac:parameter>
  <ac:plain-text-body><![CDATA[
#!/bin/bash
echo "Hello World!"
  ]]></ac:plain-text-body>
</ac:structured-macro>
      `
    };
    
    // Return the requested example or all examples
    if (formatType === "full") {
      return {
        content: [{
          type: "text",
          text: `# Confluence Storage Format Examples\n\n${Object.values(examples).join("\n\n")}`
        }]
      };
    } else {
      return {
        content: [{
          type: "text",
          text: examples[formatType] || "Example type not found."
        }]
      };
    }
  }
);
}

