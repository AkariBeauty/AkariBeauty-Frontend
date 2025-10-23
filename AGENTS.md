# AGENTS.md

## Permissions
- branches: ["main", "dev", "feature/*"]
- can_commit: true
- can_push: true
- can_open_pr: true

## Workflow
1. Create or switch to the requested branch.
2. Apply code changes based on the user's prompt.
3. Commit with the prompt as the commit message.
4. Push and open a pull request to the main branch.

## Notes
The agent should always confirm the target branch before pushing changes.
