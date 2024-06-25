export interface BaseEntity {
  id: string
  key: string
  name: string
  archived?: boolean
  status?: string
  feature_id?: string
  feature_key?: string
  page_ids?: unknown[]
  metrics: Array<{
    event_id?: string
    event_key?: string
  }>
  environments: Record<
    string,
    {
      environment_id: unknown
      environment_name: unknown
      percentage_included: unknown
    }
  >
  variations: Array<{
    key: string
    variation_id?: unknown
    archived?: unknown
    actions?: unknown
  }>
  variables: Array<{
    key: string
    id?: unknown
    archived?: unknown
  }>
}

export interface Delta {
  toCreate?: BaseEntity[]
  toUpdate?: BaseEntity[]
  toDelete?: BaseEntity[]
}
