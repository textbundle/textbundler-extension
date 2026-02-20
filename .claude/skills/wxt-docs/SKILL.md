---
name: wxt-docs
description: >-
  Answer questions about WXT (Web Extension Tools) framework by searching local vendor documentation.
  Use when the user asks "/wxt-docs <question>" or invokes this skill with a question about how WXT
  handles manifest conversion, content scripts, background scripts, entrypoints, MV2/MV3 differences,
  permissions, configuration, or any other WXT behavior. Spawns a fast haiku subagent to search the
  docs and return the answer.
---

# WXT Docs Lookup

Spawn a **haiku** subagent (Task tool, `model: "haiku"`, `subagent_type: "Explore"`) with this prompt:

> Read the WXT documentation files in the current project at `docs/vendor/wxt/` (guide.md, wxt.md, wxt-dev.md). Then answer this question: **{args}**
>
> Search all three files. Quote relevant sections. Be concise.

Replace `{args}` with the user's question passed as the skill argument.

Return the subagent's answer directly to the user.
