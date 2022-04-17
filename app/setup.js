// Import Famo.us dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;

var background, turnFeedback, otherFeedback, cursorObject;

var mainContext = Engine.createContext();

var inventory = new Inventory();

function drawBackground(imagePath) {
  /*
  var itemView = new ImageSurface({
    size: [window.innerWidth, window.innerHeight],
    content: imagePath,
    classes: ["background"],
  });

  mainContext.add(itemView);
  */
  background.setContent(imagePath);
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
  image = item.get('source');
  //size = item.get('size');
  //position = item.get('position');
  var itemView = new ImageSurface({
    //size: size,
    content: image,
  });

  var itemTranslateModifier = new Modifier({
    transform: function () {
      let position = item.get('position');
      return Transform.translate(position[0], position[1], 0);
    },
    opacity: function () {
      return item.get('opacity');
    },
    size: function () {
      return item.get('size');
    },
  });

  mainContext.add(itemTranslateModifier).add(itemView);
  item.set("context", itemView);
}

function drawView(view) {
  drawBackground(view.get("background"));
  view.get("items").forEach((item) => {
    item.draw();
  });
  //inventory.draw();
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

// USER INTERFACE SETUP
var setupUserInterface = function () {
  background = new ImageSurface({
    size: [window.innerWidth, window.innerHeight],
    content: wall1.get("background"),
  });

  mainContext.add(background);
  drawWall1();
  inventory.draw();

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
