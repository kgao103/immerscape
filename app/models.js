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
  },
  removeItem: function (item) {
    let items = this.get("items");
    let index = items.indexOf(item);
    items.splice(index, 1);
    this.set("items", items);
    console.log(this.get("items"));
  },

  hide: function () {
    this.get("items").forEach((item) => {
      item.hide();
    });
  },
});
