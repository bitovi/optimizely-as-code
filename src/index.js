const fs = require("fs")
const api = require("./api")
const delta = require("./delta")

main()
//TODO test recreating an archived entity
async function main() {
  //order matters!
  const entityTypes = ["features", "events", "experiments"]
  // const entityTypes = ['features']
  for (var entityType of entityTypes) {
    console.log("\n\x1b[36m%s\x1b[0m", entityType)
    var entities = await getEntities(entityType)
    var existingEntities = await getExistingEntities(entityType)

    const entitiesToCreate = delta.getEntitiesToCreate(
      entities,
      existingEntities
    )
    const entitiesToUpdate = delta.getEntitiesToUpdate(
      entities,
      existingEntities
    )
    const entitiesToDelete = delta.getEntitiesToDelete(
      entities,
      existingEntities
    )

    console.log(`${entityType} to Create`)
    console.log(entitiesToCreate)
    console.log(`${entityType} to Update`)
    console.log(entitiesToUpdate)
    console.log(`${entityType} to Delete`)
    console.log(entitiesToDelete)

    await api.createEntities(entityType, entitiesToCreate)
    await api.updateEntities(entityType, entitiesToUpdate)
    await api.deleteEntities(entityType, entitiesToDelete)
  }
}

async function getEntities(entityType) {
  var entities = getFileAsJson(`optimizely/${entityType}.json`)
  //find and add matching feature and event ids to experiments
  if (entityType === "experiments") {
    const existingFeatures = await api.getEntities("features")
    const featureIdsByKey = getIdsByKey(existingFeatures)
    entities = addFeatureIdToExperiments(entities, featureIdsByKey)

    const existingEvents = await api.getEntities("events")
    const eventIdsByName = getIdsByName(existingEvents)
    entities = addEventIdToExperiments(entities, eventIdsByName)
  }
  return entities
}

async function getExistingEntities(entityType) {
  var existingEntities = await api.getEntities(entityType)
  
  //remove archived entities
  existingEntities = existingEntities.filter((entity) => {
    if (entity.hasOwnProperty("archived")) {
      return entity.archived === false
    }
    if (entity.hasOwnProperty("status")) {
      return entity.status !== "archived"
    }
    return true
  })
  if (entityType === "features") {
    for (var existingEntity of existingEntities) {
      existingEntity.variables = existingEntity.variables.filter(
        (variable) => variable.archived === false
        )
      }
    }
  return existingEntities
}

function getFileAsJson(path) {
  const fileData = fs.readFileSync(path)
  return JSON.parse(fileData)
}

function getIdsByName(entities) {
  var idsByName = {}
  for (var entity of entities) {
    idsByName[entity.name] = entity.id
  }
  return idsByName
}

function getIdsByKey(entities) {
  var idsByKey = {}
  for (var entity of entities) {
    idsByKey[entity.key] = entity.id
  }
  return idsByKey
}

function addFeatureIdToExperiments(experiments, featureIdsByKey) {
  for (experiment of experiments) {
    experiment.feature_id = featureIdsByKey[experiment.feature_key]
  }
  return experiments
}

function addEventIdToExperiments(experiments, eventIdsByName) {
  for (experiment of experiments) {
    for (metric of experiment.metrics) {
      metric.event_id = eventIdsByName[metric.event_key]
      delete metric["event_key"]
    }
  }
  return experiments
}
