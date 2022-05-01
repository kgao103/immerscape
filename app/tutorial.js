
room = new Room({
  currentView: "wall1",
  views: {
    wall1: wall1,
    wall2: wall2,
    wall3: wall3,
    wall4: wall4,
    zoomedSafe: zoomedSafe,
    capybaraConversation: capybaraConversation,
  },
  transitions: {
    left: {
      wall1: "wall4",
      wall2: "wall1",
      wall3: "wall2",
      wall4: "wall3",
    },
    right: {
      wall1: "wall2",
      wall2: "wall3",
      wall3: "wall4",
      wall4: "wall1",
    },
    talk: {
      wall4: "capybaraConversation",
    },
    bye: {
      capybaraConversation: "wall4",
    },
    zoom_in: {
      wall2: "zoomedSafe",
    },
    zoom_out: {
      zoomedSafe: "wall2",
    },
  },
});
