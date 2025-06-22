/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2514967149")

  // remove field
  collection.fields.removeById("autodate3074913522")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date3074913522",
    "max": "",
    "min": "",
    "name": "deadline",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2514967149")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "autodate3074913522",
    "name": "deadline",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("date3074913522")

  return app.save(collection)
})
