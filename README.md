# Covid-19 Tracker (Backend)

### Overview ###

Covid-19 Tracker is a website that people can use to check updated cases around the world and new cases added by admins. It is my final project at General Assembly. It's built with React, Node.js/Express, MongoDB/Mongoose, Websocket/socket.io and libraries (e.g. ReactLeaflet, Axios, etc.).

P.S. I added a "Easter Egg/Thanks" page to this website. It is only displayed when there is 0 case around the world. This page is for thanks all healthcare workers who were on the frontlines of Covid-19. Hope we are able to see that page soon.

Frontend [link.](https://github.com/ryan-xin/covid-19-tracker-frontend)

Here is the live [website.](https://ryan-xin.github.io/covid-19-tracker-frontend)

![Screenshot of the website:](https://raw.githubusercontent.com/ryan-xin/covid-19-tracker-frontend/master/public/01%20Covid-19%20Tracker%20Login.png)
![Screenshot of the website:](https://raw.githubusercontent.com/ryan-xin/covid-19-tracker-frontend/master/public/02%20Covid-19%20Tracker%20World%20Map.png)
![Screenshot of the website:](https://raw.githubusercontent.com/ryan-xin/covid-19-tracker-frontend/master/public/03%20Covid-19%20Tracker%20Local%20Map.png)
![Screenshot of the website:](https://raw.githubusercontent.com/ryan-xin/covid-19-tracker-frontend/master/public/04%20Covid-19%20Tracker%20Cases%20List.png)
![Screenshot of the website:](https://github.com/ryan-xin/covid-19-tracker-frontend/blob/master/public/05%20Covid-19%20Tracker%20Case%20Form.png)

### Main Features ###

* User login,logout and signup;
* Users check cases around the world based on countries;
* Users check total cases of the world;
* Users check new cases added by admin nearby;
* Admin login,logout;
* Admins create, update and delete new cases;
* Users get notification when new case added;

### Unfixed Bugs ###

* Not mobile responsive;
* Form day/month/year not aligned;
* Password field shows password;
* Highlight invalid form fields;
* Filter Australia suburbs everytime when open the page.

### Tech Used ###

React; JavaScript; Node.js/Express; MongoDB/Mongoose; Websocket/socket.io.

### Objectives ###

* This is my first time to use React, Node.js and MongoDB and I just got a basic idea of this tech stack, still needs more practice;
* React has a deep learning curve compared with Rails, which I used for my last two projects. Hooks are very cool feature and easier to use, especially useEffect which makes rerender much easier; 
* Compared with Rails ActiveRecord, MongoDB is hard to setup and easy to update, however, ActiveRecord is easy to setup and hard to update;