var Cursor = Backbone.Model.extend({
  defaults: {
    screenPosition: [0, 0],
  },
  setScreenPosition: function (position) {
    this.set("screenPosition", position.slice(0));
  },
});

function shuffle(o) {
  //v1.0
  for (
    var j, x, i = o.length;
    i;
    j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

var GameState = Backbone.Model.extend({
  defaults: {
    state: "setup", // setup, playing, end
    turn: "player", // player, cpu
    boards: [],
    waiting: true,
  },

  initialize: function () {
    _.bindAll(this, "waitingForPlayer", "nextTurn");
  },

  waitingForPlayer: function () {
    return this.get("waiting");
  },

  startGame: function () {
    if (this.get("state") == "setup") this.set("state", "playing");
    else alert("Not in setup mode, so can't start game");
  },

  endGame: function (winner) {
    if (this.get("state") == "playing") {
      this.set("state", "end");
      this.set("winner", winner);
    } else alert("Not playing, so can't end game");
  },

  nextTurn: function () {
    if (this.get("state") == "playing") {
      this.set("turn", this.isPlayerTurn() ? "cpu" : "player");
      // At beginning of CPU turn, generate shot
      // At beginning of Player turn, waiting for player to fire
      this.set("waiting", this.isPlayerTurn());
    }
  },

  isCpuTurn: function () {
    return this.get("turn") == "cpu";
  },

  isPlayerTurn: function () {
    return this.get("turn") == "player";
  },

  getTurnHTML: function () {
    var turnName = this.isPlayerTurn() ? "your" : "CPU";
    var boardName = this.isPlayerTurn() ? "CPU" : "your";

    return (
      "<h3>" +
      turnName +
      " turn<h3><h3 style='color: #7CD3A2;'>" +
      boardName +
      " board <span class='glyphicon glyphicon-arrow-right'></span></h3>"
    );
  },
});

var Item = Backbone.Model.extend({
  defaults: {
    source: "",
    size: [0, 0],
    position: [0, 0],
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

mousehole_sad = new Item({
  source: "img/mousehole_sad.png",
  size: [100, 100],
  position: [window.innerWidth * 0.5, window.innerHeight * 0.605],
});

door = new Item({
  source: "img/door.png",
  size: [200, 400],
  position: [window.innerWidth * 0.25, window.innerHeight * 0.18],
});

clock = new Item({
  source: "img/clock.png",
  size: [100, 100],
  position: [window.innerWidth * 0.6, window.innerHeight * 0.22],
});

fridge_closed = new Item({
  source: "img/fridge_closed.png",
  size: [220, 220],
  position: [window.innerWidth * 0.65, window.innerHeight * 0.55],
});

lamp = new Item({
  source: "img/lamp.png",
  size: [100, 350],
  position: [window.innerWidth * 0.2, window.innerHeight * 0.3],
});

painting = new Item({
  source: "img/painting.png",
  size: [180, 240],
  position: [window.innerWidth * 0.4, window.innerHeight * 0.22],
});

var Room = Backbone.Model.extend({
  defaults: {
    background: "",
    items: [],
  },
});

wall1 = new Room({
  background: "img/blue_wall.png",
  items: [mousehole_sad, door, clock],
});

wall2 = new Room({
  background: "img/pink_wall.png",
  items: [fridge_closed, lamp, painting],
});

var Ship = Backbone.Model.extend({
  defaults: {
    length: 0,
    isDeployed: false,
    position: { row: 0, col: 0 },
    screenPosition: [0, 0],
    startPosition: [0, 0],
    screenRotation: 0,
    isVertical: false,
    health: 0,
  },

  initialize: function () {
    this.set("health", this.get("length"));
  },

  setScreenPosition: function (position) {
    this.set("screenPosition", position.slice(0));
  },

  setScreenRotation: function (rotation) {
    this.set("screenRotation", rotation);
  },

  setBoardPosition: function (position) {
    this.set("position", position);
  },

  resetShip: function () {
    this.set("screenPosition", this.get("startPosition").slice(0));
    this.set("screenRotation", 0);
    this.set("isVertical", false);
  },

  snapRotation: function () {
    var rotation = this.get("screenRotation");
    var diff1 = Math.abs(rotation - Math.PI / 2);
    var diff2 = Math.abs(rotation + Math.PI / 2);
    var isVertical = diff1 < Math.PI / 4 || diff2 < Math.PI / 4;
    this.set("screenRotation", isVertical ? Math.PI / 2 : 0);
    this.set("isVertical", isVertical);
  },

  getEndpoints: function () {
    var endpoint = {
      row: this.get("position").row,
      col: this.get("position").col,
    };
    if (this.get("isVertical")) endpoint.row += this.get("length") - 1;
    else endpoint.col += this.get("length") - 1;
    return { start: this.get("position"), end: endpoint };
  },

  getScreenOrigin: function () {
    var origin = this.get("screenPosition").slice(0);
    if (this.get("isVertical")) {
      // Get vertical origin
      origin[0] += (this.get("length") * TILESIZE) / 2;
      origin[1] -= (this.get("length") * TILESIZE) / 2;
    }
    return origin;
  },

  overlaps: function (otherShip) {
    var a = this.getEndpoints();
    var b = otherShip.getEndpoints();

    return (
      a.start.row <= b.end.row &&
      a.end.row >= b.start.row &&
      a.start.col <= b.end.col &&
      a.end.col >= b.start.col
    );
  },
});
var ShipSet = Backbone.Collection.extend({ model: Ship });
