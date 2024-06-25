#!/usr/bin/env -S node --loader ts-node/esm/transpile-only --no-warnings=ExperimentalWarning

import { execute } from "@oclif/core"

await execute({ dir: import.meta.url, development: true })
