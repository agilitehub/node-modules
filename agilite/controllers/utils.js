"use strict";

const Enums = require('../utils/enums');
const Utilities = require('../utils/utils.js');

class Utils {
	constructor(config){
		this.apiServerUrl = null;
		this.apiKey = null;
		this.teamId = null;
		
		this.responseType = {
			ARRAY_BUFFER: "arraybuffer",
			BLOB: "blob",
			DOCUMENT: "document",
			JSON: "json",
			TEXT: "text",
			STREAM: "stream"
		};

		if(config){
			this.apiServerUrl = config.apiServerUrl;
			this.apiKey = config.apiKey;
			this.teamId = config.teamId;
		}
	}

	encodeXML(data = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/encodeXML`,
			method: Enums.METHOD_POST,
			headers: {},
			data
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_CONTENT_TYPE] = Enums.HEADER_TEXT_PLAIN;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	decodeXML(data = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/decodeXML`,
			method: Enums.METHOD_POST,
			headers: {},
			data
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_CONTENT_TYPE] = Enums.HEADER_TEXT_PLAIN;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	XMLToJS(data = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/XMLToJS`,
			method: Enums.METHOD_POST,
			headers: {},
			data
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_CONTENT_TYPE] = Enums.HEADER_TEXT_PLAIN;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	JSToXML(data = {}){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/JSToXML`,
			method: Enums.METHOD_POST,
			headers: {},
			data
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_CONTENT_TYPE] = Enums.HEADER_APPLICATION_JSON;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	html2json(data = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/html2json`,
			method: Enums.METHOD_POST,
			headers: {},
			data
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_CONTENT_TYPE] = Enums.HEADER_TEXT_PLAIN;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	generatePDF(data = {}){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/generatePDF`,
			method: Enums.METHOD_POST,
			headers: {},
			data,
			responseType: "arraybuffer"
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_CONTENT_TYPE] = Enums.HEADER_APPLICATION_JSON;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	generateUUID(){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/generateUUID`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	formatDateTime(dateTimeValue = "", formatKey = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/formatDateTime`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_DATE_TIME_VALUE] = dateTimeValue;
		config.headers[Enums.HEADER_FORMAT_KEY] = formatKey;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	account(){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_ADMIN}/account`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	dashboardReports(startDate, endDate){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_REPORTS}/dashboard`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_START_DATE] = startDate;
		config.headers[Enums.HEADER_END_DATE] = endDate;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	exportData(includeModules){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/exportAllData`,
			method: Enums.METHOD_GET,
			headers: {},
			responseType: "arraybuffer"
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_INCLUDE_MODULES] = includeModules;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}

	importData(fileId){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_UTILS}/importData`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_FILE_ID] = fileId;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utilities.executeRequest(config);
	}
}

module.exports = Utils;