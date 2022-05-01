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
var fridgeUnlockingSound = new Audio("sound/fridge_unlocking.wav");

// UI SETUP
setupUserInterface();

var grabbedItem = false;
var grabbedOffset = [0, 0];

var isGrabbing = false;

// global variables for our game

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

var fridgeKeyObtained = false;

var usedItem = null;

var inConversation = false;

var LEFT = ["left", "love", "live", "alive", "lap"];

var PRESS = [
  "press",
  "price",
  "bass",
  "fast",
  "harass",
  "bratz",
  "fatz",
  "pratt",
  "grass",
  "pass",
];

DEFAULT_CURSOR = "img/capybara.png";
GRAB_CURSOR = "img/cheese.png";
HOVER_CURSOR = "img/cat.png";
FREEZE_CURSOR = "img/clock.png";
OPEN_CURSOR = "img/door_open.png";

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({
  hand: function (hand) {
    //console.log(hand);

    movingRight = hand.palmVelocity[0] > 200;
    movingLeft = hand.palmVelocity[0] < -200;
    movingUp = hand.palmVelocity[1] > 200;
    movingDown = hand.palmVelocity[1] < -200;
    movingForward = hand.palmVelocity[2] > 50;
    movingBackward = hand.palmVelocity[2] < -100;
    //console.log(movingRight, movingLeft, movingUp, movingDown, movingForward, movingBackward);
    // Use the hand data to control the cursor's screen position

    isPointing =
      !hand.fingers[0].extended &&
      hand.fingers[1].extended &&
      !hand.fingers[2].extended &&
      !hand.fingers[3].extended &&
      !hand.fingers[4].extended;

    if (isPointing && hoveredItem == tutorialDoor &&
      tutorialDoor.get("isOpen")) {
      currentRoom.getView().hide();
      currentRoom = room;
      currentRoom.drawView();
    }

    isPinching = hand.pinchStrength > 0.8 && hand.grabStrength < 0.2;
    if (isPinching) {
      console.log("pinching");
    }

    if (isPinching && !cursorFrozen && hoveredItem) {
      transitionZoomIn();
    }

    if (!cursorFrozen) {
      cursorPosition = [
        hand.screenPosition()[0],
        hand.screenPosition()[1] + 400,
      ];
      cursor.setScreenPosition(cursorPosition);
    }

    if (gameState.get("state") == "playing") {
      cursorObject.setContent(DEFAULT_CURSOR);
      if (cursorFrozen) {
        cursorObject.setContent(FREEZE_CURSOR);
      }
      //cursorObject.setProperties({ backgroundColor: "pink" });
      currentRoom.getItems().forEach((item) => {
        if (item.isHovered(cursorPosition)) {
          if (item.get("grabbable")) {
            cursorObject.setContent(GRAB_CURSOR);
            //cursorObject.setProperties({ backgroundColor: "#00ffff" });
          } else if (item.isOpenable()) {
            cursorObject.setContent(OPEN_CURSOR);
          } else {
            cursorObject.setContent(HOVER_CURSOR);
            //cursorObject.setProperties({ backgroundColor: "#66ff33" });
          }
        }
      });

      isGrabbing = hand.grabStrength > 0.7;
      if (isGrabbing) {
        tryGrab();
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

      hoveredItem = getHoveredItem(cursorPosition);
      isPressing =
        isPointing && hoveredItem && hoveredItem.isPressable() && movingForward;
      var isOpening = hand.grabStrength > 0.5 && hand.screenPosition()[2] > 300;
      var isClosing = hand.grabStrength < 0.5 && hand.screenPosition()[2] < 0;
      if (isOpening) {
        tryOpenHoveredItem();
      }
      if (isClosing) {
        tryCloseHoveredItem();
      }
      if (isPressing) {
        tryPressHoveredItem();
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
  currentRoom.getView().removeItem(item);
  currentRoom.drawView();
  if (item == tutorialKey) {
    tutorialWindow2.setText(
      `You found the key!
      Now you can open the door.
      Move to the left by moving your cursor to
      the left of the screen.`
    )
    tutorialWindow1.setText(
      `Try using the key on the door.
      Grab the cursor from your inventory
      and drag it to the door (then release).`
    )
  }
}

function tryGrab() {
  hoveredItem = getHoveredItem(cursor.get("screenPosition"));
  if (hoveredItem && hoveredItem.get("grabbable")) {
    grabItem(hoveredItem);
    generateSpeech("You've just obtained the " + hoveredItem.get("name"));
    return true;
  } else {
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
      currentRoom.getView().removeItem(painting);
      currentRoom.getView().addItem(safe);
      hoveredItem.get("openSound").play();
      currentRoom.drawView();
      generateSpeech("You opened the painting and discovered a safe!");
    } else if (!hoveredItem.get("isLocked")) {
      hoveredItem.open();
    }
    // TODO: fix bug - can get another invisible watermelon
    // after feeding the capybara
    if (
      hoveredItem.get("name") == "fridge" &&
      !inventory.get("items").includes(watermelon) &&
      !fridge.get("isLocked")
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
    } else if (
      hoveredItem.get("name") == "tutorialDrawer" &&
      !drawerFlag
    ) {
      tutorialWindow2.setText(
        `Now try grabbing the key.
        Hover over the key and make a grabbing motion.`);
      generateSpeech("You opened the drawer and a key fell out!");
      drawerFlag = true;
      hoveredItem.open();
      currentRoom.getView().addItem(tutorialKey);
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
    wall1.addItem(yellowHoly);
    wall2.addItem(favNumber);
    wall4.addItem(capybaraClue);
    hoveredItem.set("source", hoveredItem.get("sourceOff"));
    currentRoom.drawView();
  }
}

function tryTurnOnHoveredItem() {
  if (hoveredItem && hoveredItem.isOnable()) {
    yellowHoly.hide();
    favNumber.hide();
    capybaraClue.hide();
    wall1.removeItem(yellowHoly);
    wall2.removeItem(favNumber);
    wall4.removeItem(capybaraClue);
    hoveredItem.get("onSound").play();
    hoveredItem.set("isOn", true);
    lightOn = true;
    currentRoom.turnOnLight();
    console.log("turned on");
    hoveredItem.set("source", hoveredItem.get("sourceOn"));
    currentRoom.drawView();
  }
}

function showHelpScreen() {
  currentRoom.getView().addItem(tutorial);
  currentRoom.drawView();
}

function closeHelpScreen() {
  if (currentRoom.getView().get("items").includes(tutorial)) {
    tutorial.hide();
    currentRoom.getView().removeItem(tutorial);
    currentRoom.drawView();
  }
}

function transitionLeft() {
  currentRoom.transition("left");
}

function transitionRight() {
  currentRoom.transition("right");
}

function transitionZoomOut() {
  currentRoom.transition("zoom_out");
}

function transitionZoomIn() {
  currentRoom.transition("zoom_in");
}

function transitionBye() {
  inConversation = false;
  sleep(1000).then(() => {
    currentRoom.transition("bye");
  });
}

function restartGame() {
  window.location.reload();
  generateSpeech("game restarted");
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

  var processed = false;
  if (inConversation) {
    processed = capybaraSpeechOptions.processSpeech(transcript) | processed;
  }
  if (userSaid(transcript, ["hello", "hi", "hey"])) {
    if (currentRoom.transition("talk")) {
      inConversation = true;
      capybaraSpeechOptions.processSpeech("hello");
    }
    processed = true;
  }

  usedItem = inventory.getInventoryItem(transcript);
  // console.log("screen position", cursor.get("screenPosition"));
  // console.log("hovered item name: ", hoveredItem.get("name"));

  var commands = [
    [LEFT, transitionLeft],
    [["right"], transitionRight],
    [["zoom out", "out"], transitionZoomOut],
    [["bye", "goodbye", "by", "buy"], transitionBye],
    [["stay", "say", "freeze", "breathe"], freezeCursor],
    [["move", "unfreeze"], unfreezeCursor],
    [["grab", "grav"], tryGrab],
    [["open"], tryOpenHoveredItem],
    [["close", "clothes"], tryCloseHoveredItem],
    [["on", "I'm", "aunt"], tryTurnOnHoveredItem],
    [["off", "IHOP", "Off", "call"], tryTurnOffHoveredItem],
    [["help"], showHelpScreen],
    [["back", "exit"], closeHelpScreen],
    [["restart"], restartGame],
    [PRESS, tryPressHoveredItem],
  ];

  for (command of commands) {
    if (userSaid(transcript, command[0])) {
      command[1]();
      processed = true;
    }
  }

  hoveredItem = getHoveredItem(cursorPosition);
  // console.log("hovered item name", hoveredItem.get("name"));
  if (
    userSaid(transcript, ["look", "lock", "luck"]) &&
    hoveredItem &&
    hoveredItem.get("name") === "safe"
  ) {
    processed = true;
    currentRoom.transition("zoom_in");
    //zoomInObject(hoveredItem);
  } else if (hoveredItem && usedItem) {
    processed = true;
    tryUseItem();
  }

  return processed;
};

function tryUseItem() {
  if (hoveredItem && usedItem) {
    var objectWasUsed = useObjectOnItem(usedItem, hoveredItem);
    if (objectWasUsed) {
      usedItem.hide();
      inventory.removeItem(usedItem, 1);
      inventory.draw();
    }
    return true;
  } else {
    return false;
  }
}

function tryPressHoveredItem() {
  if (
    hoveredItem &&
    hoveredItem.isPressable() &&
    !hoveredItem.get("isPressed")
  ) {
    registerPress(hoveredItem);
  }
}

function registerPress(item) {
  //item.get("pressSound").play();
  item.set("isPressed", true);
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
  } else if (passwordSafe.length < 3 && item.get("name") !== "button_delete") {
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

function getHoveredItem(cursorPosition) {
  hoveredItems = currentRoom.getItems().filter(function (item) {
    return item.isHovered(cursorPosition) && !item.get("isLocked");
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

function useItemHandler(item_, target_, handler) {
  return function (item, target) {
    if (item == item_ && target == target_) {
      // handler(item, target);
      console.log("wtfffff");
      return [true, handler(item, target)]; // true stands for item could be used but could still be inventory, second argument means if it returns to the inventory, true means don't return to inventory
    } else {
      return [false, false];
    }
  };
}

function useKeyOnDoor(object, item) {
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
}

function useKeyOnTutorialDoor(object, item) {
  if (item.get("isOpen")) {
    generateSpeech("The door is already open");
    return false;
  } else {
    item.set("isOpen", true);
    item.setContent("img/door_open.png");
    doorUnlockingSound.play();
    tutorialWindow1.setText(
      `Congratulations! 
      You have escaped the tutorial room.
      Now you're ready to start the game.`);
    currentRoom.drawView();
    return true;
  }
}

function useCheeseOnMousehole(object, item) {
  if (item.get("state") == "sad") {
    item.set("state", "happy");
    item.setContent("img/mousehole_happy.png");
    mouseHappySound.play();
    fridgeKeyObtained = true;
    sleep(2000).then(() => {
      generateSpeech(
        "The mouse ate the cheese and thanks you. As a reward, it hands you a small black key."
      );
    });
    inventory.addItem(fridge_key);
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
}

function useFridgeKeyOnFridgeLock(object, item) {
  fridge_lock.hide();
  fridge.set("isLocked", false);
  currentRoom.getView().removeItem(fridge_lock);
  fridgeUnlockingSound.play();

  sleep(1000).then(() => {
    generateSpeech("You unlocked the fridge");
  });
  currentRoom.drawView();
  return true;
}

function useHammerOnWindow(object, item) {
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
      "You broke the window. However, the hole you made is too small for you to fit through. You'll need to find another way to get through."
    );
    currentRoom.drawView();
    return false;
  }
}

function useWatermelonOnCapybara(object, item) {
  watermelonEating.play();
  sleep(2000).then(() => {
    generateSpeech(
      "The capybara ate the watermelon and thanks you. He gives you permission to pet and hold him."
    );
  });
  item.set("grabbable", true);
  currentRoom.drawView();
  return true;
}

function useCapybaraOnWindow(object, item) {
  if (item.get("isBroken")) {
    door.set("isOpen", true);
    door.setContent("img/door_open.png");
    doorUnlockingSound.play();
    generateSpeech(
      "The capybara jumped out through the window and opened the door from the outside. Congrats on solving the escape room and reuniting the grandma with her grandson!"
    );
    currentRoom.transition("right");
    return true;
  }
}

function useCatOnMousehole(object, item) {
  if (item.get("state") !== "dead") {
    mouseCry.play();
    if (!fridgeKeyObtained) {
      sleep(2000).then(() => {
        generateSpeech(
          "The cat eats the mouse with no remorse. You'll haves to start over",
          window.location.reload()
        );
      });
    } else {
      sleep(2000).then(() => {
        generateSpeech("The cat eats the mouse with no remorse.");
      });
    }
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
}

function useMashedPotatoesOnMousehole(object, item) {
  if (item.get("state") !== "dead") {
    mouseCry.play();
    if (!fridgeKeyObtained) {
      generateSpeech(
        "The mouse ate the mashed potatoes and dies. You'll have to start over.",
        window.location.reload()
      );
    } else {
      sleep(2000).then(() => {
        generateSpeech("The mouse ate the mashed potatoes and instantly dies.");
      });
    }
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
}

function useFlashlightOnYellowHoly(object, item) {
  yellowHoly.hide();
  wall1.removeItem(yellowHoly);
  currentRoom.drawView();
  return false;
}

function useFlashlightOnFavNumber(object, item) {
  favNumber.hide();
  wall2.removeItem(favNumber);
  currentRoom.drawView();
  return false;
}

function useFlashlightOnCapybaraClue(object, item) {
  capybaraClue.hide();
  wall4.removeItem(capybaraClue);
  currentRoom.drawView();
  return false;
}

// returns true if object was used (doesn't return to inventory), false otherwise
function useObjectOnItem(object, item) {
  let r = false;
  let itemHandlers = [
    useItemHandler(tutorialKey, tutorialDoor, useKeyOnTutorialDoor),
    useItemHandler(key, door, useKeyOnDoor),
    useItemHandler(cheese, mousehole, useCheeseOnMousehole),
    useItemHandler(fridge_key, fridge_lock, useFridgeKeyOnFridgeLock),
    useItemHandler(hammer, windowLarge, useHammerOnWindow),
    useItemHandler(watermelon, capybara, useWatermelonOnCapybara),
    useItemHandler(capybara, windowLarge, useCapybaraOnWindow),
    useItemHandler(cat, mousehole, useCatOnMousehole),
    useItemHandler(mashedPotatoes, mousehole, useMashedPotatoesOnMousehole),
    useItemHandler(flashlight, yellowHoly, useFlashlightOnYellowHoly),
    useItemHandler(flashlight, favNumber, useFlashlightOnFavNumber),
    useItemHandler(flashlight, capybaraClue, useFlashlightOnCapybaraClue),
  ];
  var wasUsed = false;
  for (handler of itemHandlers) {
    result = handler(object, item);
    if (result[0]) {
      console.log("hiiii");
      wasUsed = true;
    }
    if (result[1]) {
      console.log("noooo");
      return true;
    }
  }
  if (!wasUsed) {
    generateSpeech(
      "Can't use the " + object.get("name") + " on the " + item.get("name")
    );
  }

  return false;
}
