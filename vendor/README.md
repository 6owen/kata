# Vendor Sources

This directory tracks third-party skills as git submodules.

- `vendor/impeccable`: external companion skill source used by `kata-design`

Vendored repositories remain upstream-owned. Kata only defines integration, routing, and local workflow constraints around them.

## Default State

Submodules in `vendor/` are recorded as references by default. They may appear as empty directories in the working tree because the upstream repository is not automatically checked out.

This matches the intended workflow for Kata:

- keep the upstream dependency visible
- avoid polluting the local workspace with third-party source code unless needed
- only initialize a vendor repository when you actually want to inspect or update it

## View Vendor Source Code

If you want to inspect the code for a vendored repository, initialize it explicitly:

```bash
git submodule update --init vendor/impeccable
```

If you want to initialize every vendored repository:

```bash
git submodule update --init --recursive
```

## Return To Reference-Only State

If you no longer want the vendored source checked out locally, deinitialize it and return to the reference-only state:

```bash
git submodule deinit -f vendor/impeccable
```
