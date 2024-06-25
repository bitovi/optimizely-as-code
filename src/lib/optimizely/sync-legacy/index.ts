import fs from "fs"
import path from "path"

import * as api from "./api.js"
import * as delta from "./delta.js"
import { BaseEntity, Delta } from "./interfaces.js"

export * from "./interfaces.js"

const entityTypes = ["features", "events", "experiments"] as const // order matters!
export type EntityType = (typeof entityTypes)[number]

async function sync(
  accessToken: string,
  projectId: string,
  projectPath: string,
  dryRun: boolean = false,
): Promise<Partial<Record<EntityType, Delta>>> {
  const output: Partial<Record<EntityType, Delta>> = {}

  for (const entityType of entityTypes) {
    const entities = await getEntities(
      accessToken,
      projectId,
      entityType,
      projectPath,
    )
    const existingEntities = await getExistingEntities(
      accessToken,
      projectId,
      entityType,
    )

    const toCreate = delta.getEntitiesToCreate(entities, existingEntities)
    const toUpdate = delta.getEntitiesToUpdate(entities, existingEntities)
    const toDelete = delta.getEntitiesToDelete(entities, existingEntities)

    if (toCreate.length > 0 || toUpdate.length > 0 || toDelete.length > 0) {
      const delta: Delta = {}
      output[entityType] = delta

      if (toCreate.length > 0) delta.toCreate = toCreate
      if (toUpdate.length > 0) delta.toUpdate = toUpdate
      if (toDelete.length > 0) delta.toDelete = toDelete
    }

    if (!dryRun) {
      await api.createEntities(accessToken, projectId, entityType, toCreate)
      await api.updateEntities(accessToken, projectId, entityType, toUpdate)
      await api.deleteEntities(accessToken, projectId, entityType, toDelete)
    }
  }

  return output
}

export default sync

async function getEntities(
  accessToken: string,
  projectId: string,
  entityType: string,
  projectPath: string,
) {
  const entities = getFileAsJson(
    path.join(projectPath, "optimizely-as-code", `${entityType}.json`),
  )

  // find and add matching feature and event ids to experiments
  if (entityType === "experiments") {
    const existingFeatures = await api.getEntities(
      accessToken,
      projectId,
      "features",
    )
    const featureIdsByKey = getIdsByKey(existingFeatures)
    addFeatureIdToExperiments(entities, featureIdsByKey)

    const existingEvents = await api.getEntities(
      accessToken,
      projectId,
      "events",
    )
    const eventIdsByName = getIdsByName(existingEvents)
    addEventIdToExperiments(entities, eventIdsByName)
  }

  return entities
}

async function getExistingEntities(
  accessToken: string,
  projectId: string,
  entityType: string,
) {
  let existingEntities = await api.getEntities(
    accessToken,
    projectId,
    entityType,
  )

  // remove archived entities
  existingEntities = existingEntities.filter((entity) => {
    if ("archived" in entity) {
      return entity.archived === false
    }

    if ("status" in entity) {
      return entity.status !== "archived"
    }

    return true
  })

  if (entityType === "features") {
    for (const existingEntity of existingEntities) {
      existingEntity.variables = existingEntity.variables.filter(
        (variable) => variable.archived === false,
      )
    }
  }

  return existingEntities
}

function getFileAsJson(path: string) {
  const fileData = fs.readFileSync(path, "utf-8")
  return JSON.parse(fileData) as BaseEntity[]
}

function getIdsByName(entities: BaseEntity[]) {
  const idsByName: Record<string, string> = {}
  for (const entity of entities) {
    idsByName[entity.name] = entity.id
  }

  return idsByName
}

function getIdsByKey(entities: BaseEntity[]) {
  const idsByKey: Record<string, string> = {}
  for (const entity of entities) {
    idsByKey[entity.key] = entity.id
  }
  return idsByKey
}

function addFeatureIdToExperiments(
  experiments: BaseEntity[],
  featureIdsByKey: Record<string, string>,
) {
  for (const experiment of experiments) {
    if (experiment.feature_key) {
      experiment.feature_id = featureIdsByKey[experiment.feature_key]
    }
  }
}

function addEventIdToExperiments(
  experiments: BaseEntity[],
  eventIdsByName: Record<string, string>,
) {
  for (const experiment of experiments) {
    for (const metric of experiment.metrics) {
      if (metric.event_key) {
        metric.event_id = eventIdsByName[metric.event_key]
        delete metric["event_key"]
      }
    }
  }
}
