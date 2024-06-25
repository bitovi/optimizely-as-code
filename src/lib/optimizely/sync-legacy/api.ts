import fetch from "cross-fetch"

import { BaseEntity } from "./interfaces.js"

const OPTIMIZELY_URL = "https://api.optimizely.com/v2"

export async function getEntities(
  accessToken: string,
  projectId: string,
  entityName: string,
): Promise<BaseEntity[]> {
  const url = `${OPTIMIZELY_URL}/${entityName}?project_id=${projectId}`

  const entities = await doRequest(accessToken, "GET", url)

  return entities
}

export async function createEntities<Entity extends BaseEntity>(
  accessToken: string,
  projectId: string,
  entityName: string,
  entities: Entity[],
): Promise<void> {
  let url = `${OPTIMIZELY_URL}/${entityName}`
  if (entityName === "events") {
    url = `${OPTIMIZELY_URL}/projects/${projectId}/custom_events`
  }

  for (const entity of entities) {
    await doRequest(accessToken, "POST", url, JSON.stringify(entity))
  }
}

export async function updateEntities<Entity extends BaseEntity>(
  accessToken: string,
  projectId: string,
  entityName: string,
  entities: Entity[],
): Promise<void> {
  let url = `${OPTIMIZELY_URL}/${entityName}`
  if (entityName === "events") {
    url = `${OPTIMIZELY_URL}/projects/${projectId}/custom_events`
  }

  for (const entity of entities) {
    await doRequest(
      accessToken,
      "PATCH",
      `${url}/${entity.id}`,
      JSON.stringify(entity),
    )
  }
}

export async function deleteEntities<Entity extends { id: string }>(
  accessToken: string,
  projectId: string,
  entityName: string,
  entities: Entity[],
): Promise<void> {
  let url = `${OPTIMIZELY_URL}/${entityName}`
  if (entityName === "events") {
    url = `${OPTIMIZELY_URL}/projects/${projectId}/custom_events`
  }

  for (const entity of entities) {
    await doRequest(accessToken, "DELETE", `${url}/${entity.id}`)
  }
}

async function doRequest(
  accessToken: string,
  method: string,
  url: string,
  body?: string,
) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body,
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(`Status ${data.code}: ${data.message}`)
  }

  const data = await response.json()

  return data
}
