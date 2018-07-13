var assert = require('chai').assert;
var expect = require('chai').expect;
var jde = require('../jde-date-time');

describe('JDE Date Time: Positive Tests', function(){
    it('JDE Date to JS Date', function(){
        assert.equal(jde.convertJDEDateToJSDate(118342), 'Sat Dec 08 2018');   
    });

    it('JDE Time to JS Time', function(){
        assert.equal(jde.convertJDETimeToJSTime(113236), '11:32:36');
    });

    it('JS Date to JDE Date', function(){
        assert.equal(jde.convertJSDateToJDEDate('2018-12-08'), '118342');   
    });

    it('JS Time to JDE Time', function(){
        assert.equal(jde.convertJSTimeToJDETime('12:31:22'), '123122');
    });

});

describe('JDE Date Time: Negative Tests', function(){

    it('Empty String passed', function(){
        assert.equal(jde.convertJDEDateToJSDate(''), "JDE Date parameter needs to be of type 'Number' with max 6 characters");
    });

    it('Text String passed', function(){
        assert.equal(jde.convertJDETimeToJSTime("text"), "JDE Time parameter needs to be of type 'Number' with max 6 characters");
    });

    it('Invalid value passed', function(){
        assert.equal(jde.convertJSDateToJDEDate(2018-12-08), "JS Date parameter needs to be of type 'String' with max 10 characters, including dashes or slashes");
    });

    it('No value passed', function(){
        assert.equal(jde.convertJSTimeToJDETime(), "JS Time parameter needs to be of type 'String' with max 8 characters, including 2 colons");
    });
});