const request = require("request")

const PROJECT_ID = process.env.PROJECT_ID
const API_HOST = "https://api.optimizely.com/v2"
const API_TOKEN = process.env.API_TOKEN
const AUTH_HEADER = `Bearer ${API_TOKEN}`

module.exports = {
  getEntities: async function (entityName) {
    var url = `${API_HOST}/${entityName}?project_id=${PROJECT_ID}`
    var options = {
      method: "GET",
      url: url,
      headers: {
        Authorization: AUTH_HEADER,
        "Content-Type": "application/json",
      },
    }
    return await doRequest(options)
  },

  createEntities: async function (entityName, entities) {
    for (entity of entities) {
      var url = `${API_HOST}/${entityName}`
      if (entityName === "events") {
        url = `${API_HOST}/projects/${PROJECT_ID}/custom_events`
      }
      var options = {
        method: "POST",
        url: url,
        headers: {
          Authorization: AUTH_HEADER,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entity),
      }
      console.log("\x1b[33m", `Create ${entity.key}`)
      var result = await doRequest(options)
      console.log(result)
    }
  },

  updateEntities: async function (entityName, entities) {
    for (entity of entities) {
      var url = `${API_HOST}/${entityName}/${entity.id}`
      if (entityName === "events") {
        url = `${API_HOST}/projects/${PROJECT_ID}/custom_events/${entity.id}`
      }
      var options = {
        method: "PATCH",
        url: url,
        headers: {
          Authorization: AUTH_HEADER,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entity),
      }
      console.log("\x1b[33m", `Update ${entity.key}`)
      var result = await doRequest(options)
      console.log(result)
    }
  },

  deleteEntities: async function (entityName, entities) {
    for (entity of entities) {
      var url = `${API_HOST}/${entityName}/${entity.id}`
      if (entityName === "events") {
        url = `${API_HOST}/projects/${PROJECT_ID}/custom_events/${entity.id}`
      }
      var options = {
        method: "DELETE",
        url: url,
        headers: {
          Authorization: AUTH_HEADER,
          "Content-Type": "application/json",
        },
      }
      console.log("\x1b[33m", `Delete ${entity.key}`)
      var result = await doRequest(options)
      console.log(result)
    }
  },
}

async function doRequest(options) {
  console.log(`${options.method} - ${options.url}`)
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (error) {
        console.error(error)
        console.log("statusCode:", response && response.statusCode) // Print the response status code if a response was received
        console.log("body:", body) // Print the HTML for the Google homepage.
        reject(error)
      }
      console.log(response.statusCode)
      var body = response.body || "[]"
      resolve(JSON.parse(body))
    })
  })
}
