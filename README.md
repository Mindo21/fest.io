# fest.io

fest.io - a client-server application helping festivals all around the globe.
A web-application, with which a creator of any one day festival can inform audience about what is about to happen, and beautify the overall experience of the performances.

Features
--------
Things to do on the device:

1. Click on an artist to see/edit their details. (If edited, the changes are shown in real time on stage screen or the device...)
2. Click on a stage to be redirected to the stage screen (or you might copy the link and open it in any other browser).
3. Add a new artist, while giving a lot of useful information (Name, Genre, Stage they are on, Times, Icon, Images to be shown at the stage...).
4. Add a new stage...

Things that are shown on the stage screens:

1. The LineUp of the day - names of the artists, their performance times, their uploaded icons...
2. The progress of the day - showing which artists have already performed, which ones are performing at the moment and which ones will be performing soon.
3. Slideshow of images sent by artists - during their performance, their photos will be shown to set the mood, as well as informing audience with all the other stuff shown.
4. Name of the stage (in case the audience is lost);


Running fest.io
----------------

To get the example running, you must install the source code and all modules and then run the server from the command line:
It will run on port 8080.

1. To download any libraries the code uses, type:

  ```bash
  npm install
  ```

2. Start the server by typing:

  ```bash
  npm start
  ```

Additional info
---------------

The stage screens are connected through websocket to the server, in order to react to changes from the organiser's device in real-time.