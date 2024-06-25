import deepEqual from "deep-equal"

import { BaseEntity } from "./interfaces.js"

export function getEntitiesToDelete<Entity extends BaseEntity>(
  entities: Entity[],
  existingEntities: Entity[],
): Entity[] {
  const toDelete: Entity[] = []
  for (const existingEntity of existingEntities) {
    let found = false
    for (const entity of entities) {
      if (entity.key === existingEntity.key) {
        found = true
        break
      }
    }

    if (!found) {
      toDelete.push(existingEntity)
    }
  }

  return toDelete
}

export function getEntitiesToUpdate<Entity extends BaseEntity>(
  entities: Entity[],
  existingEntities: Entity[],
): Entity[] {
  const toUpdate: Entity[] = []
  for (const entity of entities) {
    for (const existingEntity of existingEntities) {
      if (entity.key === existingEntity.key) {
        const mergedEntity = merge(existingEntity, entity)
        const isEqual = deepEqual(mergedEntity, existingEntity)
        if (!isEqual) {
          // api breaks if given an empty page_id array
          if (mergedEntity.page_ids && mergedEntity.page_ids.length === 0) {
            delete mergedEntity["page_ids"]
          }

          toUpdate.push(mergedEntity)
        }

        break
      }
    }
  }

  return toUpdate
}

export function getEntitiesToCreate<Entity extends BaseEntity>(
  entities: Entity[],
  existingEntities: Entity[],
): Entity[] {
  const toCreate: Entity[] = []
  for (const entity of entities) {
    let found = false
    for (const existingEntity of existingEntities) {
      if (entity.key === existingEntity.key) {
        found = true
        break
      }
    }

    if (!found) {
      toCreate.push(entity)
    }
  }

  return toCreate
}

function merge<Entity extends BaseEntity>(
  existingEntity: Entity,
  entity: Entity,
): Entity {
  const mergedEntity = { ...existingEntity, ...entity }

  if (mergedEntity.environments) {
    for (const environment of Object.keys(mergedEntity.environments)) {
      mergedEntity.environments[environment].environment_id =
        existingEntity.environments[environment].environment_id
      mergedEntity.environments[environment].environment_name =
        existingEntity.environments[environment].environment_name
      mergedEntity.environments[environment].percentage_included =
        existingEntity.environments[environment].percentage_included
    }
  }

  if (mergedEntity.variations) {
    for (const variation of mergedEntity.variations) {
      for (const existingVariation of existingEntity.variations) {
        if (variation.key === existingVariation.key) {
          if (!("variation_id" in variation)) {
            variation.variation_id = existingVariation.variation_id
          }

          if (!("archived" in variation)) {
            variation.archived = existingVariation.archived
          }

          if (!("actions" in variation)) {
            variation.actions = existingVariation.actions
          }
          break
        }
      }
    }
  }

  if (mergedEntity.variables) {
    for (const variable of mergedEntity.variables) {
      for (const existingVariable of existingEntity.variables) {
        if (variable.key === existingVariable.key) {
          variable.id = existingVariable.id
          variable.archived = existingVariable.archived
          break
        }
      }
    }
  }

  return mergedEntity
}
