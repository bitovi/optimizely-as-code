import { Config as OptimizelyConfig } from "@optimizely/optimizely-sdk"
import {
  createInstance as createOptimizelyInstance,
  OptimizelyProvider,
  useDecision as useOptimizelyDecision,
} from "@optimizely/react-sdk"

interface OACProviderProps
  extends React.ComponentProps<typeof OptimizelyProvider> {}

interface OACConfig extends OptimizelyConfig {}

export const OACProvider: React.FC<OACProviderProps> = (props) => {
  return <OptimizelyProvider {...props} />
}

export function createInstance(
  config: OACConfig,
): ReturnType<typeof createOptimizelyInstance> {
  return createOptimizelyInstance(config)
}

export function useDecision(
  featureKey: string,
): ReturnType<typeof useOptimizelyDecision> {
  return useOptimizelyDecision(featureKey)
}
