// GAME SETUP
var initialState = SKIPSETUP ? "playing" : "setup";
var gameState = new GameState({ state: initialState });
var cursor = new Cursor();
//var hitSound = new Audio("sound/explosion.wav");
//var winSound = new Audio("sound/win.wav");
//var lostSound = new Audio("sound/lost.wav");
//var sunkSound = new Audio("sound/sunkShip.wav");
// var missSound = new Audio("sound/miss.mp3");
var windowBreakingSound = new Audio("sound/break_window.mp3");
var doorUnlockingSound = new Audio("sound/door_unlock.mp3");
var mouseCry = new Audio("sound/mouse_cry.mp3");
var mouseHappySound = new Audio("sound/mouse_happy.m4a");
var grandmaDeadGrandson = new Audio("sound/grandma.m4a");

// UI SETUP
setupUserInterface();

// selectedTile: The tile that the player is currently hovering above
var selectedTile = false;

// grabbedShip/Offset: The ship and offset if player is currently manipulating a ship
var grabbedItem = false;
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
var disableTransition = true;
var elapsedFrames = 0;

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({
  hand: function (hand) {
    // Use the hand data to control the cursor's screen position
    var cursorPosition = [
      hand.screenPosition()[0],
      hand.screenPosition()[1] + 400,
    ];
    cursor.setScreenPosition(cursorPosition);

    // SETUP mode
    if (gameState.get("state") == "setup") {
      cursorObject.setProperties({ backgroundColor: "pink" });
      currentRoom.getItems().forEach((item) => {
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
        }
      }

      if (!disableTransition) {
        if (cursorPosition[0] < 0) {
          currentRoom.transition("left");
          disableTransition = true;
          elapsedFrames = 0;
        } else if (cursorPosition[0] > window.innerWidth) {
          currentRoom.transition("right");
          disableTransition = true;
          elapsedFrames = 0;
        }
      } else {
        if (cursorPosition[0] < 0 || cursorPosition[0] > window.innerWidth) {
        } else {
          elapsedFrames += 1;
          if (elapsedFrames >= 10) {
            disableTransition = false;
          }
        }
      }

      if (!grabbedItem && isGrabbing) {
        // detect if they are grabbing an inventory item
        grabbedItem = inventory.getHoveredItem(cursorPosition);
        if (grabbedItem) {
          var itemPosition = grabbedItem.get("position");
          grabbedOffset = [
            cursorPosition[0] - itemPosition[0],
            cursorPosition[1] - itemPosition[1],
          ];
          grabbedItem.set("holding", true);
        }
      } else if (grabbedItem && isGrabbing) {
        itemPosition = [
          cursorPosition[0] - grabbedOffset[0],
          cursorPosition[1] - grabbedOffset[1],
        ];
        grabbedItem.set("position", itemPosition);
        // move the item
      } else if (grabbedItem && !isGrabbing) {
        // check if they can use the item
        var hoveredItem = getHoveredItem(cursor.get("screenPosition"));

        if (hoveredItem) {
          var objectWasUsed = useObjectOnItem(grabbedItem, hoveredItem);
          if (objectWasUsed) {
            inventory.removeItem(grabbedItem, 1);
            currentRoom.drawView();
          }
        }

        grabbedItem.set("holding", false);
        grabbedItem = false;
        inventory.updateItemPositions();
      }
    }
  },
}).use("screenPosition", { scale: LEAPSCALE });

function grabItem(item) {
  inventory.addItem(item);
  console.log("grabbed object");
  currentRoom.getView().removeItem(item);
  currentRoom.drawView();
}

function tryGrab() {
  var hoveredItem = getHoveredItem(cursor.get("screenPosition"));
  if (hoveredItem && hoveredItem.get("grabbable")) {
    grabItem(hoveredItem);
    generateSpeech("You've just obtained the " + hoveredItem.get("name"));
    return true;
  } else {
    // generateSpeech("oops, please try again");
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
    var usedItem = inventory.getInventoryItem(transcript);
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
    } else if (hoveredItem && usedItem) {
      processed = true;
      var objectWasUsed = useObjectOnItem(usedItem, hoveredItem);
      if (objectWasUsed) {
        inventory.removeItem(usedItem, 1);
        inventory.draw();
      }
    } else if (
      userSaid(transcript, ["open"]) &&
      hoveredItem &&
      hoveredItem.get("openable") &&
      hoveredItem.get("isOpen") == false
    ) {
      processed = true;
      console.log(hoveredItem.get("name"));
      hoveredItem.get("openSound").play();
      hoveredItem.set("isOpen", true);
      hoveredItem.set("source", hoveredItem.get("sourceOpened"));
      currentRoom.drawView();
    } else if (
      userSaid(transcript, ["close"]) &&
      hoveredItem &&
      hoveredItem.get("openable") &&
      hoveredItem.get("isOpen") == true
    ) {
      processed = true;
      console.log(hoveredItem.get("name"));
      hoveredItem.get("closingSound").play();
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

// returns true if object was used, false otherwise
function useObjectOnItem(object, item) {
  if (object.get("name") == "key") {
    if (item.get("name") == "door") {
      if (item.get("isOpen")) {
        generateSpeech("The door is already open");
        return false;
      } else {
        item.set("isOpen", true);
        item.set("source", "img/door_open.png");
        doorUnlockingSound.play();

        sleep(1000).then(() => {
          if (mousehole.get("state") === "dead") {
            generateSpeech(
              "You unlocked the door. You see the mouse's grandnma waiting for him outside. Congrats on solving the escape room and killing the grandson you sick bastard.",
              () => {
                grandmaDeadGrandson.play();
              }
            );
          } else {
            generateSpeech(
              "You unlocked the door. You see the mouse's grandnma waiting for him outside. Congrats on solving the escape room"
            );
          }
        });
        if (mousehole.get("state") === "dead") {
          sleep(8000).then(() => {
            grandmaDeadGrandson.play();
          });
        }
        currentRoom.drawView();
        return true;
      }
    } else {
      generateSpeech("You can't use the key on that");
      return false;
    }
  } else if (object.get("name") == "hammer") {
    if (item.get("name") == "window") {
      if (item.get("isBroken")) {
        generateSpeech(
          "You already tried breaking the window, it won't shatter enough for you to fit through."
        );
        return false;
      } else {
        item.set("isBroken", true);
        item.set("source", "img/window_broken.png");
        windowBreakingSound.play();
        generateSpeech(
          "You broke the window. However, the glass is too strong and won't break completely. You'll need to find another way to get through."
        );
        currentRoom.drawView();
        return false;
      }
    } else if (item.get("name") == "door") {
      if (item.get("isOpen")) {
        generateSpeech("The door is already open");
        return false;
      } else {
        item.set("isOpen", true);
        item.set("source", "img/door_open.png");
        doorUnlockingSound.play();
        generateSpeech(
          "You broke the lock with the hammer unlocked the door! Congrats!"
        );
        currentRoom.drawView();
        return true;
      }
    } else {
      generateSpeech("You can't use the hammer on that");
      return false;
    }
  } else if (object.get("name") == "cheese") {
    if (item.get("name") == "mousehole") {
      if (item.get("state") == "sad") {
        item.set("state", "happy");
        item.set("source", "img/mousehole_happy.png");
        mouseHappySound.play();
        sleep(2000).then(() => {
          generateSpeech(
            "The mouse ate the cheese and thanks you for the cheese. As a reward, it hands you a golden key."
          );
        });
        inventory.addItem(key);
        console.log(key);
        console.log("items:", inventory.get("items"));
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
        mouseCry.play();
        sleep(2000).then(() => {
          generateSpeech(
            "The mouse ate the mashed potatoes and instantly dies."
          );
        });
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
  } else if (object.get("name") == "cat") {
    if (item.get("name") == "mousehole") {
      if (item.get("state") !== "dead") {
        mouseCry.play();
        sleep(2000).then(() => {
          generateSpeech("The cat eats the mouse with no remorse.");
        });
        item.set("state", "dead");
        item.set("source", "img/mousehole_dead.png");
        currentRoom.drawView();
        return true;
      } else {
        generateSpeech(
          "The mouse is already dead. The cat can't kill it again you idiot. "
        );
        return false;
      }
    } else {
      generateSpeech("You can't use the cat on that");
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
