---
description: Auto-approve all command executions and file changes
---

// turbo-all

This workflow enables auto-approval for all actions. When this workflow is active, all command executions and file changes will be automatically approved without requiring manual confirmation.

## Usage
Simply reference this workflow or have it active in your workspace. The `// turbo-all` annotation above ensures all tool calls are auto-approved.

## Steps (for reference)
The following command types will auto-execute:
1. Terminal commands
2. File creations
3. File modifications
4. Any other tool calls
