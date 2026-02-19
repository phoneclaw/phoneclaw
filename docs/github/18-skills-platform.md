# Issue #18: [Feature] Skills platform — modular capability packages

**Labels:** `feature`, `priority: high`, `area: agent`, `tier-2`
**Status:** ⭕ Pending

**Depends on:** #8

## Description
Skills are modular instruction packages (Markdown + optional scripts) that teach the agent new capabilities without code changes.

## Implementation Details
- Define skill format: `skills/<name>/SKILL.md` with YAML frontmatter (name, description, tools)
- Create `src/agent/SkillLoader.ts` to parse and inject skills into system prompts
- Built-in skills: 'WhatsApp Message Sender', 'App Installer', 'Settings Changer'
- Add skill management UI (enable/disable/create)
- Optional: skill marketplace/sharing

## Acceptance Criteria
- [ ] Skills can be created as Markdown files
- [ ] Skills modify agent behavior when enabled
- [ ] Built-in skills work out of the box
- [ ] Users can create custom skills

## Inspired by
OpenClaw's skills platform with bundled, managed, and workspace skills + ClawHub registry.
