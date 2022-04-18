// GAME SETUP
var initialState = "playing";
var gameState = new GameState({ state: initialState });
var cursor = new Cursor();
var windowBreakingSound = new Audio("sound/break_window.mp3");
var doorUnlockingSound = new Audio("sound/door_unlock.mp3");
var mouseCry = new Audio("sound/mouse_cry.mp3");
var mouseHappySound = new Audio("sound/mouse_happy.m4a");
var grandmaDeadGrandson = new Audio("sound/grandma.m4a");
var watermelonEating = new Audio("sound/watermelon_eating.mp3");
var safeUnlock = new Audio("sound/safe_unlock.mp3");
var safeBeep = new Audio("sound/safe_beep.mp3");
var safeIncorrect = new Audio("sound/safe_incorrect.mp3");
var safeDelete = new Audio("sound/safe_delete.mp3");

// UI SETUP
setupUserInterface();

var grabbedItem = false;
var grabbedOffset = [0, 0];

var isGrabbing = false;

// global variables for our game
var currentRoom = room;
var isZoomedIn = false;
var zoomedInObject = false;

var isHovering = false; // if hovering over some object
var hoveringObject = null; // object hovering over
var disableTransition = true;
var elapsedFrames = 0;
var cursorFrozen = false;
var hoveredItem = null;
var lightOn = true;

var cursorPosition = [0, 0];
var passwordSafe = "";

var movingForward = false;
var movingBackward = false;
var movingUp = false;
var movingDown = false;
var movingLeft = false;
var movingRight = false;

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({
  hand: function (hand) {
    //console.log(hand);

    movingRight = hand.palmVelocity[0] > 200;
    movingLeft = hand.palmVelocity[0] < -200;
    movingUp = hand.palmVelocity[1] > 200;
    movingDown = hand.palmVelocity[1] < -200;
    movingForward = hand.palmVelocity[2] > 200;
    movingBackward = hand.palmVelocity[2] < -200;
    console.log(movingRight, movingLeft, movingUp, movingDown, movingForward, movingBackward);
    // Use the hand data to control the cursor's screen position

    isPointing =
      !hand.fingers[0].extended &&
      hand.fingers[1].extended &&
      !hand.fingers[2].extended &&
      !hand.fingers[3].extended &&
      !hand.fingers[4].extended;

    if (isPointing) {
      //console.log("pointing");
    }
    // point to press button
    if (isPointing && hoveredItem && hoveredItem.isPressable()) {
      console.log("pointing at pressable key");
      hoveredItem.set("isPressed", true);
      registerPress(hoveredItem);
    }

    // pinch to zoom in
    if (
      !isZoomedIn &&
      hand.pinchStrength > 0.8 &&
      hand.grabStrength < 0.2 &&
      !cursorFrozen &&
      hoveredItem &&
      !hoveredItem.get("isHidden")
    ) {
      isZoomedIn = true;
      processed = true;
      zoomedInObject = hoveredItem;
      currentRoom.transition("zoom_in");
    }

    if (!cursorFrozen) {
      cursorPosition = [
        hand.screenPosition()[0],
        hand.screenPosition()[1] + 400,
      ];
      cursor.setScreenPosition(cursorPosition);
    }

    // SETUP mode
    if (gameState.get("state") == "playing") {
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
        //console.log("isGrabbing");
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
      // console.log("hand screen position" + hand.screenPosition());
      // if (hand.screenPosition()[2] < 0) {
      //   console.log("hand below zero");
      // }
      hoveredItem = getHoveredItem(cursorPosition);
      var isOpening = hand.grabStrength > 0.5 && hand.screenPosition()[2] > 300;
      var isClosing = hand.grabStrength < 0.5 && hand.screenPosition()[2] < 0;
      if (isOpening) {
        tryOpenHoveredItem();
      }
      if (isClosing) {
        tryCloseHoveredItem();
      }

      if (!grabbedItem && isGrabbing) {
        // detect if they are grabbing an inventory item
        grabbedItem = inventory.getHoveredItem(cursorPosition);
        if (grabbedItem) {
          var itemPosition = grabbedItem.get("position");
          grabbedOffset = vectorSub(cursorPosition, itemPosition);
          grabbedItem.set("holding", true);
        }
      } else if (grabbedItem && isGrabbing) {
        var itemPosition = vectorSub(cursorPosition, grabbedOffset);
        grabbedItem.set("position", itemPosition);
        // move the item
      } else if (grabbedItem && !isGrabbing) {
        // check if they can use the item

        if (hoveredItem) {
          var objectWasUsed = useObjectOnItem(grabbedItem, hoveredItem);
          if (objectWasUsed) {
            grabbedItem.hide();
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
  hoveredItem = getHoveredItem(cursor.get("screenPosition"));
  if (hoveredItem && hoveredItem.get("grabbable")) {
    grabItem(hoveredItem);
    generateSpeech("You've just obtained the " + hoveredItem.get("name"));
    return true;
  } else {
    // generateSpeech("oops, please try again");
    return false;
  }
}

function freezeCursor() {
  cursorFrozen = true;
}

function unfreezeCursor() {
  cursorFrozen = false;
}

function tryOpenHoveredItem() {
  if (hoveredItem && hoveredItem.isOpenable()) {
    if (hoveredItem.get("name") == "painting") {
      painting.hide();
      safe.appear();
      currentRoom.getView().removeItem(painting);
      hoveredItem.get("openSound").play();
      generateSpeech("You opened the painting and discovered a safe!");
    } else {
      hoveredItem.open();
    }
    if (
      hoveredItem.get("name") == "fridge" &&
      !inventory.get("items").includes(watermelon)
    ) {
      inventory.addItem(watermelon);
      generateSpeech(
        "You opened the fridge and obtained a piece of watermelon"
      );
      currentRoom.drawView();
    } else if (
      hoveredItem.get("name") == "dresser" &&
      !inventory.get("items").includes(flashlight)
    ) {
      inventory.addItem(flashlight);
      generateSpeech("You opened the dresser and obtained a flashlight");
      currentRoom.drawView();
    }
  }
}

function tryCloseHoveredItem() {
  if (hoveredItem && hoveredItem.isClosable()) {
    hoveredItem.close();
  }
}

function tryTurnOffHoveredItem() {
  if (hoveredItem && hoveredItem.isOffable()) {
    hoveredItem.get("offSound").play();
    hoveredItem.set("isOn", false);
    lightOn = false;
    currentRoom.turnOffLight();
    hoveredItem.set("source", hoveredItem.get("sourceOff"));
    currentRoom.drawView();
  }
}

function tryTurnOnHoveredItem() {
  if (hoveredItem && hoveredItem.isOnable()) {
    hoveredItem.get("onSound").play();
    hoveredItem.set("isOn", true);
    lightOn = true;
    currentRoom.turnOnLight();
    hoveredItem.set("source", hoveredItem.get("sourceOn"));
    currentRoom.drawView();
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
    var usedItem = inventory.getInventoryItem(transcript);
    // console.log("screen position", cursor.get("screenPosition"));
    // console.log("hovered item name: ", hoveredItem.get("name"));

    var commands = [
      [["stay", "freeze"], freezeCursor],
      [["move", "unfreeze"], unfreezeCursor],
      [["grab"], tryGrab],
      [["open"], tryOpenHoveredItem],
      [["close"], tryCloseHoveredItem],
      [["on"], tryTurnOnHoveredItem],
      [["off"], tryTurnOffHoveredItem],
    ];

    for (command of commands) {
      if (userSaid(transcript, command[0])) {
        command[1]();
        processed = true;
      }
    }

    hoveredItem = getHoveredItem(cursorPosition);
    // console.log("hovered item name", hoveredItem.get("name"));
    if (userSaid(transcript, ["look"]) && hoveredItem) {
      isZoomedIn = true;
      processed = true;
      zoomedInObject = hoveredItem;
      currentRoom.transition("zoom_in");
      //zoomInObject(hoveredItem);
    } else if (hoveredItem && usedItem) {
      processed = true;
      var objectWasUsed = useObjectOnItem(usedItem, hoveredItem);
      if (objectWasUsed) {
        usedItem.hide();
        inventory.removeItem(usedItem, 1);
        inventory.draw();
      }
    }
  } else {
    hoveredItem = getHoveredItem(cursorPosition);
    if (userSaid(transcript, ["zoom out", "out"])) {
      isZoomedIn = false;
      processed = true;
      currentRoom.transition("zoom_out");
      zoomedInObject = false;
    } else if (
      userSaid(transcript, 
        ["press", "price", "bass", "fast", "harass", "bratz", "fatz", "pratt", "grass", "pass"]) &&
      hoveredItem &&
      hoveredItem.isPressable()
    ) {
      processed = true;
      console.log("hiaaaaa");
      registerPress(hoveredItem);
    }
  }
  return processed;
};

function registerPress(item) {
  // if (item.get("pressable")) {
  // item.get("pressSound").play();
  // item.set("isPressed", true);
  if (item.get("name") == "button_delete" && passwordSafe.length > 0) {
    console.log("deleted character");
    safeDelete.play();
    passwordSafe = passwordSafe.slice(0, -1);
    console.log(passwordSafe);
    safe_screen.get("context").setContent(passwordSafe);
    currentRoom.drawView();
  } else if (item.get("name") == "button_enter" && passwordSafe.length >= 3) {
    if (passwordSafe == "245") {
      console.log("correct password");
      safe_screen.get("context").setContent(passwordSafe);
      safeUnlock.play();
      generateSpeech("Congrats! you unlocked the safe and obtained a hammer.");
      currentRoom.transition("zoom_out");
      inventory.addItem(hammer);
      currentRoom.drawView();
    } else {
      console.log("incorrect password");
      safe_screen.get("context").setContent(passwordSafe);
      safeIncorrect.play();
      generateSpeech(
        "wrong password. Please try again",
        safe_screen.get("context").setContent("")
      );
      passwordSafe = "";
      currentRoom.drawView();
    }
  } else if (item.get("name") == "button_enter" && passwordSafe.length < 3) {
    console.log("not enough characters");
    safeIncorrect.play();
    generateSpeech("not enough characters. Please try again");
    passwordSafe = "";
    safe_screen.get("context").setContent(passwordSafe);
    currentRoom.drawView();
  } else if (passwordSafe.length < 3) {
    passwordSafe += item.get("number").toString();
    safe_screen.get("context").setContent(passwordSafe);
    console.log(passwordSafe);
    safeBeep.play();
    currentRoom.drawView();
  }
  for (let button of [
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
  ]) {
    if (button !== item) {
      button.set("isPressed", false);
    }
  }
  // }
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
  hoveredItems = currentRoom.getItems().filter(function (item) {
    return item.isHovered(cursorPosition) && item.get("isHidden") == false;
  });
  grabbableHoveredItems = hoveredItems.filter(function (item) {
    return item.get("grabbable");
  });
  if (grabbableHoveredItems.length > 0) {
    return grabbableHoveredItems[0];
  } else if (hoveredItems.length > 0) {
    return hoveredItems[0];
  } else {
    return false;
  }
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
        item.setContent("img/door_open.png");
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
      generateSpeech(
        "You can't use the " +
          object.get("name") +
          " on the " +
          item.get("name")
      );
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
        item.setContent("img/window_broken.png");
        windowBreakingSound.play();
        generateSpeech(
          "You broke the window. However, the hole you made is too small for you to fit through. Should have gone to less boba events bro. You'll need to find another way to get through."
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
        item.setContent("img/door_open.png");
        doorUnlockingSound.play();
        generateSpeech(
          "You broke the lock with the hammer unlocked the door! Congrats on solving the escape room and reuniting the grandma with her grandson!"
        );
        currentRoom.drawView();
        return true;
      }
    } else {
      generateSpeech(
        "You can't use the " +
          object.get("name") +
          " on the " +
          item.get("name")
      );
      return false;
    }
  } else if (object.get("name") == "cheese") {
    if (item.get("name") == "mousehole") {
      if (item.get("state") == "sad") {
        item.set("state", "happy");
        item.setContent("img/mousehole_happy.png");
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
      generateSpeech(
        "You can't use the " +
          object.get("name") +
          " on the " +
          item.get("name")
      );
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
        item.setContent("img/mousehole_dead.png");
        currentRoom.drawView();
        return true;
      } else {
        generateSpeech(
          "The mouse is already dead. It can't eat the mashed potatoes anymore you idiot. "
        );
        return false;
      }
    } else {
      generateSpeech(
        "You can't use the " +
          object.get("name") +
          " on the " +
          item.get("name")
      );
      return false;
    }
  } else if (object.get("name") == "watermelon") {
    if (item.get("name") == "capybara") {
      watermelonEating.play();
      sleep(2000).then(() => {
        generateSpeech(
          "The capybara ate the watermelon and thanks you. He gives you permission to pet and hold him. You've just made a friend!"
        );
      });
      item.set("grabbable", true);
      currentRoom.drawView();
      return true;
    } else {
      generateSpeech(
        "You can't use the " +
          object.get("name") +
          " on the " +
          item.get("name")
      );
      return false;
    }
  } else if (object.get("name") == "capybara") {
    if (item.get("name") == "window" && item.get("isBroken")) {
      // watermelonEating.play();
      // sleep(2000).then(() => {
      door.set("isOpen", true);
      door.setContent("img/door_open.png");
      doorUnlockingSound.play();
      generateSpeech(
        "The capybara jumped out through the window and opened the door from the outside for you. Congrats on solving the escape room and reuniting the grandma with her grandson!"
      );
      // });

      currentRoom.transition("right");
      return true;
    } else {
      generateSpeech(
        "You can't use the " +
          object.get("name") +
          " on the " +
          item.get("name")
      );
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
        item.setContent("img/mousehole_dead.png");
        currentRoom.drawView();
        return true;
      } else {
        generateSpeech(
          "The mouse is already dead. The cat can't kill it again you idiot. "
        );
        return false;
      }
    } else {
      generateSpeech(
        "You can't use the " +
          object.get("name") +
          " on the " +
          item.get("name")
      );
      return false;
    }
  } else {
    generateSpeech(
      "You can't use the " + object.get("name") + " on the " + item.get("name")
    );
    return false;
  }
  return true;
}
