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
    items.splice(index, 1);
    this.set("items", items);
    console.log(this.get("items"));
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
  position: [window.innerWidth * 0.3, window.innerHeight * 0.1],
  size: [window.innerWidth * 0.3, window.innerHeight * 0.4],
  opacity: 1,
  properties: {
    backgroundImage: "url(img/speech_bubble.webp)",
    backgroundSize: "100% 100%",
    color: "black",
    zIndex: 95,
    fontSize: "20px",
    padding: window.innerWidth * 0.05 + "px",
  },
});

var Conversation = Backbone.Model.extend({
  defaults: {
    content: "",
    context: null,
    npcContext: speechBubble1,
    subcontext: [],
    rendered: false,
    opacity: 0,
    speechOptions: [
      "(Ask about the MOUSE)",
      "(Ask about the SAFE CODE)",
      "(Ask about something else)",
      "(Say BYE)",
    ],
  },

  processSpeech(transcript) {
    let speechOptions = this.get("speechOptions");
    response = null;
    if (userSaid(transcript, ["mouse", "rat", "mouth", "maps"])) {
      response =
        "Oh my friend Steve the mouse has been craving some cheese to go with his grapes for days. Poor Steve.";
    } else if (userSaid(transcript, ["safe", "code", "save"])) {
      response = "I think it starts with the number 2";
    } else if (userSaid(transcript, ["bye", "by", "goodbye"])) {
      response = "goodbye!";
    } else if (userSaid(transcript, ["hello", "hi", "hey"])) {
      response = "hey what's up?";
    }
    if (response) {
      this.get("npcContext").get("context").setContent(response);
      generateSpeech(response, () => {}, 21);
      return true;
    } else {
      return false;
    }
  },

  updateOptions() {
    for (var i = 0; i < this.get("subcontext").length; i++) {
      var subcontext = this.get("subcontext")[i];
      if (i < speechOptions.length) {
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
      w = window.innerWidth * 0.3;
      h = window.innerHeight * 0.15;
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

        speechOption.context = speechView;
        optionsView.add(itemTranslateModifier).add(speechView);
        this.get("subcontext").push(speechOption);
      }
    }
  },
});

capybaraSpeechOptions = new Conversation({});
