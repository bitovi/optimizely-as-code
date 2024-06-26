optimizely-as-code
==================

`optimizely-as-code` avoids missmatches between Optimizely configuration and your deployed React code. It works by:

1. Having your React code define the features it supports.
2. Providing a script that can update Optimizely to match that definition. You configure the script to run on deployment.

<!-- toc -->
* [Configuring your project](#configuring-your-project)
* [Usage in React](#usage-in-react)
* [CLI Commands](#cli-commands)
<!-- tocstop -->

# Configuring your project

```shell
npm install optimizely-as-code
```

Add to `package.json`
```json
{
  "scripts": {
    "optimizely-as-code": "optimizely-as-code sync",
  },
}
```

Create `optimizely-as-code/features.json`.

Create `optimizely-as-code/events.json`.

Create `optimizely-as-code/experiments.json`.

# Usage in React

```jsx
import { createInstance, OACProvider, useDecision } from "optimizely-as-code/react"

const optimizelyClient = createInstance({
  sdkKey: "<your-optimizely-sdk-key>",
})

const App: React.FC = () => {
  return (
    <OACProvider optimizely={optimizelyClient} user={{ id: "<unique-user-id>" }}>
      <Child />
    </OACProvider>
  )
}

const Child: React.FC = () => {
  const [foobar] = useDecision("foobar")

  return (
    <div>
      <p>hello {foobar.enabled ? "foo" : "bar"}</p>
    </div>
  )
}
```

# CLI Commands

<!-- commands -->
* [`optimizely-as-code sync`](#optimizely-as-code-sync)

## `optimizely-as-code sync`

Push local features to Optimizely.

```
USAGE
  $ optimizely-as-code sync --accessToken <value> --projectId <value> [--dry-run]

FLAGS
  --accessToken=<value>  (required) Your Optimizely access token. Can also be provided via the environment variable
                         OPTIMIZELY_ACCESS_TOKEN.
  --dry-run              Output what changes would be made without actually making the changes.
  --projectId=<value>    (required) Your Optimizely Project Id. Can also be provided via the environment variable
                         OPTIMIZELY_PROJECT_ID.
```
<!-- commandsstop -->
