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

// MAIN GAME LOOP
// Called every time the Leap provides a new frame of data
Leap.loop({
  hand: function (hand) {
    // Clear any highlighting at the beginning of the loop
    unhighlightTiles();

    // 4.1, Moving the cursor with Leap data
    // Use the hand data to control the cursor's screen position
    var cursorPosition = [
      hand.screenPosition()[0],
      hand.screenPosition()[1] + 300,
    ];
    // console.log('cursorPosition: ', cursorPosition);
    cursor.setScreenPosition(cursorPosition);

    // 4.1f
    // Get the tile that the player is currently selecting, and highlight it
    selectedTile = getIntersectingTile(cursorPosition);
    if (selectedTile) {
      highlightTile(selectedTile, Colors.GREEN);
    }

    // SETUP mode
    if (gameState.get("state") == "setup") {
      background.setContent(
        "<h1>battleship</h1><h3 style='color: #7CD3A2;'>deploy ships</h3>"
      );
      //  4.2, Deploying ships
      //  Enable the player to grab, move, rotate, and drop ships to deploy them

      // First, determine if grabbing pose or not
      isGrabbing = false;

      cursorObject.setProperties({ backgroundColor: "pink" });
      currentRoom
        .getView()
        .get("items")
        .forEach((item) => {
          if (item.isHovered(cursorPosition)) {
            cursorObject.setProperties({ backgroundColor: "green" });
          }
        });

      if (hand.grabStrength > 0.5) {
        isGrabbing = true;
        console.log("isGrabbing");
      }
    }
  },
}).use("screenPosition", { scale: LEAPSCALE });

// processSpeech(transcript)
//  Is called anytime speech is recognized by the Web Speech API
// Input:
//    transcript, a string of possibly multiple words that were recognized
// Output:
//    processed, a boolean indicating whether the system reacted to the speech or not
var processSpeech = function (transcript) {
  // Helper function to detect if any commands appear in a string
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
    var hoveredItem = getHoveredItem(cursor.get("screenPosition"));
    if (userSaid(transcript, ["look"]) && hoveredItem) {
      isZoomedIn = true;
      processed = true;
      zoomedInObject = hoveredItem;
      zoomInObject(hoveredItem);
    }
    if (userSaid(transcript, ["zoom out"]) && isZoomedIn) {
      isZoomedIn = false;
      processed = true;
      zoomedInObject = false;
      goToWall(currentWall);
    }
    if (
      userSaid(transcript, ["grab"]) &&
      hoveredItem &&
      hoveredItem.grabbable
    ) {
      isZoomedIn = true;
      processed = true;
      inventoryObjects.push(hoveredItem);
      zoomInObject(hoveredItem);
      console.log("grabbed object");
    }
    if (hoveredItem && getInventoryItemIndice(transcript)) {
      processed = true;
      useObjectOnItem(
        inventoryObjects[getInventoryItemIndice(transcript)],
        hoveredItem
      );
      inventoryObjects.splice(getInventoryItemIndice(transcript), 1);
    }

    console.log("currentWall: ", currentWall);
  } else if (gameState.get("state") == "playing") {
    if (gameState.isPlayerTurn()) {
      // 4.4, Player's turn
      // Detect the 'fire' command, and register the shot if it was said
      if (userSaid(transcript, ["fire", "Fire"])) {
        registerPlayerShot();

        processed = true;
      }
    } else if (gameState.isCpuTurn() && gameState.waitingForPlayer()) {
      // 4.5, CPU's turn
      // Detect the player's response to the CPU's shot: hit, miss, you sunk my ..., game over
      // and register the CPU's shot if it was said
      if (
        userSaid(transcript, [
          "hit",
          "Hit",
          "miss",
          "Miss",
          "you sunk my",
          "game over",
        ])
      ) {
        var response;
        if (userSaid(transcript, ["hit", "Hit"])) {
          response = "hit";
        } else if (userSaid(transcript, ["miss", "Miss"])) {
          response = "miss";
        } else if (userSaid(transcript, ["you sunk my"])) {
          response = "you sunk my";
        } else {
          response = "game over";
        }
        registerCpuShot(response);

        processed = true;
      }
    }
  }

  return processed;
};

var playerMissCountStreak = 0;
// 4.4, Player's turn
// Generate CPU speech feedback when player takes a shot
var registerPlayerShot = function () {
  // CPU should respond if the shot was off-board
  if (!selectedTile) {
    generateSpeech("shot was off-board! Please try again you idiot"); // not sure???
  }

  // If aiming at a tile, register the player's shot
  else {
    var shot = new Shot({ position: selectedTile });
    var result = cpuBoard.fireShot(shot);

    // Duplicate shot
    if (!result) return;

    // Generate CPU feedback in three cases
    // Game over
    if (result.isGameOver) {
      winSound.play();
      gameState.endGame("player");
      var winPhrases = [
        "game over. Congrats! Totally not salty at all.",
        "Game over. Jokes on you because I was pretending to be bad this whole time to let you win for once in your pathetic life.",
      ];
      sleep(2000).then(() => {
        generateSpeech(getRandomPhrase(winPhrases));
      });
      return;
    }
    // Sunk ship
    else if (result.sunkShip) {
      var shipName = result.sunkShip.get("type");
      sunkSound.play();
      generateSpeech("you sunk my " + shipName);
    }
    // Hit or miss
    else {
      var isHit = result.shot.get("isHit");
      if (isHit) {
        hitSound.play();
        if (playerMissCountStreak > 3) {
          blinkAllTiles();
          generateSpeech("Wow. It's about time you hit my ship. Good job.");
          sleep(500).then(() => {
            unblinkTiles();
          });
        } else {
          var hitPhrases = ["Dang it", "How dare you"];
          blinkAllTiles();
          generateSpeech("hit. " + getRandomPhrase(hitPhrases));
          sleep(500).then(() => {
            unblinkTiles();
          });
        }
        playerMissCountStreak = 0;
      } else {
        missSound.play();
        if (playerMissCountStreak > 3) {
          var missPhrases = [
            "Dang you really suck at this game! How did you get into MIT",
            "I'm pretty sure MIT made a mistake when they admitted you like damn how could someone be this bad",
          ];
          generateSpeech(getRandomPhrase(missPhrases));
        } else if (playerMissCountStreak > 2) {
          generateSpeech(
            "Damn you suck at this game! hahaha and I'm not even a real human."
          );
        } else {
          var missPhrases = [
            "oops! you missed!",
            "better luck next time!",
            "nice try buddy",
          ];
          generateSpeech(getRandomPhrase(missPhrases));
        }
        playerMissCountStreak += 1;
      }
    }

    if (!result.isGameOver) {
      // Uncomment nextTurn to move onto the CPU's turn
      nextTurn();
    }
  }
};

// 4.5, CPU's turn
// Generate CPU shot as speech and blinking
var cpuShot;
var generateCpuShot = function () {
  // Generate a random CPU shot
  cpuShot = gameState.getCpuShot();
  var tile = cpuShot.get("position");
  var rowName = ROWNAMES[tile.row]; // e.g. "A"
  var colName = COLNAMES[tile.col]; // e.g. "5"

  // Generate speech and visual cues for CPU shot
  generateSpeech("fire " + rowName + " " + colName);
  blinkTile(tile);
};

var cpuMissCountStreak = 0;
// 4.5, CPU's turn
// Generate CPU speech in response to the player's response
// E.g. CPU takes shot, then player responds with "hit" ==> CPU could then say "AWESOME!"
var registerCpuShot = function (playerResponse) {
  // Cancel any blinking
  unblinkTiles();
  var result = playerBoard.fireShot(cpuShot);

  // NOTE: Here we are using the actual result of the shot, rather than the player's response
  // In 4.6, you may experiment with the CPU's response when the player is not being truthful!

  // Generate CPU feedback in three cases
  // Game over
  if (result.isGameOver) {
    if (playerResponse !== "game over") {
      blinkAllTiles();
      generateSpeech("I know you just lost, you liar! Nice try bro.");
      sleep(3000).then(() => {
        unblinkTiles();
      });
    }
    lostSound.play();
    gameState.endGame("cpu");
    var losePhrases = [
      "game over. Good job to me!",
      "I win! Ha you suck and I'm not even human!",
      "Yes I won. How does it feel to lose to a dumb robot?",
    ];
    sleep(2000).then(() => {
      generateSpeech(getRandomPhrase(losePhrases));
    });
    return;
  }
  // Sunk ship
  else if (result.sunkShip) {
    var shipName = result.sunkShip.get("type");
    if (playerResponse !== "you sunk my") {
      sunkSound.play();
      blinkAllTiles();
      generateSpeech(
        "Wow trying to lie to me I see. I know I just sunk your " +
          shipName +
          "ok. Don't even try."
      );
      sleep(3000).then(() => {
        unblinkTiles();
      });
    } else {
      sunkSound.play();
      generateSpeech("Yay I sunk your " + shipName);
    }
  }
  // Hit or miss
  else {
    var isHit = result.shot.get("isHit");
    if (isHit) {
      if (playerResponse !== "hit") {
        hitSound.play();
        blinkAllTiles();
        generateSpeech("bro I know you lying. I know I just hit your ship ok?");
        sleep(3000).then(() => {
          unblinkTiles();
        });
      } else if (cpuMissCountStreak > 3) {
        hitSound.play();
        blinkAllTiles();
        generateSpeech("Finally!! It's about time I hit your stupid ship!");
        sleep(500).then(() => {
          unblinkTiles();
        });
      } else {
        hitSound.play();
        blinkAllTiles();
        generateSpeech("Awesome! Haha I'm so good");
        sleep(500).then(() => {
          unblinkTiles();
        });
      }
      cpuMissCountStreak = 0;
    } else {
      missSound.play();
      cpuMissCountStreak += 1;
      if (playerResponse !== "miss") {
        blinkAllTiles();
        generateSpeech(
          "Why would you even lie about it being a miss LOL. Trying to help me win? how sweet!"
        );
        sleep(3000).then(() => {
          unblinkTiles();
        });
      } else if (cpuMissCountStreak > 3) {
        var missPhrases = [
          "You gotta be freaking kidding me. How is this even possible.",
          "Oh my gosh, I hate this game so freaking much.",
          "I swear this game is rigged. There's no way I'm this bad",
        ];
        generateSpeech(getRandomPhrase(missPhrases));
      } else if (cpuMissCountStreak > 2) {
        generateSpeech("Gosh darn it. How am I so bad a this stupid game");
      } else {
        var missPhrases = [
          "Aw dang it, I thought it was gonna be a hit",
          "Darn it. I was so sure the ship was there what the heck",
        ];
        generateSpeech(getRandomPhrase(missPhrases));
      }
    }
  }

  if (!result.isGameOver) {
    // move onto the player's next turn
    nextTurn();
  }
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
  for (item of currentRoom.getView().get("items")) {
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
    if (transcript.includes(inventoryObjects[i].name.toLowerCase())) {
      return i;
    }
  }
  return -1;
}

function useObjectOnItem(object, item) {
  if (object.name == "key") {
    if (item.name == "door") {
      if (item.get("isOpen")) {
        generateSpeech("The door is already open");
      } else {
        item.set("isOpen", true);
        generateSpeech("You unlocked the door");
      }
    } else {
      generateSpeech("You can't use the key on that");
    }
  } else if (object.name == "cheese") {
    if (item.name == "mousehole") {
      if (item.get("state") == "sad") {
        item.set("state", "happy");
        generateSpeech(
          "The mouse ate the cheese and thanks you for the cheese."
        );
      } else if (item.get("state") == "happy") {
        generateSpeech("The mouse is already happy");
      } else if (item.get("state") == "dead") {
        generateSpeech(
          "The mouse is dead. It can't eat the cheese anymore you idiot."
        );
      }
    } else {
      generateSpeech("You can't use the cheese on that");
    }
  } else if (object.name == "mashed potatoes") {
    if (item.name == "mousehole") {
      if (item.get("state") !== "dead") {
        item.set("state", "dead");
        generateSpeech("The mouse ate the mashed potatoes and instantly dies.");
      } else {
        generateSpeech(
          "The mouse is already dead. It can't eat the mashed potatoes anymore you idiot. "
        );
      }
    } else {
      generateSpeech("You can't use the mashed potatoes on that");
    }
  } else {
    generateSpeech("You can't use " + object.name + " on " + item.name);
  }
}
