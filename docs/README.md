# Reactor documentation

The documentation site combines a curated Reactor manual with generated package API reference.

From the repository root:

```bash
pnpm build:ts
pnpm --dir docs start
```

Build the static site with:

```bash
pnpm --dir docs build
```

Conceptual documentation lives in `docs/docs`. Generated API pages are produced from package declarations and should not be edited directly.

## Writing principles

The manual has one main page for each concept.

- Define a concept once. Other pages should explain only how they use it and link to the main guide.
- Use `demo/module-todos` for domain examples and `demo/module-playground` for interaction examples.
- Keep product-specific policy in product documentation or an explicitly labeled case study.
- Link to a small number of useful related guides instead of repeating their content.
- Use generated API pages for exact signatures, not as the first explanation of a subsystem.
- Prefer concrete nouns and verbs. Words such as “stable,” “semantic,” “canonical,” “context,” and “capability” need a specific explanation or should be replaced.
- Write headings around the developer's task. Trim sentences that only repeat the heading or praise the framework.

### Callouts

Use Docusaurus admonitions consistently:

- `Mental model` explains the abstraction a reader should retain.
- `Pro tip` captures a proven implementation technique.
- `Common pitfall` identifies an attractive but harmful approach.
- `Hidden complexity` explains useful behavior Reactor performs automatically.
- `Lifecycle note` calls out ordering, readiness, cancellation, or disposal.
- `Compatibility` is reserved for version-sensitive behavior and migrations.

Callouts should add information. Do not wrap ordinary prose only to make a page look more decorated.

### Main page for each concept

| Concept | Main guide |
| --- | --- |
| Boot order | `subsystems/application-model.md` |
| Modules and store ownership | `subsystems/modules-and-stores.md` |
| Action lifecycle and validation states | `subsystems/actions-and-validation.md` |
| Entity capabilities | `subsystems/entity-definitions.md` |
| Search and parameter resolution | `subsystems/search-selection-and-command-palette.md` |
| Controls | `subsystems/controls.md` |
| Form values and validation | `subsystems/forms.md` |
| Workspace state, placement, and persistence | `subsystems/workspaces-and-panels.md` |
| Settings and persisted stores | `subsystems/settings-and-persistence.md` |
| Layered interaction | `runtime/interaction-layers.md` |
| Progress, status, and notifications | `runtime/operational-feedback.md` |
| Responsive runtime behavior | `runtime/responsive-applications.md` |
