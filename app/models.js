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
    state: "playing",
  },
});

var Item = Backbone.Model.extend({
  defaults: {
    context: null,
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
    opacity: 1,
    rendered: false,
    number: -1,
  },

  // useOn: function (item) {
  //   console.log("hiiii");
  //   return false;
  // },

  initialize: function () {},

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

  setContent: function (source) {
    this.set("source", source);
    this.get("context").setContent(source);
  },

  isOpenable: function () {
    return this.get("openable") && !this.get("isOpen");
  },

  isClosable: function () {
    return this.get("openable") && this.get("isOpen");
  },

  isOnable: function () {
    return this.get("switchedOnable") && !this.get("isOn");
  },

  isOffable: function () {
    return this.get("switchedOnable") && this.get("isOn");
  },

  open: function () {
    console.log("opening");
    this.set("isOpen", true);
    if (this.get("openSound")) {
      this.get("openSound").play();
    }
    this.setContent(this.get("sourceOpened"));
  },

  close: function () {
    console.log("closing");
    this.set("isOpen", false);
    if (this.get("closingSound")) {
      this.get("closingSound").play();
    }
    this.setContent(this.get("sourceClosed"));
  },

  draw: function () {
    this.set("opacity", 1);
    if (this.get("rendered")) {
      return;
    } else {
      this.set("rendered", true);
      drawItem(this);
    }
  },

  hide: function () {
    this.set("opacity", 0);
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

  hide: function () {
    this.get("items").forEach((item) => {
      item.hide();
    });
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
      this.getView().hide();
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
