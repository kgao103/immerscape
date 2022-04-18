var Room = Backbone.Model.extend({
  defaults: {
    currentView: "",
    views: {},
    transitions: {},
  },

  transition: function (type) {
    let transition = this.get("transitions")[type];
    let currentView = this.get("currentView");
    if (currentView in transition) {
      this.getView().hide();
      let new_view = transition[currentView];
      this.set("currentView", new_view);
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