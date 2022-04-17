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
  zIndex = item.get('grabbable') ? 60 : 0;
  var itemView = new ImageSurface({
    //size: size,
    content: image,
    properties: {
      zIndex: zIndex,
    }
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

// USER INTERFACE SETUP
var setupUserInterface = function () {
  background = new ImageSurface({
    size: [window.innerWidth, window.innerHeight],
    content: wall1.get("background"),
  });

  mainContext.add(background);
  drawView(wall1);
  inventory.draw();

  let tooltipWidth = window.innerWidth / 3;
  let tooltipHeight = window.innerHeight / 3;
  let w = tooltipWidth;
  let h = tooltipHeight;

  let x = (window.innerWidth - tooltipWidth) / 2;
  let y = (window.innerHeight - tooltipHeight) / 2;
  /*
  otherFeedback = new Surface({
    content: "",
    size: [tooltipWidth, tooltipHeight],
    properties: {
      backgroundColor: "rgb(34, 34, 34)",
      color: "white",
      zIndex: 90,
      opacity: 1,
    },
  });

  var tileTranslateModifier = new Modifier({
    transform: Transform.translate(x, y, 0),
  });

  mainContext.add(tileTranslateModifier).add(otherFeedback);

  let hItem = 0.8;
  let wItem = 0.4;

  itemImage = new ImageSurface({
    content: "img/hammer.png",
    size: [wItem * w, hItem * h],
    properties: {
      backgroundColor: "white",
      color: "white",
      zIndex: 95,
      opacity: 1,
    }
  });

  console.log(itemImage);
  

  var tileTranslateModifier = new Modifier({
    transform: Transform.translate(
      x + (0.5 - wItem)/2 * w,
      y + (1 - hItem)/2 * h, 
      0),
  });

  mainContext.add(tileTranslateModifier).add(itemImage);

  itemText = new Surface({
    content: "this is a hammer. it can break things.",
    size: [wItem * w, hItem * h],
    properties: {
      backgroundColor: "black",
      color: "white",
      zIndex: 95,    
      opacity: 1, 
    }
  });

  console.log (itemText);

  var tileTranslateModifier = new Modifier({
    transform: Transform.translate(
      x + (1.5 - wItem)/2 * w,
      y + (1 - hItem)/2 * h, 
      0),
  });

  mainContext.add(tileTranslateModifier).add(itemText);
  */

  // Draw the cursor
  var cursorSurface = new Surface({
    size: [CURSORSIZE, CURSORSIZE],
    classes: ["cursor"],
    properties: {
      borderRadius: CURSORSIZE / 2 + "px",
      pointerEvents: "none",
      zIndex: 100,
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
