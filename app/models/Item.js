function drawItem(item) {
  image = item.get('source');
  zIndex = item.get('grabbable') ? 60 : 0;
  var itemView = new ImageSurface({
    content: image,
    properties: {
      zIndex: zIndex,
    }
  });

  var itemTranslateModifier = new Modifier({
    transform: function () {
      let position = item.get('position');
      return Transform.translate(position[0], position[1], 0);
    },
    opacity: function () {
      return item.get('opacity');
    },
    size: function () {
      return item.get('size');
    },
  });

  mainContext.add(itemTranslateModifier).add(itemView);
  item.set("context", itemView);
}

var Item = Backbone.Model.extend({
  defaults: {
    context: null,
    source: "",
    size: [0, 0],
    position: [0, 0],
    grabbable: false,
    openSound: null,
    closingSound: null,
    openable: false,
    holding: false,
    isOn: true,
    switchedOnable: false,
    name: "",
    description: "",
    opacity: 1,
    rendered: false,
    number: -1,
  },

  // useOn: function (item) {
  //   console.log("hiiii");
  //   return false;
  // },

  initialize: function () {},

  setPosition: function (position) {
    this.set("position", position);
  },

  setSize: function (size) {
    this.set("size", size);
  },

  isHovered: function (cursorPosition) {
    let position = this.get("position");
    let size = this.get("size");
    let minX = position[0];
    let maxX = position[0] + size[0];
    let minY = position[1];
    let maxY = position[1] + size[1];
    let withinX = minX <= cursorPosition[0] && cursorPosition[0] <= maxX;
    let withinY = minY <= cursorPosition[1] && cursorPosition[1] <= maxY;
    let result = withinX && withinY;
    return result;
  },

  setContent: function (source) {
    this.set("source", source);
    this.get("context").setContent(source);
  },

  isOpenable: function () {
    return this.get("openable") && !this.get("isOpen");
  },

  isClosable: function () {
    return this.get("openable") && this.get("isOpen");
  },

  isOnable: function () {
    return this.get("switchedOnable") && !this.get("isOn");
  },

  isOffable: function () {
    return this.get("switchedOnable") && this.get("isOn");
  },

  open: function () {
    console.log("opening");
    this.set("isOpen", true);
    if (this.get("openSound")) {
      this.get("openSound").play();
    }
    this.setContent(this.get("sourceOpened"));
  },

  close: function () {
    console.log("closing");
    this.set("isOpen", false);
    if (this.get("closingSound")) {
      this.get("closingSound").play();
    }
    this.setContent(this.get("sourceClosed"));
  },

  draw: function () {
    this.set("opacity", 1);
    if (this.get("rendered")) {
      return;
    } else {
      this.set("rendered", true);
      drawItem(this);
    }
  },

  hide: function () {
    this.set("opacity", 0);
  },
});

var ItemSet = Backbone.Collection.extend({ model: Item });