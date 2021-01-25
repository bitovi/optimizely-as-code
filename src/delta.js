const deepEqual = require('deep-equal')

module.exports = {

    getEntitiesToDelete: function(entities, existingEntities){
        var toDelete = []
        for(var existingEntity of existingEntities){
            var found = false
            for(var entity of entities){
                if(entity.key === existingEntity.key){
                    found = true
                    break
                }
            }
            if(!found){
                toDelete.push(existingEntity)
            }
        }
        return toDelete
    },

    getEntitiesToUpdate: function(entities, existingEntities){
        var toUpdate = []
        for(var entity of entities){
            for(var existingEntity of existingEntities){
                if(entity.key === existingEntity.key){
                    found = true
                    //merge and compare
                    const mergedEntity = merge(existingEntity, entity)
                    var isEqual = deepEqual(mergedEntity, existingEntity)
                    if(!isEqual){
                        // api breaks if given an empty page_id array
                        if(mergedEntity.page_ids !== undefined && mergedEntity.page_ids.length == 0){
                            delete mergedEntity['page_ids']
                            console.error("delete page_ID")
                        }
                        toUpdate.push(mergedEntity)
                    }              
                    break
                }
            }
        }
        return toUpdate
    },

    getEntitiesToCreate: function(entities, existingEntities){
        var toCreate = []
        for(var entity of entities){
            var found = false
            for(var existingEntity of existingEntities){
                if(entity.key === existingEntity.key){
                    found = true
                    break
                }
            }
            if(!found){
                toCreate.push(entity)
            }
        }
        return toCreate
    }
}

function merge(existingEntity, entity){
    const mergedEntity = {...existingEntity, ...entity }
    //manually merge existingEntity properties that are only partially represented in our json files
    if(mergedEntity.environments){
        for(var environment of Object.keys(mergedEntity.environments)){
            mergedEntity.environments[environment].environment_id = existingEntity.environments[environment].environment_id 
            mergedEntity.environments[environment].environment_name = existingEntity.environments[environment].environment_name 
            mergedEntity.environments[environment].percentage_included = existingEntity.environments[environment].percentage_included
        }
    }
    if(mergedEntity.variations){
        for(var variation of mergedEntity.variations){
            for(var existingVariation of existingEntity.variations){
                if(variation.key === existingVariation.key){
                    if(!variation.hasOwnProperty('actions')){
                        variation.actions = existingVariation.actions
                    }
                    if(!variation.hasOwnProperty('archived')){
                        variation.archived = existingVariation.archived
                    }
                    if(!variation.hasOwnProperty('variation_id')){
                        variation.variation_id = existingVariation.variation_id
                    }
                    break
                }
            }
        }
    }
    if(mergedEntity.variables){
        for(var variable of mergedEntity.variables){
            for(var existingVariable of existingEntity.variables){
                if(variable.key === existingVariable.key){
                    variable.id = existingVariable.id
                    variable.archived = existingVariable.archived
                    break
                }
            }
        }
    }    
    return mergedEntity
}