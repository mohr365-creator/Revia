# ⛔ DO NOT MERGE THIS BRANCH

**Branch:** `claude/freighter-variant-image-R1ZdJ`
**Status:** Superseded — kept for reference only.

## Why

The freighter work on this branch has **already shipped to `main`** (commit
`642b28f`), but implemented differently. `main` is the source of truth. This
branch is an earlier, divergent take and **must not be merged**.

## What shipped to `main` instead

The freighter goal — the **R-100F** variant using the supplied concept render —
is live on `main`, built to match `main`'s structure:

- The freighter lives in the **Mission variants** section of
  `/aircraft/regional` (not on a standalone page).
- Images use `main`'s `image: string` + `imageAlt` convention with a plain
  `<img>` tag.

## Why merging would regress `main`

This branch differs from `main` in ways that would *undo* deliberate decisions:

| | This branch | `main` (keep) |
|---|---|---|
| Freighter location | standalone `/aircraft/freighter` page | Mission-variants section on `/aircraft/regional` |
| Image schema | `next/image` + `AircraftImage` object | plain `<img>` + `image`/`imageAlt` string |
| Narrowbody family | still present | removed (moved to `feature/phase-ii-narrowbody`) |

Merging would re-introduce the removed narrowbody family, add a duplicate
freighter page, and conflict on the image schema.

## If you're picking this up

Read it for reference, then take whatever you need over to `main` (or
`feature/phase-ii-narrowbody` for the narrowbody work). Do not fast-forward or
merge this branch into `main`.
