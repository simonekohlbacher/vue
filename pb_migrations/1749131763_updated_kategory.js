/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2514967149")

  // update collection data
  unmarshal({
    "name": "categories"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2514967149")

  // update collection data
  unmarshal({
    "name": "kategory"
  }, collection)

  return app.save(collection)
})
