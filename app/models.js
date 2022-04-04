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
    openable: false,
    name: "",
    description: "",
  },

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

  drawView: function() {
    drawView(this.getView());
  },
});