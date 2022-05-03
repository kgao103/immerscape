var Cursor = Backbone.Model.extend({
  defaults: {
    screenPosition: [0, 0],
  },
  setScreenPosition: function (position) {
    this.set("screenPosition", position.slice(0));
  },
});

var GameState = Backbone.Model.extend({
  defaults: {
    state: "playing",
  },
});

var View = Backbone.Model.extend({
  defaults: {
    background: "",
    background_dark: "",
    isDark: false,
    items: [],
    special: [],
  },
  removeItem: function (item) {
    let items = this.get("items");
    let index = items.indexOf(item);
    if (index > -1) {
      items.splice(index, 1);
      this.set("items", items);
      return item;
    } else {
      console.log("item not found");
      return null;
    }
  },

  addItem: function (item) {
    let items = this.get("items");
    items.push(item);
    this.set("items", items);
    console.log(this.get("items"));
  },

  hide: function () {
    this.get("items").forEach((item) => {
      item.hide();
    });
    this.get("special").forEach((item) => {
      item.hide();
    });
  },
});

speechBubble1 = new Item({
  text: "",
  position: [window.innerWidth * 0.18, window.innerHeight * 0.05],
  size: [window.innerWidth * 0.4, window.innerHeight * 0.55],
  opacity: 1,
  properties: {
    backgroundImage: "url(img/speech_bubble.webp)",
    backgroundSize: "100% 100%",
    color: "black",
    zIndex: 95,
    fontSize: "20px",
    padding: window.innerWidth * 0.07 + "px",
    fontFamily: "Trebuchet MS",
  },
});

function restartRecognition() {
  recognitionDisabled = false;
  recognition.start();
}

var Conversation = Backbone.Model.extend({
  defaults: {
    content: "",
    context: null,
    npcContext: speechBubble1,
    subcontext: [],
    rendered: false,
    opacity: 0,
    speechOptions: [
      "Why is the MOUSE so sad?",
      "Are there any SECRETS?",
      "What is the SAFE CODE?",
      "( Try asking about something else!)",
      "Goodbye!",
    ],
  },

  processSpeech(transcript) {
    let speechOptions = this.get("speechOptions");
    console.log("speechOptions", speechOptions);
    response = null;
    if (
      userSaid(transcript, [
        "mouse",
        "Mouse",
        "miles",
        "now",
        "rat",
        "mouth",
        "maps",
      ])
    ) {
      response =
        "Oh my friend STEVE the mouse has been craving some CHEESE to go with his grapes for days. Poor Steve.";
      this.set("speechOptions", [
        "Who is STEVE?",
        "Are there any SECRETS?",
        "What is the SAFE CODE?",
        "Oh where can I find some CHEESE?",
        "Goodbye!",
      ]);
      this.updateOptions();
    } else if (userSaid(transcript, ["safe", "code", "save"])) {
      response =
        "I don't remember all of it but I think it starts with the number two. Might be helpful to turn off the light";
    } else if (userSaid(transcript, ["bye", "by", "goodbye", "my"])) {
      response = "Adios!";
    } else if (userSaid(transcript, ["hello", "hi", "hey", "hallo"])) {
      response = "Hola. I'm Crappy, the capybara. How can I help you?";
    } else if (userSaid(transcript, ["cheese"])) {
      response = "I think you can find some on top of the FRIDGE";
    } else if (userSaid(transcript, ["fridge", "fresh", "Fred's"])) {
      response =
        "My friend STEVE might have taken the fridge key the other day";
      this.set("speechOptions", [
        "How do I get him to give me the KEY",
        "Who is STEVE?",
        "Are there any SECRETS?",
        "What is the SAFE CODE?",
        "Goodbye!",
      ]);
      this.updateOptions();
    } else if (userSaid(transcript, ["key"])) {
      response =
        "I think STEVE will give it to you if you give him some CHEESE";
      this.set("speechOptions", [
        "Who is STEVE?",
        "Oh where can I find some CHEESE?",
        "Are there any SECRETS?",
        "What is the SAFE CODE?",
        "Goodbye!",
      ]);
      this.updateOptions();
    } else if (userSaid(transcript, ["Steve", "steve"])) {
      response = "Oh STEVE is my friend the MOUSE!";
      this.set("speechOptions", [
        "Why is the MOUSE so sad?",
        "Are there any SECRETS?",
        "What is the SAFE CODE?",
        "Goodbye!",
      ]);
      this.updateOptions();
    } else if (userSaid(transcript, ["hungry", "food"])) {
      response = "I've been craving some WATERMELON. Can you get me some?";
      this.set("speechOptions", [
        "Where can I find some WATERMELON?",
        "Why is the MOUSE so sad?",
        "Are there any SECRETS?",
        "What is the SAFE CODE?",
        "Goodbye!",
      ]);
      this.updateOptions();
    } else if (userSaid(transcript, ["watermelon"])) {
      response = "I think there might be some in the FRIDGE actually";
      this.set("speechOptions", [
        "How do I open the FRIDGE?",
        "Why is the MOUSE so sad?",
        "Are there any SECRETS?",
        "What is the SAFE CODE?",
        "Goodbye!",
      ]);
      this.updateOptions();
    } else if (userSaid(transcript, ["secret", "secrets", "Secret"])) {
      response = "Try opening some of the paintings";
      this.set("speechOptions", [
        "Why is the MOUSE so sad?",
        "Are there any SECRETS?",
        "What is the SAFE CODE?",
        "( Try asking about something else!)",
        "Goodbye!",
      ]);
      this.updateOptions();
    } else if (userSaid(transcript, ["s***", "f***", "b****", "motherfuker"])) {
      response =
        "Pendejo how dare you swear at me you piece of shiitake mushroom. Puta madre!";
    }
    if (response) {
      this.get("npcContext").get("context").setContent(response);
      recognitionDisabled = true;
      recognition.stop();
      generateSpeech(response, restartRecognition, 14);
      return true;
    } else {
      return false;
    }
  },

  updateOptions() {
    for (var i = 0; i < this.get("subcontext").length; i++) {
      var subcontext = this.get("subcontext")[i];
      if (i < this.get("speechOptions").length) {
        var speechOption = this.get("speechOptions")[i];
        subcontext.set("opacity", 1);
        subcontext.get("context").setContent(speechOption);
      } else {
        subcontext.set("opacity", 0);
      }
    }
  },

  hide() {
    //this.get("npcContext").set("opacity", 0);
    this.get("npcContext").hide();
    this.set("opacity", 0);
  },

  draw() {
    //this.get("npcContext").set("opacity", 1);
    this.get("npcContext").draw();
    this.set("opacity", 1);
    if (this.get("rendered")) {
      return;
    } else {
      this.set("rendered", true);
      x = window.innerWidth * 0.65;
      y = window.innerHeight * 0.1;
      w = window.innerWidth * 0.35;
      h = window.innerHeight * 0.1;
      s = window.innerWidth * 0.015;

      optionsView = new ContainerSurface({});

      var optionsTranslateModifier = new Modifier({
        transform: Transform.translate(x, y, 0),
        opacity: function () {
          return this.get("opacity");
        }.bind(this),
      });

      mainContext.add(optionsTranslateModifier).add(optionsView);
      this.set("context", optionsView);

      let speechOptions = this.get("speechOptions");
      for (let i = 0; i < speechOptions.length; i++) {
        speechOption = new Item({
          content: speechOptions[i],
          position: [0, i * (h + s)],
          size: [w, h],
          opacity: 1,
          properties: {
            backgroundImage: "url(img/speech_bubble_right.png)",
            backgroundSize: "100% 100%",
            fontFamily: "Trebuchet MS",
            color: "black",
            zIndex: 95,
            fontSize: "20px",
            padding:
              window.innerWidth * 0.015 +
              "px " +
              window.innerWidth * 0.05 +
              "px " +
              window.innerWidth * 0.015 +
              "px " +
              window.innerWidth * 0.015 +
              "px ",
          },
        });

        let item = speechOption;
        speechView = new Surface({
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

        speechOption.set("context", speechView);
        optionsView.add(itemTranslateModifier).add(speechView);
        this.get("subcontext").push(speechOption);
      }
    }
  },
});

var quokkaConversation = Backbone.Model.extend({
  defaults: {
    content: "",
    context: null,
    npcContext: speechBubble1,
    subcontext: [],
    rendered: false,
    opacity: 0,
    speechOptions: [
      "How do I EXIT the conversation?",
      "What are the CAPITALIZED words for?",
      "How do I PRESS a button?",
      "How do I ZOOM in and out?",
      "How do I ask for HELP if I'm stuck?",
      "Goodbye!",
    ],
  },

  processSpeech(transcript) {
    let speechOptions = this.get("speechOptions");
    console.log("speechOptions", speechOptions);
    response = null;
    if (userSaid(transcript, ["exit", "asset"])) {
      response = "To exit, all you have to say is the word GOODBYE.";
    } else if (userSaid(transcript, ["bye", "by", "goodbye", "my"])) {
      response = "Catch you later, alligator!";
    } else if (userSaid(transcript, ["hello", "hi", "hey", "hallo"])) {
      response = "Howdy mate! I'm Mocha, the quokka. What's up?";
    } else if (userSaid(transcript, ["capitalized", "capitalize"])) {
      response =
        "The capitalized words are keywords that I recognize and have a response for.";
    } else if (
      userSaid(transcript, ["bubble", "speech bubbles", "bubbles", "speech"])
    ) {
      response = "The speech bubbles on the right are options for you to say!";
    } else if (userSaid(transcript, ["s***", "f***", "b****", "motherfuker"])) {
      response = "How dare you swear at me you piece of shiitake mushroom.";
    } else if (userSaid(transcript, ["button", "buttons", "press"])) {
      response =
        "You can press buttons by pointing your index finger at them and moving your hand slightly forward and back.";
    } else if (userSaid(transcript, ["zoom", "zoom in", "zoom out"])) {
      response =
        "You can zoom in and out by either pinching your index finger and thumb together or saying the word LOOK. To zoom out, just say the word OUT.";
    } else if (userSaid(transcript, ["help", "stuck", "help me"])) {
      response =
        "If you're stuck or forgot a command, you can ask for help by saying the word HELP and return to the game by saying BACK.";
    }

    if (response) {
      this.get("npcContext").get("context").setContent(response);
      recognitionDisabled = true;
      recognition.stop();
      generateSpeech(response, restartRecognition, 10);
      return true;
    } else {
      return false;
    }
  },

  updateOptions() {
    for (var i = 0; i < this.get("subcontext").length; i++) {
      var subcontext = this.get("subcontext")[i];
      if (i < this.get("speechOptions").length) {
        var speechOption = this.get("speechOptions")[i];
        subcontext.set("opacity", 1);
        subcontext.get("context").setContent(speechOption);
      } else {
        subcontext.set("opacity", 0);
      }
    }
  },

  hide() {
    //this.get("npcContext").set("opacity", 0);
    this.get("npcContext").hide();
    this.set("opacity", 0);
  },

  draw() {
    //this.get("npcContext").set("opacity", 1);
    this.get("npcContext").draw();
    this.set("opacity", 1);
    if (this.get("rendered")) {
      return;
    } else {
      this.set("rendered", true);
      x = window.innerWidth * 0.6;
      y = window.innerHeight * 0.1;
      w = window.innerWidth * 0.4;
      h = window.innerHeight * 0.1;
      s = window.innerWidth * 0.015;

      optionsView = new ContainerSurface({});

      var optionsTranslateModifier = new Modifier({
        transform: Transform.translate(x, y, 0),
        opacity: function () {
          return this.get("opacity");
        }.bind(this),
      });

      mainContext.add(optionsTranslateModifier).add(optionsView);
      this.set("context", optionsView);

      let speechOptions = this.get("speechOptions");
      for (let i = 0; i < speechOptions.length; i++) {
        speechOption = new Item({
          content: speechOptions[i],
          position: [0, i * (h + s)],
          size: [w, h],
          opacity: 1,
          properties: {
            backgroundImage: "url(img/speech_bubble_right.png)",
            backgroundSize: "100% 100%",
            fontFamily: "Trebuchet MS",
            color: "black",
            zIndex: 95,
            fontSize: "20px",
            padding:
              window.innerWidth * 0.015 +
              "px " +
              window.innerWidth * 0.05 +
              "px " +
              window.innerWidth * 0.015 +
              "px " +
              window.innerWidth * 0.015 +
              "px ",
          },
        });

        let item = speechOption;
        speechView = new Surface({
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

        speechOption.set("context", speechView);
        optionsView.add(itemTranslateModifier).add(speechView);
        this.get("subcontext").push(speechOption);
      }
    }
  },
});

capybaraSpeechOptions = new Conversation({});

quokkaSpeechOptions = new quokkaConversation({});
