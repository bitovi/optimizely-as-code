import {
  createInstance,
  OACProvider,
  useDecision,
} from "optimizely-as-code/react"

const userId = Math.floor(Math.random() * (10000 - 1000) + 1000).toString()

const optimizelyClient = createInstance({
  sdkKey: import.meta.env.VITE_OPTIMIZELY_SDK_KEY,
})

const App: React.FC = () => {
  return (
    <OACProvider optimizely={optimizelyClient} user={{ id: userId }}>
      <Child />
    </OACProvider>
  )
}

export default App

export const Child: React.FC = () => {
  const [foobar] = useDecision("foobar")

  return (
    <div>
      <p>hello {foobar.enabled ? "foo" : "bar"}</p>
    </div>
  )
}
