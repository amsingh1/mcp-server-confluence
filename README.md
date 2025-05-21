# MCP Server for Confluence

A Model Context Protocol (MCP) server that provides AI assistants with tools to interact with the Confluence API, enabling CRUD operations on Confluence pages, spaces, and more.

## 🚀 Features

- Complete CRUD operations for Confluence resources
- Seamless integration with GitHub Copilot
- Simple setup process
- Support for WSL environments

## 📋 Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn
- A Confluence instance with API access
- API token with appropriate permissions

## 🔧 Installation

1. Clone the repository:
```bash
git clone [repo-address]
cd mcp-server-confluence
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root with your Confluence credentials:
```
CONFLUENCE_BASE_URL=your-confluence-url
CONFLUENCE_API_TOKEN=your-api-token
```

## 🏃‍♂️ Usage

1. Build the project:
```bash
npm run build
```

2. Start the MCP server:
```bash
npm start
```

## 🤖 GitHub Copilot Integration

### VS Code Setup

Add the following configuration to your VS Code `settings.json`:

```json
"mcp": {
  "servers": {
    "confluence": {
      "type": "stdio",
      "command": "wsl",
      "args": [
        "-e",
        "/home/[your-username]/workspace/mcp-server-confluence/start-mcp-server.sh"
      ]
    }
  }
}
```

> **Note:** Replace `[your-username]` with your actual username.

### Using with Copilot

1. Enable agent mode in Copilot
2. Start exploring your Confluence spaces
3. Use natural language to request operations on your Confluence resources

## 🛠️ Available Operations

The MCP server supports the following operations:

- **Pages**: Create, read, update, delete Confluence pages
- **Spaces**: List, view, and manage spaces
- **Content**: Query and manipulate Confluence content
- **Attachments**: Upload and manage attachments
- **Comments**: Add and manage comments


## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
