#!/bin/bash
# Load nvm environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Manually set Confluence credentials
export CONFLUENCE_BASE_URL="https://confluence.dhl.com/"  # Replace with your actual Confluence URL
export CONFLUENCE_TOKEN=""  # Replace with your actual Confluence API token

cd /home/amsingh2/workspace/mcp-server-confluence
/home/amsingh2/.nvm/versions/node/v22.13.1/bin/node build/index.js
