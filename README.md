# MCP Server for Confluence

This Model Context Protocol (MCP) server provides tools to interact with the Confluence API, allowing AI assistants to perform CRUD operations on Confluence pages, spaces, and more.
clone the repo
git clone "repo-address"
npm install
2. Create a `.env` file with your Confluence credentials:

CONFLUENCE_BASE_URL=your-confluence-url
CONFLUENCE_API_TOKEN=your-api-token
num run build
npm start

# copilot vscode setup

add the below config in user settings (JSON) 
"mcp": {
    "servers": {

  "confluence": {
    "type": "stdio",
    "command": "wsl",
    "args": [
        "-e",
        "/home/amsingh2/workspace/mcp-server-confluence/start-mcp-server.sh"
    ]
}
    },
    
  
},


then in copilot use the agent mode and start exploring about your confluence spaces

All CRUD operation available