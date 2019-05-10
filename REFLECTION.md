# fest.io - Reflection - UP879244

fest.io - a client-server application helping festivals all around the globe.
A web-application, with which a creator of any one day festival can inform audience about what is about to happen, and beautify the overall experience of the performances.

Initial issues
--------------

The biggest problem was to come up with a design that would not be too complicated.
When there have to be lists and data items loaded and stored dynamically all the time, it is really hard to make it simple.
So I tried to at least make it look simple using only a few colours (hopefully distinguishable colours) and showing only two lists initially.
The less components are shown at the user at the first load of the page, the less confused he is.

Websocket
---------

I decided to use socket.io library (installed with npm). I am more than happy that I chose this library, the websockets are working great without any problems.
These websockets had to be used in order to let the client-side know that something happened on the server -> the stage screens that I am using can be updated in real-time!

Responsive layout
-----------------

The big issue for me was to make the layout responsive, so that on a mobile device it would not weird (elements outside the screen, etc.)
I used css property "flex" quite a lot and found it really helpful.