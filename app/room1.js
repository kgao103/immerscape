// ITEMS

tutorial = new Item({
  name: "tutorial",
  source: "img/help.png",
  // displayed: false,
  sizeRel: [0.6, 0.7],
  posRel: [0.2, 0.05],
});

mousehole = new Item({
  state: "sad",
  get source() {
    return this.state === "sad"
      ? "img/mousehole_sad.png"
      : this.state === "happy"
      ? "img/mousehole_happy.png"
      : "img/mousehole_dead.png";
  },
  sizeRel: [0.12, 0.18],
  posRel: [0.5, 0.575],
  name: "mousehole",
  get description() {
    return this.state === "sad"
      ? "You see a sad mouse in a hole in the wall. It looks like it wants something to eat"
      : this.state === "happy"
      ? "The mouse thanks you for the cheese and gives you a key"
      : "The mouse eats the mashed potatoe powder and dies.";
  },
});

door = new Item({
  isOpen: false,
  get source() {
    return this.isOpen ? "img/door_open.png" : "img/door.png";
  },
  size: [0.25 * window.innerHeight, 0.574 * window.innerHeight],
  name: "door",
  posRel: [0.25, 0.18],
});

clock = new Item({
  source: "img/clock.png",
  size: [0.08 * window.innerWidth, 0.08 * window.innerWidth],
  name: "clock",
  posRel: [0.6, 0.22],
});

fridge = new Item({
  isLocked: true,
  sizeRel: [0.2, 0.35],
  name: "fridge",
  isOpen: false,
  openable: true,
  get source() {
    return this.isOpen ? "img/fridge_open.png" : "img/fridge_closed.png";
  },
  sourceOpened: "img/fridge_open.png",
  sourceClosed: "img/fridge_closed.png",
  // open: function () {
  //   this.set("isOpen", true);
  //   generateSpeech("there's nothing in the fridge you dummy");
  // },
  posRel: [0.65, 0.55],
  openSound: new Audio("sound/fridge_open.wav"),
  closingSound: new Audio("sound/fridge_close.wav"),
});

fridge_lock = new Item({
  sizeRel: [0.12, 0.25],
  name: "fridge lock",
  source: "img/fridge_lock.png",
  posRel: [0.68, 0.57],
});

dresser = new Item({
  openable: true,
  isOpen: false,
  get source() {
    return this.isOpen ? "img/dresser_opened.png" : "img/dresser.png";
  },
  sourceOpened: "img/dresser_opened.png",
  sourceClosed: "img/dresser.png",
  sizeRel: [0.4, 0.45],
  name: "dresser",
  posRel: [0.4, 0.41],
  openSound: new Audio("sound/drawer_opening.mp3"),
  closingSound: new Audio("sound/drawer_closing.wav"),
});

painting = new Item({
  get source() {
    return this.isOpen ? "img/painting_opened.png" : "img/painting.png";
  },
  openable: true,
  isOpen: false,
  sizeRel: [0.17, 0.4],
  name: "painting",
  sourceOpened: "img/painting_opened.png",
  sourceClosed: "img/painting.png",
  posRel: [0.4, 0.25],
  openSound: new Audio("sound/painting_opening.mp3"),
  closingSound: new Audio("sound/drawer_closing.wav"),
});

flashlight = new Item({
  name: "UV flashlight",
  source: "img/blacklight.png",
  size: [100, 100],
  posRel: [0.8, 0.22],
  grabbable: true,
});

lamp = new Item({
  isOn: true,
  get source() {
    return this.isOn ? "img/lamp_on.png" : "img/lamp_off.png";
  },
  sourceOn: "img/lamp_on.png",
  sourceOff: "img/lamp_off.png",
  sizeRel: [0.09, 0.6],
  name: "lamp",
  switchedOnable: true,
  // position: [window.innerWidth * 0.2, window.innerHeight * 0.3],
  posRel: [0.2, 0.3],
  onSound: new Audio("sound/lamp_on.mov"),
  offSound: new Audio("sound/lamp_off.mov"),
});

bedtable = new Item({
  openable: true,
  isOpen: false,
  get source() {
    return this.isOpen ? "img/bedtable_opened.png" : "img/bedtable.png";
  },
  sourceOpened: "img/bedtable_opened.png",
  sourceClosed: "img/bedtable.png",
  sizeRel: [0.12, 0.23],
  name: "bed table",
  posRel: [0.3, 0.6],
  openSound: new Audio("sound/cabinet_opening.wav"),
  closingSound: new Audio("sound/cabinet_closing.wav"),
});

safe = new Item({
  source: "img/safe.png",
  sizeRel: [0.1, 0.13],
  name: "safe",
  isHidden: true,
  posRel: [0.425, 0.45],
});

one = new Item({
  source: "img/button_one.png",
  sizeRel: [0.1, 0.12],
  name: "one",
  posRel: [0.4, 0.4],
  number: 1,
  pressable: true,
});

two = new Item({
  source: "img/button_two.png",
  sizeRel: [0.1, 0.12],
  name: "two",
  posRel: [0.513, 0.4],
  number: 2,
  pressable: true,
});

three = new Item({
  source: "img/button_three.png",
  sizeRel: [0.1, 0.12],
  name: "three",
  posRel: [0.625, 0.4],
  number: 3,
  pressable: true,
});

four = new Item({
  source: "img/button_four.png",
  sizeRel: [0.1, 0.12],
  name: "four",
  posRel: [0.4, 0.53],
  number: 4,
  pressable: true,
});

five = new Item({
  source: "img/button_five.png",
  sizeRel: [0.1, 0.12],
  name: "five",
  posRel: [0.513, 0.53],
  number: 5,
  pressable: true,
});

six = new Item({
  source: "img/button_six.png",
  sizeRel: [0.1, 0.12],
  name: "six",
  posRel: [0.625, 0.53],
  number: 6,
  pressable: true,
});

seven = new Item({
  source: "img/button_seven.png",
  sizeRel: [0.1, 0.12],
  name: "seven",
  posRel: [0.4, 0.66],
  number: 7,
  pressable: true,
});

eight = new Item({
  source: "img/button_eight.png",
  sizeRel: [0.1, 0.12],
  name: "eight",
  posRel: [0.513, 0.66],
  number: 8,
  pressable: true,
});

nine = new Item({
  source: "img/button_nine.png",
  sizeRel: [0.1, 0.12],
  name: "nine",
  posRel: [0.625, 0.66],
  number: 9,
  pressable: true,
});

zero = new Item({
  source: "img/button_zero.png",
  sizeRel: [0.1, 0.12],
  name: "zero",
  posRel: [0.73, 0.53],
  number: 0,
  pressable: true,
});

safe_screen = new Item({
  sizeRel: [0.395, 0.29],
  name: "safe_screen",
  posRel: [0.42, 0.02],
  properties: {
    // backgroundColor: "black",
    background: "url('img/safe_screen.png')",
    color: "#212b1d",
    fontSize: "160px",
    paddingLeft: "20px",
    // paddingBottom: "40px",
  },
});

button_delete = new Item({
  source: "img/button_x.png",
  sizeRel: [0.1, 0.12],
  name: "button_delete",
  posRel: [0.73, 0.4],
  pressable: true,
});

button_enter = new Item({
  source: "img/button_enter.png",
  sizeRel: [0.1, 0.12],
  name: "button_enter",
  posRel: [0.73, 0.66],
  pressable: true,
});

painting2 = new Item({
  source: "img/painting_mouse.jpeg",
  sizeRel: [0.12, 0.29],
  name: "mouse painting",
  posRel: [0.3, 0.25],
  get source() {
    return this.isOpen
      ? "img/painting_mouse_opened.png"
      : "img/painting_mouse.jpeg";
  },
  openable: true,
  isOpen: false,
  sourceOpened: "img/painting_mouse_opened.png",
  sourceClosed: "img/painting_mouse.jpeg",
  openSound: new Audio("sound/painting_opening.mp3"),
  closingSound: new Audio("sound/painting_closing.mp3"),
});

windowLarge = new Item({
  isBroken: false,
  get source() {
    return this.isOpen ? "img/window_broken.png" : "img/window.png";
  },
  sizeRel: [0.25, 0.38],
  name: "window",
  posRel: [0.2, 0.2],
});

mashedPotatoes = new Item({
  source: "img/mashed_potatoes.png",
  sizeRel: [0.04, 0.12],
  posRel: [0.45, 0.33],
  grabbable: true,
  name: "mashed potatoes",
  // set useOn(item) {
  //   console.log("yiijijijij");
  //   if (item.get("name") == "mousehole") {
  //     if (item.get("state") !== "dead") {
  //       mouseCry.play();
  //       sleep(2000).then(() => {
  //         generateSpeech(
  //           "The mouse ate the mashed potatoes and instantly dies."
  //         );
  //       });
  //       item.set("state", "dead");
  //       item.set("source", "img/mousehole_dead.png");
  //       currentRoom.drawView();
  //       return true;
  //     } else {
  //       generateSpeech(
  //         "The mouse is already dead. It can't eat the mashed potatoes anymore you idiot. "
  //       );
  //       return false;
  //     }
  //   } else {
  //     generateSpeech("You can't use the mashed potatoes on that");
  //     return false;
  //   }
  // },
});

cheese = new Item({
  source: "img/cheese.png",
  sizeRel: [0.06, 0.1],
  posRel: [0.71, 0.5],
  grabbable: true,
  name: "cheese",
});

watermelon = new Item({
  source: "img/watermelon.png",
  size: [window.innerWidth * 0.06, window.innerWidth * 0.05],
  posRel: [0.7, 0.488],
  grabbable: true,
  name: "watermelon",
});

cat = new Item({
  source: "img/cat.png",
  grabbable: true,
  sizeRel: [0.08, 0.15],
  posRel: [0.6, 0.55],
  grabbable: true,
  name: "cat",
});

ceiling_fan = new Item({
  source: "img/ceiling_fan.gif",
  sizeRel: [0.25, 0.3],
  posRel: [0.35, -0.05],
  name: "ceiling fan",
});

capybara = new Item({
  source: "img/capybara.png",
  sizeRel: [0.15, 0.3],
  posRel: [0.1, 0.7],
  name: "capybara",
});

key = new Item({
  source: "img/key.png",
  size: [window.innerWidth * 0.04, window.innerWidth * 0.07],
  posRel: [0.45, 0.3],
  grabbable: true,
  name: "key",
});

fridge_key = new Item({
  source: "img/fridge_key.png",
  size: [window.innerWidth * 0.04, window.innerWidth * 0.07],
  posRel: [0.45, 0.3],
  grabbable: true,
  name: "fridge key",
});

hammer = new Item({
  source: "img/hammer.png",
  size: [window.innerWidth * 0.09, window.innerWidth * 0.05],
  posRel: [0.85, 0.8],
  grabbable: true,
  name: "hammer",
});

talkingCapybara = new Item({
  source: "img/capybara.png",
  sizeRel: [0.3, 0.6],
  posRel: [0.02, 0.3],
  name: "capybara",
});

yellowHoly = new Item({
  source: "img/blue_wall_unlit.png",
  sizeRel: [0.19, 0.3],
  posRel: [0.81, 0.117],
  name: "pink wall",
  isHidden: true,
});

favNumber = new Item({
  source: "img/pink_wall_unlit.png",
  sizeRel: [0.22, 0.22],
  posRel: [0.57, 0.25],
  name: "pink wall 2",
});

capybaraClue = new Item({
  source: "img/purple_wall_unlit.png",
  sizeRel: [0.18, 0.55],
  posRel: [0.82, 0.22],
  name: "blue wall",
});

// VIEWS

wall1 = new View({
  background: "img/blue_wall.png",
  background_light: "img/blue_wall.png",
  background_dark: "img/blue_wall_dark.png",
  items: [mousehole, door, clock, ceiling_fan],
});

wall2 = new View({
  background: "img/pink_wall.png",
  background_light: "img/pink_wall.png",
  background_dark: "img/pink_wall_dark.png",
  items: [fridge, fridge_lock, lamp, painting, cheese],
});

wall3 = new View({
  background: "img/green_wall_bed.png",
  background_light: "img/green_wall_bed.png",
  background_dark: "img/green_wall_bed_dark.png",
  items: [bedtable, painting2, cat],
});

wall4 = new View({
  background: "img/purple_wall.png",
  background_light: "img/purple_wall.png",
  background_dark: "img/purple_wall_dark.png",
  items: [windowLarge, dresser, mashedPotatoes, capybara],
});

capybaraConversation = new View({
  items: [talkingCapybara],
  special: [capybaraSpeechOptions],
  background: "img/capybara_background.png",
});

zoomedSafe = new View({
  background: "img/safe_zoomed.png",
  background_light: "img/safe_zoomed.png",
  background_dark: "img/safe_zoomed.png",
  items: [
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    zero,
    button_delete,
    button_enter,
    safe_screen,
  ],
});

// ROOM

room = new Room({
  currentView: "wall1",
  views: {
    wall1: wall1,
    wall2: wall2,
    wall3: wall3,
    wall4: wall4,
    zoomedSafe: zoomedSafe,
    capybaraConversation: capybaraConversation,
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
    talk: {
      wall4: "capybaraConversation",
    },
    bye: {
      capybaraConversation: "wall4",
    },
    zoom_in: {
      wall2: "zoomedSafe",
    },
    zoom_out: {
      zoomedSafe: "wall2",
    },
  },
});
