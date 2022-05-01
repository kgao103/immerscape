var Room = Backbone.Model.extend({
  defaults: {
    currentView: "",
    views: {},
    transitions: {},
    transitionHandlers: {},
  },

  transition: function (type) {
    let transition = this.get("transitions")[type];
    let currentView = this.get("currentView");
    let transitionHandler = this.get("transitionHandlers")[type];
    if (transitionHandler && currentView in transitionHandler) {
      transitionHandler[currentView]();
    }
    if (transition && currentView in transition) {
      this.getView().hide();
      let nextView = transition[currentView];
      this.set("currentView", nextView);
      drawView(this.getView());
      return true;
    } else {
      return false;
    }
  },

  getView: function () {
    return this.get("views")[this.get("currentView")];
  },

  getItems: function () {
    return this.getView().get("items");
  },

  drawView: function () {
    drawView(this.getView());
    inventory.draw();
  },

  turnOffLight: function () {
    console.log("halpppp shleeeee");
    for (let wall of Object.values(this.get("views"))) {
      console.log("halpppp meee");
      wall.set("background", wall.get("background_dark"));
    }
  },

  turnOnLight: function () {
    console.log("halpppp shleeeee");
    for (let wall of Object.values(this.get("views"))) {
      console.log("halpppp meee");
      wall.set("background", wall.get("background_light"));
    }
  },
});