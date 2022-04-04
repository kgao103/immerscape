// Import Famo.us dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;

var tiles = [];
var tileModifiers = [];
var gridOrigin = [350, 35];

var background, turnFeedback, otherFeedback, cursorObject;

var mainContext = Engine.createContext();

function drawBackground(imagePath) {
  var itemView = new ImageSurface({
    size: [window.innerWidth, window.innerHeight],
    content: imagePath,
    classes: ["background"],
  });

  mainContext.add(itemView);
}

function drawImage(image, size, position) {
  var itemView = new ImageSurface({
    size: size,
    content: image,
  });

  var itemTranslateModifier = new Modifier({
    transform: function () {
      return Transform.translate(position[0], position[1], 0);
    },
  });

  mainContext.add(itemTranslateModifier).add(itemView);
}

function drawItem(item) {
  drawImage(item.get("source"), item.get("size"), item.get("position"));
}

function drawView(view) {
  drawBackground(view.get("background"));
  view.get("items").forEach((item) => {
    drawItem(item);
  });
  drawInventory();
}

function drawWall1() {
  drawView(wall1);
}

function drawWall2() {
  drawView(wall2);
}

function drawWall3() {
  drawView(wall3);
}

function drawWall4() {
  drawView(wall4);
  console.log("before drawing inventory");
}

function drawInventory() {
  console.log("drawing inventory");
  var INVENTORY_SIZE = 5;
  var SLOT_SIZE = 100;
  var SLOT_SPACING = 10;
  var TOTAL_WIDTH =
    SLOT_SIZE * INVENTORY_SIZE + SLOT_SPACING * (INVENTORY_SIZE - 1);
  for (var i = 0; i < INVENTORY_SIZE; i++) {
    if (inventoryObjects && i < inventoryObjects.length) {
      var tileView = new ImageSurface({
        size: [SLOT_SIZE, SLOT_SIZE],
        content: inventoryObjects[i].get("source"),
        properties: {
          backgroundColor: "#ccffff",
          border: "solid 1px #ccffff",
        },
      });
    } else {
      var tileView = new Surface({
        size: [SLOT_SIZE, SLOT_SIZE],
        properties: {
          backgroundColor: "#ccffff",
          border: "solid 1px #ccffff",
        },
      });
    }

    var tileTranslateModifier = new Modifier({
      transform: Transform.translate(
        (window.innerWidth - TOTAL_WIDTH) / 2 + (SLOT_SIZE + SLOT_SPACING) * i,
        window.innerHeight - SLOT_SIZE - 10,
        0
      ),
    });

    mainContext.add(tileTranslateModifier).add(tileView);
  }
}

// USER INTERFACE SETUP
var setupUserInterface = function () {
  background = new Surface({
    content: "<h1>battleship</h1>",
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white",
    },
  });
  mainContext.add(background);
  turnFeedback = new Surface({
    content: "",
    size: [undefined, 150],
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white",
    },
  });
  var turnModifier = new StateModifier({
    origin: [0.0, 0.0],
    align: [0.0, 0.4],
  });
  mainContext.add(turnModifier).add(turnFeedback);
  otherFeedback = new Surface({
    content: "",
    size: [undefined, 50],
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white",
    },
  });
  var otherModifier = new StateModifier({
    origin: [0.0, 1.0],
    align: [0.0, 1.0],
  });
  mainContext.add(otherModifier).add(otherFeedback);

  drawWall1();
  drawInventory();

  // Draw the cursor
  var cursorSurface = new Surface({
    size: [CURSORSIZE, CURSORSIZE],
    classes: ["cursor"],
    properties: {
      borderRadius: CURSORSIZE / 2 + "px",
      pointerEvents: "none",
      zIndex: 1,
      backgroundColor: "pink",
      opacity: 0.8,
    },
  });
  var cursorOriginModifier = new StateModifier({ origin: [0.5, 0.5] });
  var cursorModifier = new Modifier({
    transform: function () {
      var cursorPosition = this.get("screenPosition");
      return Transform.translate(cursorPosition[0], cursorPosition[1], 0);
    }.bind(cursor),
  });
  mainContext.add(cursorOriginModifier).add(cursorModifier).add(cursorSurface);
  cursorObject = cursorSurface;
};
