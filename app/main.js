// GAME SETUP
var initialState = SKIPSETUP ? "playing" : "setup";
var gameState = new GameState({ state: initialState });
var cursor = new Cursor();
var hitSound = new Audio("sound/explosion.wav");
var winSound = new Audio("sound/win.wav");
var lostSound = new Audio("sound/lost.wav");
var sunkSound = new Audio("sound/sunkShip.wav");
var missSound = new Audio("sound/miss.mp3");

// UI SETUP
setupUserInterface();

// selectedTile: The tile that the player is currently hovering above
var selectedTile = false;

// grabbedShip/Offset: The ship and offset if player is currently manipulating a ship
var grabbedShip = false;
var grabbedOffset = [0, 0];

// isGrabbing: Is the player's hand currently in a grabbing pose
var isGrabbing = false;

// global variables for our game
var currentRoom = room;
var currentWall = 1;
var isZoomedIn = false;
var zoomedInObject = false;

var isHovering = false; // if hovering over some object
var hoveringObject = null; // object hovering over
var inventoryObjects = [];

var disableTransition = true;
var elapsedFrames = 0;

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({
  hand: function (hand) {
    // Use the hand data to control the cursor's screen position
    var cursorPosition = [
      hand.screenPosition()[0],
      hand.screenPosition()[1] + 300,
    ];
    cursor.setScreenPosition(cursorPosition);

    // SETUP mode
    if (gameState.get("state") == "setup") {

      cursorObject.setProperties({ backgroundColor: "pink" });
      currentRoom.getItems()
        .forEach((item) => {
          if (item.isHovered(cursorPosition)) {
            if (item.get("grabbable")) {
              cursorObject.setProperties({ backgroundColor: "#00ffff" });
            } else {
              cursorObject.setProperties({ backgroundColor: "#66ff33" });
            }
          }
        });

      isGrabbing = hand.grabStrength > 0.5;
      if (isGrabbing) {
        console.log("isGrabbing");
        if (tryGrab()) {

        } else if (!disableTransition) {
          if (cursorPosition[0] < window.innerWidth * 0.1) {
            currentRoom.transition("left");
            disableTransition = true;
            elapsedFrames = 0;
          } else if (cursorPosition[0] > window.innerWidth * 0.9) {
            currentRoom.transition("right");
            disableTransition = true;
            elapsedFrames = 0;
          }
        }
      } else {
        elapsedFrames += 1;
        if (elapsedFrames >= 10) {
          disableTransition = false;
        }
      }
    }
  },
}).use("screenPosition", { scale: LEAPSCALE });

function grabItem(item) {
  inventoryObjects.push(item);
  console.log("grabbed object");
  currentRoom.getView().removeItem(item);
  currentRoom.drawView();
}

function tryGrab() {
  var hoveredItem = getHoveredItem(cursor.get("screenPosition"));
  if (hoveredItem && hoveredItem.get("grabbable")) {
    grabItem(hoveredItem);
    return true;
  } else {
    return false;
  }
}

// processSpeech(transcript)
//  Is called anytime speech is recognized by the Web Speech API
// Input:
//    transcript, a string of possibly multiple words that were recognized
// Output:
//    processed, a boolean indicating whether the system reacted to the speech or not
var processSpeech = function (transcript) {
  // Helper function to detect if any commands appear in a string
  console.log(transcript);
  var userSaid = function (str, commands) {
    for (var i = 0; i < commands.length; i++) {
      if (str.indexOf(commands[i]) > -1) return true;
    }
    return false;
  };

  var processed = false;
  if (!isZoomedIn) {
    if (userSaid(transcript, ["left"])) {
      currentRoom.transition("left");
      processed = true;
    }
    if (userSaid(transcript, ["right"])) {
      currentRoom.transition("right");
      processed = true;
    }
    var hoveredItem = getHoveredItem(cursor.get("screenPosition")); // previously: cusor.get("screenPosition")
    // console.log("screen position", cursor.get("screenPosition"));
    // console.log("hovered item name: ", hoveredItem.get("name"));
    if (userSaid(transcript, ["look"]) && hoveredItem) {
      isZoomedIn = true;
      processed = true;
      zoomedInObject = hoveredItem;
      zoomInObject(hoveredItem);
    } else if (userSaid(transcript, ["zoom out"]) && isZoomedIn) {
      isZoomedIn = false;
      processed = true;
      zoomedInObject = false;
      goToWall(currentWall);
    } else if (userSaid(transcript, ["grab"])) {
      processed = true;
      tryGrab();
    } else if (hoveredItem && getInventoryItemIndice(transcript) > -1) {
      processed = true;
      var objectWasUsed = useObjectOnItem(
        inventoryObjects[getInventoryItemIndice(transcript)],
        hoveredItem
      );
      if (objectWasUsed) {
        inventoryObjects.splice(getInventoryItemIndice(transcript), 1);
        drawInventory();
      }
    } else if (
      userSaid(transcript, ["open"]) &&
      hoveredItem &&
      hoveredItem.get("openable")
    ) {
      processed = true;
      console.log(hoveredItem.get("name"));
      hoveredItem.set("isOpen", true);
      hoveredItem.set("source", hoveredItem.get("sourceOpened"));
      currentRoom.drawView();
    } else if (
      userSaid(transcript, ["close"]) &&
      hoveredItem &&
      hoveredItem.get("openable")
    ) {
      processed = true;
      console.log(hoveredItem.get("name"));
      hoveredItem.set("isOpen", false);
      hoveredItem.set("source", hoveredItem.get("sourceClosed"));
      currentRoom.drawView();
    } else {
    }

    console.log("currentWall: ", currentWall);
  }
  return processed;
};

function goToWall(wallNumber) {
  if (wallNumber == 1) {
    drawWall1();
  } else if (wallNumber == 2) {
    drawWall2();
  } else if (wallNumber == 3) {
    drawWall3();
  } else {
    drawWall4();
  }
}

function zoomInObject(object) {
  var x = object.get("position").x;
  var y = object.get("position").y;
  var z = object.get("position").z;
  var scale = object.get("scale");
  var newScale = scale * 1.5;
  object.set("scale", newScale);
  object.set("position", { x: x, y: y, z: z });
  console.log("zoomed in on object" + object);
}

function getHoveredItem(cursorPosition) {
  for (item of currentRoom.getItems()) {
    if (item.isHovered(cursorPosition)) {
      return item;
    }
  }
  return false;
}

function arrayRemoveItem(array, item) {
  var index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function getInventoryItemIndice(transcript) {
  for (var i = 0; i < inventoryObjects.length; i++) {
    if (transcript.includes(inventoryObjects[i].get("name").toLowerCase())) {
      return i;
    }
  }
  return -1;
}

// returns true if object was used, false otherwise
function useObjectOnItem(object, item) {
  if (object.get("name") == "key") {
    if (item.get("name") == "door") {
      if (item.get("isOpen")) {
        generateSpeech("The door is already open");
        return false;
      } else {
        item.set("isOpen", true);
        item.set("source", "img/door_opened.png");
        generateSpeech(
          "You unlocked the door. Congrats on solving the escape room"
        );
        currentRoom.drawView();
        return true;
      }
    } else {
      generateSpeech("You can't use the key on that");
      return false;
    }
  } else if (object.get("name") == "cheese") {
    if (item.get("name") == "mousehole") {
      if (item.get("state") == "sad") {
        item.set("state", "happy");
        item.set("source", "img/mousehole_happy.png");
        generateSpeech(
          "The mouse ate the cheese and thanks you for the cheese. As a reward, it hands you a golden key."
        );
        inventoryObjects.push(key);
        currentRoom.drawView();
        return true;
      } else if (item.get("state") == "happy") {
        generateSpeech("The mouse is already happy");
        return true;
      } else if (item.get("state") == "dead") {
        generateSpeech(
          "The mouse is dead. It can't eat the cheese anymore you idiot."
        );
        return false;
      }
    } else {
      generateSpeech("You can't use the cheese on that");
      return false;
    }
  } else if (object.get("name") == "mashed potatoes") {
    if (item.get("name") == "mousehole") {
      if (item.get("state") !== "dead") {
        generateSpeech("The mouse ate the mashed potatoes and instantly dies.");
        item.set("state", "dead");
        item.set("source", "img/mousehole_dead.png");
        currentRoom.drawView();
        return true;
      } else {
        generateSpeech(
          "The mouse is already dead. It can't eat the mashed potatoes anymore you idiot. "
        );
        return false;
      }
    } else {
      generateSpeech("You can't use the mashed potatoes on that");
      return false;
    }
  } else {
    generateSpeech(
      "You can't use " + object.get("name") + " on " + item.get("name")
    );
    return false;
  }
  return true;
}
