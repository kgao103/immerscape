var INVENTORY_SIZE = 5;
var SLOT_SIZE = 100;
var SLOT_SPACING = 10;
var SLOT_PADDING = SLOT_SIZE * 0.1;
var TOTAL_WIDTH =
  SLOT_SIZE * INVENTORY_SIZE + SLOT_SPACING * (INVENTORY_SIZE - 1);

var Inventory = Backbone.Model.extend({
  defaults: {
    items: [],
    rendered: false,
    context: null,
    opacity: 1,
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
      item.set("size", [SLOT_SIZE - SLOT_PADDING * 2, SLOT_SIZE - SLOT_PADDING * 2]);
      if (item.get("holding")) {
      } else {
        let x =
          (window.innerWidth - TOTAL_WIDTH) / 2 +
          (SLOT_SIZE + SLOT_SPACING) * i + SLOT_PADDING;
        let y = window.innerHeight - SLOT_SIZE - 10 + SLOT_PADDING;
        item.set("position", [x, y]);
      }
    }
  },

  hide: function () {
    this.set("opacity", 0);
  },

  draw: function () {
    let items = this.get("items");
    this.updateItemPositions();
    this.set("opacity", 1);
    if (this.get("rendered")) {

    } else {
      this.set("rendered", true);
      var inventoryView = new ContainerSurface({
        size: [TOTAL_WIDTH, SLOT_SIZE],
        properties: {
          zIndex: 1,
        },
      });
   
      var tileTranslateModifier = new Modifier({
        transform: Transform.translate(
          (window.innerWidth - TOTAL_WIDTH) / 2,
          window.innerHeight - SLOT_SIZE - 10, 
          0),
        opacity: function() { return this.get("opacity") }.bind(this),
      });

      mainContext.add(tileTranslateModifier).add(inventoryView);
      this.set("context", inventoryView);
    }
    
    for (var i = 0; i < INVENTORY_SIZE; i++) {
      var tileView = new Surface({
        size: [SLOT_SIZE, SLOT_SIZE],
        properties: {
          backgroundColor: "#ccffff",
          border: "solid 1px #ccffff",
        },
      });

      var tileTranslateModifier = new Modifier({
        transform: Transform.translate((SLOT_SIZE + SLOT_SPACING) * i, 0, 0),
      });

      this.get("context").add(tileTranslateModifier).add(tileView);

      if (i < items.length) {
        let item = items[i];
        drawItem(item);
      }
    }
  },
});
