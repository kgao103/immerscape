// ITEMS

tutorial = new Item({
  name: "tutorial",
  source: "img/help.png",
  displayed: false,
  size: [window.innerHeight * 1.2, window.innerHeight * 0.7],
  position: [window.innerWidth * 0.2, window.innerHeight * 0.05],
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
  size: [130, 100],
  position: [window.innerWidth * 0.5, window.innerHeight * 0.603],
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
  size: [window.innerHeight * 0.27, window.innerHeight * 0.574],
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
  position: [window.innerWidth * 0.65, window.innerHeight * 0.55],
  openSound: new Audio("sound/fridge_open.wav"),
  closingSound: new Audio("sound/fridge_close.wav"),
});

dresser = new Item({
  openable: true,
  isOpen: false,
  get source() {
    return this.isOpen ? "img/dresser_opened.png" : "img/dresser.png";
  },
  sourceOpened: "img/dresser_opened.png",
  sourceClosed: "img/dresser.png",
  size: [window.innerWidth * 0.4, window.innerWidth * 0.25],
  name: "dresser",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.4],
  openSound: new Audio("sound/drawer_opening.mp3"),
  closingSound: new Audio("sound/drawer_closing.wav"),
});

painting = new Item({
  get source() {
    return this.isOpen ? "img/painting_opened.png" : "img/painting.png";
  },
  openable: true,
  isOpen: false,
  size: [182, 240],
  name: "painting",
  sourceOpened: "img/painting_opened.png",
  sourceClosed: "img/painting.png",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.25],
  openSound: new Audio("sound/painting_opening.mp3"),
  closingSound: new Audio("sound/drawer_closing.wav"),
});

flashlight = new Item({
  name: "flashlight",
  source: "img/flashlight.png",
  size: [100, 100],
  position: [window.innerWidth * 0.8, window.innerHeight * 0.22],
  grabbable: true,
});

lamp = new Item({
  isOn: true,
  get source() {
    return this.isOn ? "img/lamp_on.png" : "img/lamp_off.png";
  },
  sourceOn: "img/lamp_on.png",
  sourceOff: "img/lamp_off.png",
  size: [100, 350],
  name: "lamp",
  switchedOnable: true,
  position: [window.innerWidth * 0.2, window.innerHeight * 0.3],
  onSound: new Audio("sound/lamp_on.mov"),
  offSound: new Audio("sound/lamp_off.mov"),
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

safe = new Item({
  source: "img/safe.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.08],
  name: "safe",
  isHidden: true,
  position: [window.innerWidth * 0.425, window.innerHeight * 0.45],
});

one = new Item({
  source: "img/button_one.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "one",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.4],
  number: 1,
  pressable: true,
});

two = new Item({
  source: "img/button_two.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "two",
  position: [window.innerWidth * 0.52, window.innerHeight * 0.4],
  number: 2,
  pressable: true,
});

three = new Item({
  source: "img/button_three.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "three",
  position: [window.innerWidth * 0.625, window.innerHeight * 0.4],
  number: 3,
  pressable: true,
});

four = new Item({
  source: "img/button_four.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "four",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.53],
  number: 4,
  pressable: true,
});

five = new Item({
  source: "img/button_five.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "five",
  position: [window.innerWidth * 0.52, window.innerHeight * 0.53],
  number: 5,
  pressable: true,
});

six = new Item({
  source: "img/button_six.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "six",
  position: [window.innerWidth * 0.625, window.innerHeight * 0.53],
  number: 6,
  pressable: true,
});

seven = new Item({
  source: "img/button_seven.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "seven",
  position: [window.innerWidth * 0.4, window.innerHeight * 0.66],
  number: 7,
  pressable: true,
});

eight = new Item({
  source: "img/button_eight.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "eight",
  position: [window.innerWidth * 0.52, window.innerHeight * 0.66],
  number: 8,
  pressable: true,
});

nine = new Item({
  source: "img/button_nine.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "nine",
  position: [window.innerWidth * 0.625, window.innerHeight * 0.66],
  number: 9,
  pressable: true,
});

zero = new Item({
  source: "img/button_zero.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "zero",
  position: [window.innerWidth * 0.73, window.innerHeight * 0.53],
  number: 0,
  pressable: true,
});

safe_screen = new Item({
  size: [window.innerWidth * 0.395, window.innerHeight * 0.29],
  name: "safe_screen",
  position: [window.innerWidth * 0.42, window.innerHeight * 0.02],
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
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "button_delete",
  position: [window.innerWidth * 0.73, window.innerHeight * 0.4],
  pressable: true,
});

button_enter = new Item({
  source: "img/button_enter.png",
  size: [window.innerWidth * 0.1, window.innerWidth * 0.07],
  name: "button_enter",
  position: [window.innerWidth * 0.73, window.innerHeight * 0.66],
  pressable: true,
});

painting2 = new Item({
  source: "img/painting2.jpeg",
  size: [window.innerWidth * 0.12, window.innerWidth * 0.15],
  name: "painting2",
  position: [window.innerWidth * 0.3, window.innerHeight * 0.2],
});

windowLarge = new Item({
  isBroken: false,
  get source() {
    return this.isOpen ? "img/window_broken.png" : "img/window.png";
  },
  size: [window.innerWidth * 0.25, window.innerWidth * 0.18],
  name: "window",
  position: [window.innerWidth * 0.2, window.innerHeight * 0.2],
});

mashedPotatoes = new Item({
  source: "img/mashed_potatoes.png",
  size: [window.innerWidth * 0.04, window.innerWidth * 0.07],
  position: [window.innerWidth * 0.45, window.innerHeight * 0.33],
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
  size: [window.innerWidth * 0.06, window.innerWidth * 0.05],
  position: [window.innerWidth * 0.7, window.innerHeight * 0.488],
  grabbable: true,
  name: "cheese",
});

watermelon = new Item({
  source: "img/watermelon.png",
  size: [window.innerWidth * 0.06, window.innerWidth * 0.05],
  position: [window.innerWidth * 0.7, window.innerHeight * 0.488],
  grabbable: true,
  name: "watermelon",
});

cat = new Item({
  source: "img/cat.png",
  grabbable: true,
  size: [window.innerWidth * 0.07, window.innerWidth * 0.08],
  position: [window.innerWidth * 0.2, window.innerHeight * 0.8],
  grabbable: true,
  name: "cat",
});

ceiling_fan = new Item({
  source: "img/ceiling_fan.gif",
  size: [window.innerWidth * 0.25, window.innerWidth * 0.2],
  position: [window.innerWidth * 0.35, -30],
  name: "ceiling fan",
});

capybara = new Item({
  source: "img/capybara.png",
  size: [window.innerWidth * 0.15, window.innerHeight * 0.3],
  position: [window.innerWidth * 0.1, window.innerHeight * 0.7],
  name: "capybara",
});

key = new Item({
  source: "img/key.png",
  size: [window.innerWidth * 0.04, window.innerWidth * 0.07],
  position: [window.innerWidth * 0.45, window.innerHeight * 0.3],
  grabbable: true,
  name: "key",
});

hammer = new Item({
  source: "img/hammer.png",
  size: [window.innerWidth * 0.09, window.innerWidth * 0.05],
  position: [window.innerWidth * 0.85, window.innerHeight * 0.8],
  grabbable: true,
  name: "hammer",
});

talkingCapybara = new Item({
  source: "img/capybara.png",
  size: [window.innerWidth * 0.3, window.innerHeight * 0.6],
  position: [window.innerWidth * 0.1, window.innerHeight * 0.3],
  name: "capybara",
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
  items: [fridge, lamp, painting, cheese],
});

wall3 = new View({
  background: "img/green_wall.png",
  background_light: "img/green_wall.png",
  background_dark: "img/green_wall_dark.png",
  items: [bedtable, bed, painting2, cat],
});

wall4 = new View({
  background: "img/purple_wall.png",
  background_light: "img/purple_wall.png",
  background_dark: "img/purple_wall_dark.png",
  items: [windowLarge, dresser, mashedPotatoes, capybara],
});

capybaraConversation = new View({
  items: [talkingCapybara],
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
    zoom_in: {
      wall2: "zoomedSafe",
    },
    zoom_out: {
      zoomedSafe: "wall2",
    },
  },
});
