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
    grabbable: false,
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

mousehole = new Item({
  state: "sad",
  source:
    state == "sad"
      ? "images/mousehole_sad.png"
      : state == "happy"
      ? "images/mousehole_happy.png"
      : "images/mousehole_dead.png",
  size: [100, 100],
  position: [window.innerWidth * 0.5, window.innerHeight * 0.605],
  name: "mousehole",
  description:
    state == "sad"
      ? "You see a sad mouse in a hole in the wall. It looks like it wants something to eat"
      : state == "happy"
      ? "The mouse thanks you for the cheese and gives you a key"
      : "The mouse eats the mashed potatoe powder and dies.",
});

door = new Item({
  isOpen: false,
  source: isOpen ? "img/door_opened.png" : "img/door.png",
  size: [200, 400],
  name: "door",
  position: [window.innerWidth * 0.25, window.innerHeight * 0.18],
});

clock = new Item({
  source: "img/clock.png",
  size: [100, 100],
  name: "clock",
  position: [window.innerWidth * 0.6, window.innerHeight * 0.22],
});

fridge = new Item({
  size: [220, 220],
  name: "fridge",
  isOpen: false,
  source: isOpen ? "img/fridge_open.png" : "img/fridge_closed.png",
  position: [window.innerWidth * 0.65, window.innerHeight * 0.55],
});

lamp = new Item({
  source: "img/lamp.png",
  size: [100, 350],
  name: "lamp",
  position: [window.innerWidth * 0.2, window.innerHeight * 0.3],
});

painting = new Item({
  source: "img/painting.png",
  size: [180, 240],
  name: "painting",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.22],
});

bedtable = new Item({
  source: "img/bedtable.png",
  size: [window.innerWidth * 0.12, window.innerWidth * 0.12],
  name: "bedtable",
  position: [window.innerWidth * 0.3, window.innerHeight * 0.6],
});

bed = new Item({
  source: "img/bed.png",
  size: [500, 300],
  name: "bed",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.5],
});

painting2 = new Item({
  source: "img/painting2.jpeg",
  size: [window.innerWidth * 0.12, window.innerWidth * 0.15],
  name: "painting2",
  position: [window.innerWidth * 0.3, window.innerHeight * 0.2],
});

dresser = new Item({
  source: "img/dresser.png",
  size: [window.innerWidth * 0.4, window.innerWidth * 0.25],
  name: "dresser",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.38],
});

mashedPotatoes = new Item({
  source: "img/mashed_potatoes.png",
  size: [window.innerWidth * 0.04, window.innerWidth * 0.07],
  position: [window.innerWidth * 0.45, window.innerHeight * 0.3],
  grabbable: true,
  name: "mashed potatoes",
});

cheese = new Item({
  source: "img/cheese.png",
  size: [window.innerWidth * 0.04, window.innerWidth * 0.07],
  position: [window.innerWidth * 0.45, window.innerHeight * 0.3],
  grabbable: true,
  name: "cheese",
});

key = new Item({
  source: "img/key.png",
  size: [window.innerWidth * 0.04, window.innerWidth * 0.07],
  position: [window.innerWidth * 0.45, window.innerHeight * 0.3],
  grabbable: true,
  name: "key",
});

var View = Backbone.Model.extend({
  defaults: {
    background: "",
    items: [],
  },
});

wall1 = new View({
  background: "img/blue_wall.png",
  items: [mousehole, door, clock],
});

wall2 = new View({
  background: "img/pink_wall.png",
  items: [fridge, lamp, painting],
});

wall3 = new View({
  background: "img/green_wall.png",
  items: [bedtable, bed, painting2],
});

wall4 = new View({
  background: "img/purple_wall.png",
  items: [dresser, mashedPotatoes],
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
      drawView(this.get("views")[new_view]);
    }
  },

  getView: function () {
    return this.get("views")[this.get("currentView")];
  },
});

room = new Room({
  currentView: "wall1",
  views: {
    wall1: wall1,
    wall2: wall2,
    wall3: wall3,
    wall4: wall4,
  },
  transitions: {
    left: {
      wall1: "wall4",
      wall2: "wall1",
      wall3: "wall2",
      wall4: "wall3",
    },
    right: {
      wall1: "wall2",
      wall2: "wall3",
      wall3: "wall4",
      wall4: "wall1",
    },
  },
});
