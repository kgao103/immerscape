var Cursor = Backbone.Model.extend({
  defaults: {
    screenPosition: [0, 0],
  },
  setScreenPosition: function (position) {
    this.set("screenPosition", position.slice(0));
  },
});

var GameState = Backbone.Model.extend({
  defaults: {
    state: "setup", // setup, playing, end
    turn: "player", // player, cpu
    boards: [],
    waiting: true,
  },
});

var Item = Backbone.Model.extend({
  defaults: {
    source: "",
    size: [0, 0],
    position: [0, 0],
    grabbable: false,
    openSound: null,
    closingSound: null,
    openable: false,
    holding: false,
    isOn: true,
    switchedOnable: false,
    name: "",
    description: "",
  },

  // useOn: function (item) {
  //   console.log("hiiii");
  //   return false;
  // },

  initialize: function () {
    this.set("health", this.get("length"));
  },

  setPosition: function (position) {
    this.set("position", position);
  },

  setSize: function (size) {
    this.set("size", size);
  },

  isHovered: function (cursorPosition) {
    let position = this.get("position");
    let size = this.get("size");
    let minX = position[0];
    let maxX = position[0] + size[0];
    let minY = position[1];
    let maxY = position[1] + size[1];
    let withinX = minX <= cursorPosition[0] && cursorPosition[0] <= maxX;
    let withinY = minY <= cursorPosition[1] && cursorPosition[1] <= maxY;
    let result = withinX && withinY;
    return result;
  },
});
var ItemSet = Backbone.Collection.extend({ model: Item });

var View = Backbone.Model.extend({
  defaults: {
    background: "",
    background_dark: "",
    isDark: false,
    items: [],
  },
  removeItem: function (item) {
    let items = this.get("items");
    let index = items.indexOf(item);
    items.splice(index, 1);
    this.set("items", items);
  },
});

var Room = Backbone.Model.extend({
  defaults: {
    currentView: "",
    views: {},
    transitions: {},
  },

  transition: function (type) {
    let transition = this.get("transitions")[type];
    let currentView = this.get("currentView");
    if (currentView in transition) {
      let new_view = transition[currentView];
      this.set("currentView", new_view);
      drawView(this.getView());
    }
  },

  getView: function () {
    return this.get("views")[this.get("currentView")];
  },

  getItems: function () {
    return this.getView().get("items");
  },

  drawView: function () {
    drawView(this.getView());
    inventory.draw();
  },

  turnOffLight: function () {
    console.log("halpppp shleeeee");
    for (let wall of Object.values(this.get("views"))) {
      console.log("halpppp meee");
      wall.set("background", wall.get("background_dark"));
    }
  },

  turnOnLight: function () {
    console.log("halpppp shleeeee");
    for (let wall of Object.values(this.get("views"))) {
      console.log("halpppp meee");
      wall.set("background", wall.get("background_light"));
    }
  },
});

function arrayRemoveItem(array, item) {
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function withinBoundingBox(position, xRange, yRange) {
  withinX = xRange[0] <= position[0] && position[0] <= xRange[1];
  withinY = yRange[0] <= position[1] && position[1] <= yRange[1];
  return withinX && withinY;
}

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
