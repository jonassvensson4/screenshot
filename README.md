# screenshot
This resource will let you make a selection of the game that you want to screenshot. 

![screen selection preview](https://i.imgur.com/zuEzVMm.png)
###### GIF preview (Can't embed because of the size limit):
http://i.imgur.com/l45hSyc.gif

### Installation
1. Install my modified <a href="https://github.com/jonassvensson4/screenshot-basic">screenshot-basic</a> resource.
2. Add `start screenshot`to your server.cfg. <br>Remember to start it after screenshot-basic and before your scripts that may use this resource.
3. This resource uploads images to imgur, you'll need to create a client and add your client ID to the top of the client.js. You can create a client here: https://api.imgur.com/oauth2/addclient
4. You might want to do something else with the image url instead of just sending it to the chat. You can change that [here](https://github.com/jonassvensson4/screenshot/blob/master/client/client.js#L48).
