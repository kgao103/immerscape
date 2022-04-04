// ITEMS

mousehole = new Item({
  state: "sad",
  get source() {
    return this.state === "sad"
      ? "img/mousehole_sad.png"
      : this.state === "happy"
      ? "img/mousehole_happy.png"
      : "img/mousehole_dead.png";
  },
  size: [100, 100],
  position: [window.innerWidth * 0.5, window.innerHeight * 0.605],
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
    return this.isOpen ? "img/door_opened.png" : "img/door.png";
  },
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

windowLarge = new Item({
  source: "img/window.png",
  size: [window.innerWidth * 0.25, window.innerWidth * 0.18],
  name: "window",
  position: [window.innerWidth * 0.2, window.innerHeight * 0.2],
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
  size: [window.innerWidth * 0.06, window.innerWidth * 0.05],
  position: [window.innerWidth * 0.7, window.innerHeight * 0.488],
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

// VIEWS

wall1 = new View({
  background: "img/blue_wall.png",
  items: [mousehole, door, clock],
});

wall2 = new View({
  background: "img/pink_wall.png",
  items: [fridge, lamp, painting, cheese],
});

wall3 = new View({
  background: "img/green_wall.png",
  items: [bedtable, bed, painting2],
});

wall4 = new View({
  background: "img/purple_wall.png",
  items: [windowLarge, dresser, mashedPotatoes],
});

// ROOM

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