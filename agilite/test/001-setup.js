"use strict";

require('dotenv').config();
const expect = require('chai').expect;
const Agilite = require('../controllers/agilite');
const Enums = require('../utils/enums');

const agilite = new Agilite({
    apiServerUrl: process.env.API_SERVER_URL,
    apiKey: process.env.API_KEY
});

describe('Initial Setup', () => {    
    it("Check API Server URL is valid", (done) => {
        expect(agilite.getConfig()).to.haveOwnProperty("apiServerUrl");
        expect(agilite.getConfig().apiServerUrl).to.not.equal(Enums.STRING_EMPTY);
        //TODO: Check that it's a valid url string
        done();
    });

    it("Check API Key is valid", (done) => {
        expect(agilite.getConfig()).to.haveOwnProperty("apiKey");
        expect(agilite.getConfig().apiKey).to.not.equal(Enums.STRING_EMPTY);
        done();
    });
});