
# Node-Websocket-Canvas-Dice

The reason mobile web apps feel slow when compared to native
apps, is the DOM. Today, most modern mobile browsers, have
implemented hardware(CPU) acceleration for their canvas element.
This creates an oportunity to develop extremely performant,
web-deployed, single-page-applications (SPA).

This proof of concept application leverages HTML5 canvas Path2D for UI.
We also use a simple node file/socket server to enable realtime, multiuser,
game play of an SPA Dice Game. All users will recognize this Poker-Like game.


## How to use

To test this application, use node to run '/build/server/staticServer.js'
This will serve port 83 on the localhost.
To run the game just open localhost:83 in the browser.
Open two or more tabs to test realtime multiplayer game.

Open a player on a phone with the chrome browser installed.
The experience will feel like it is a native app.

## License
[MIT](LICENSE)
