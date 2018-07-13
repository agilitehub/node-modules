# jde-date-time
A NodeJS and JavaScript Library to manage conversions of JDE Dates/Times to JS Dates/Times and vice versa

Created by [Agilit-e](https://agilite.io)

* Available as a Node-RED module called [node-red-contrib-jde-date-time](https://www.npmjs.com/package/node-red-contrib-jde-date-time)
* Available as part of [Agilit-e's](https://agilite.io) [node-red-contrib-agilite-utils](https://www.npmjs.com/package/node-red-contrib-agilite-utils) Module

**Installation**

Using npm:

```
npm install jde-date-time
```

In Node.js:

```javascript
var jde = require('jde-date-time');
```

### Description
jde-date-time is a simple Javascript and NodeJS Library to manage conversions between JDE Date and Time formats to Javascript
Date and Time formats and vice versa.

### How to use:
__Pay close attention to parameters types__

```javascript
var jde = require('jde-date-time');

//Converting JDE Date to Javascript Date
console.log(jde.convertJDEDateToJSDate(118342)); //Outputs: 'Sat Dec 08 2018'

//Converting JDE Time to Javascript Time
console.log(jde.convertJDETimeToJSTime(123423)); //Ouptuts: '12:34:23'

//Converting Javascript Date to JDE Date
console.log(jde.convertJSDateToJDEDate('2018-12-08')); //Outputs: '118342'

//Converting Javascript Time to JDE Time
console.log(jde.convertJSTimeToJDETime('12:32:16')); //Outputs: '123216'
```

### To Run Unit Tests

```
npm run test
```