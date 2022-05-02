function createTextWindow(text) {
  let textWindow = new Item({
    text: text,
    sizeRel: [0.395, 0.17],
    name: "tutorial_window_1",
    posRel: [0.5, 0.1],

    properties: {
      backgroundColor: "#660066",
      fontFamily: "Trebuchet MS",
      border: "3px solid #ffffcc",
      borderRadius: "5px",
      //backgroundImage: "url('img/door.png')",
      backgroundSize: "100% 100%",
      color: "white",
      fontSize: "20px",
      padding: "10px",
      paddingLeft: "20px",

      // paddingBottom: "40px",
      zIndex: 99,
    },
  });
  return textWindow;
}

tutorialDoor = new Item({
  isOpen: false,
  get source() {
    return this.isOpen ? "img/door_opened_tutorial.png" : "img/door.png";
  },
  size: [0.25 * window.innerHeight, 0.574 * window.innerHeight],
  name: "tutorialDoor",
  posRel: [0.25, 0.18],
});

drawerFlag = false;
tutorialDrawer = new Item({
  openable: true,
  isOpen: false,
  get source() {
    return this.isOpen ? "img/bedtable_opened.png" : "img/bedtable.png";
  },
  sourceOpened: "img/bedtable_opened.png",
  sourceClosed: "img/bedtable.png",
  sizeRel: [0.12, 0.23],
  name: "tutorialDrawer",
  posRel: [0.3, 0.6],
  openSound: new Audio("sound/cabinet_opening.wav"),
  closingSound: new Audio("sound/cabinet_closing.wav"),
});

tutorialKey = new Item({
  source: "img/key.png",
  size: [window.innerWidth * 0.05, window.innerWidth * 0.05],
  posRel: [0.2, 0.8],
  grabbable: true,
  name: "key",
});

tutorialWindow1 = createTextWindow(
  `Welcome to the tutorial.
  This is a quick guide to get you started.
  First, try turning to the RIGHT
  by moving your cursor to the RIGHT of the screen.`
);

tutorialWindow2 = createTextWindow(
  `Now try OPENING the drawer.
  Hover over the drawer, make a GRABBING motion, and PULL.`
);

tutorialWindow3 = createTextWindow(
  `Whoops, you shouldn't be here.
  Remember, you can turn left or right
  by moving your cursor to the left or right of the screen.`
);

tutorialWindow4 = createTextWindow(
  `Whoops, you shouldn't be here.
  Remember, you can turn left or right
  by moving your cursor to the left or right of the screen.`
);

tutorial1 = new View({
  background: "img/purple_wall.png",
  items: [tutorialWindow1, tutorialDoor],
});

tutorial2 = new View({
  background: "img/blue_wall.png",
  items: [tutorialWindow2, tutorialDrawer],
});

tutorial3 = new View({
  background: "img/pink_wall.png",
  items: [tutorialWindow3],
});

tutorial4 = new View({
  background: "img/green_wall_bed.png",
  items: [tutorialWindow4],
});

tutorialRoom = new Room({
  currentView: "tutorial1",
  views: {
    tutorial1: tutorial1,
    tutorial2: tutorial2,
    tutorial3: tutorial3,
    tutorial4: tutorial4,
  },
  transitionHandlers: {},
  transitions: {
    left: {
      tutorial1: "tutorial4",
      tutorial2: "tutorial1",
      tutorial3: "tutorial2",
      tutorial4: "tutorial3",
    },
    right: {
      tutorial1: "tutorial2",
      tutorial2: "tutorial3",
      tutorial3: "tutorial4",
      tutorial4: "tutorial1",
    },
  },
});
