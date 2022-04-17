var INVENTORY_SIZE = 5;
var SLOT_SIZE = 100;
var SLOT_SPACING = 10;
var TOTAL_WIDTH =
  SLOT_SIZE * INVENTORY_SIZE + SLOT_SPACING * (INVENTORY_SIZE - 1);

var Inventory = Backbone.Model.extend({
  defaults: {
    items: [],
  },

  addItem: function (item) {
    this.get("items").push(item);
  },

  removeItem: function (item) {
    for (var i = 0; i < this.get("items").length; i++) {
      var inventoryItem = this.get("items")[i];
      if (inventoryItem.get("name") == item.get("name")) {
        this.get("items").splice(i, 1);
        return inventoryItem;
      }
    }
    return false;
  },

  getInventoryItem: function (transcript) {
    for (var i = 0; i < this.get("items").length; i++) {
      var item = this.get("items")[i];
      if (transcript.includes(item.get("name").toLowerCase())) {
        return item;
      }
    }
    return false;
  },

  getHoveredItem: function (cursorPosition) {
    for (var i = 0; i < INVENTORY_SIZE; i++) {
      x =
        (window.innerWidth - TOTAL_WIDTH) / 2 + (SLOT_SIZE + SLOT_SPACING) * i;
      y = window.innerHeight - SLOT_SIZE - 10;
      if (
        withinBoundingBox(
          cursorPosition,
          [x, x + SLOT_SIZE],
          [y, y + SLOT_SIZE]
        )
      ) {
        return this.get("items")[i];
      }
    }
    return false;
  },

  updateItemPositions: function () {
    let items = this.get("items");
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      item.set("size", [SLOT_SIZE, SLOT_SIZE]);
      if (item.get("holding")) {
      } else {
        let x =
          (window.innerWidth - TOTAL_WIDTH) / 2 +
          (SLOT_SIZE + SLOT_SPACING) * i;
        let y = window.innerHeight - SLOT_SIZE - 10;
        item.set("position", [x, y]);
      }
    }
  },

  draw: function () {
    let items = this.get("items");
    this.updateItemPositions();
    for (var i = 0; i < INVENTORY_SIZE; i++) {
      var tileView = new Surface({
        size: [SLOT_SIZE, SLOT_SIZE],
        properties: {
          backgroundColor: "#ccffff",
          border: "solid 1px #ccffff",
          zIndex: 1,
        },
      });

      let x =
        (window.innerWidth - TOTAL_WIDTH) / 2 + (SLOT_SIZE + SLOT_SPACING) * i;
      let y = window.innerHeight - SLOT_SIZE - 10;
      var tileTranslateModifier = new Modifier({
        transform: Transform.translate(x, y, 0),
      });

      mainContext.add(tileTranslateModifier).add(tileView);

      if (i < items.length) {
        let item = items[i];
        drawItem(item);
      }
    }
  },
});
