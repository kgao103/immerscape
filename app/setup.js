// Import Famo.us dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var ContainerSurface = famous.surfaces.ContainerSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;

var background, turnFeedback, otherFeedback, cursorObject;

var mainContext = Engine.createContext();

var inventory = new Inventory();

function drawBackground(imagePath) {
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

function drawView(view) {
  drawBackground(view.get("background"));
  view.get("items").forEach((item) => {
    item.draw();
  });
  view.get("special").forEach((item) => {
    item.draw();
  });
}

var tooltipContext;

function drawToolTip() {
  let tooltipWidth = window.innerWidth / 3;
  let tooltipHeight = window.innerHeight / 3;
  let w = tooltipWidth;
  let h = tooltipHeight;

  let x = (window.innerWidth - tooltipWidth) / 2;
  let y = (window.innerHeight - tooltipHeight) / 2;

  tooltipView = new ContainerSurface({
    content: "",
    size: [tooltipWidth, tooltipHeight],
    properties: {
      backgroundColor: "#fbbf77",
      borderRadius: "30px",
      color: "white",
      zIndex: 90,
    },
  });

  let hItem = 0.8;
  let wItem = 0.4;

  itemImage = new ImageSurface({
    content: "img/hammer.png",
    size: [wItem * w, hItem * h],
    properties: {
      backgroundColor: "#fffee0",
      borderRadius: "20px",
      color: "white",
      zIndex: 95,
    },
  });

  var tileTranslateModifier = new Modifier({
    transform: Transform.translate(
      ((0.5 - wItem) / 2) * w,
      ((1 - hItem) / 2) * h,
      0
    ),
  });

  tooltipView.add(tileTranslateModifier).add(itemImage);

  itemText = new Surface({
    content: "this is a hammer. it can break things.",
    size: [wItem * w, hItem * h],
    properties: {
      backgroundColor: "black",
      color: "white",
      zIndex: 95,
    },
  });

  var tileTranslateModifier = new Modifier({
    transform: Transform.translate(
      ((1.5 - wItem) / 2) * w,
      ((1 - hItem) / 2) * h,
      0
    ),
  });

  tooltipView.add(tileTranslateModifier).add(itemText);

  var tileTranslateModifier = new Modifier({
    transform: Transform.translate(x, y, 0),
    opacity: function () {
      return 0;
    },
  });

  tooltipContext = tooltipView;
  mainContext.add(tileTranslateModifier).add(tooltipView);
}

optionsHeader = new Item({
  content: "Say something!",
  position: [window.innerWidth * 0.3, window.innerHeight * 0.2],
  size: [window.innerWidth * 0.3, window.innerHeight * 0.4],
  properties: {
    backgroundImage: "url(img/speech_bubble.webp)",
    backgroundSize: "100% 100%",
    color: "black",
    zIndex: 95,
    fontSize: "20px",
    padding: window.innerWidth * 0.05 + "px",
  }
})

function drawImageWithText(item) {
  itemView = new Surface({
    content: item.get("content"),
    properties: item.get("properties"),
  });

  var itemTranslateModifier = new Modifier({
    transform: function () {
      let position = item.get("position");
      return Transform.translate(position[0], position[1], 0);
    },
    opacity: function () {
      return item.get("opacity");
    },
    size: function () {
      return item.get("size");
    },
  });

  mainContext.add(itemTranslateModifier).add(itemView);
  return itemView;
}

// USER INTERFACE SETUP
var setupUserInterface = function () {
  background = new ImageSurface({
    size: [window.innerWidth, window.innerHeight],
    content: wall1.get("background"),
  });

  mainContext.add(background);
  room.drawView();
  inventory.draw();
  drawToolTip();
  //speechBubble1.draw();
  //drawSpeechBubble();
  //drawSpeechBubble2();
  //drawImageWithText(speechBubble1);
  //capybaraSpeechOptions.draw();
  capybaraSpeechOptions.set("speechOptions", [
    "Hello. I am Cabbage!",
    "Say something!",
    "I am a capybara. I am a cute little animal.",
  ]);
  capybaraSpeechOptions.updateOptions();
  tooltipContext.setProperties({ "opacity": 0 });

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
