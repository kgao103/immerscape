# immerscape

835 final project INSTRUCTIONS TO RUN APP.

To launch the app,

1. open up the console, cd into the folder, and run:

> python -m http.server

2. open up a google Chrome browser and navigate to: localhost:8000

3. Connect the leap sensor to the laptop and allow the browser to access your microphone when prompted.

If you're on a mac, no additional steps for the voice synthesis. However, if you're on a PC, might have to change the VOICEINDEX in app/config.js to 4. The default is 17, which is the one to use if you're on a mac.

You may also want to increase the msg.rate value of
generateSpeech in helpers.js if it talks too slowly.

# included files

main.js - contains the main logic for the game

config.js - contains functions for configuring game parameters

helpers.js - contains helper functions

models folder and models.js - relevant models containing logic specific to each type of game object

setupSpeech.js - sets up speech recognition
setup.js - sets up the famo.us rendering engine

tutorial.js - contains Items/Views specific to the tutorial
room1.js - contains Items/Views specific to the main escape room

img folder - stores images related to game
sound folder - stores sounds related to game
