"use strict";

const Enums = require('../utils/enums');
const Utils = require('../utils/utils');

class ApiKeys {
	constructor(config){
		this.apiServerUrl = null;
		this.apiKey = null;
		this.teamId = null;

		if(config){
			this.apiServerUrl = config.apiServerUrl;
			this.apiKey = config.apiKey;
			this.teamId = config.teamId;
		}
	}

	postData(data = {}){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_API_KEYS, Enums.METHOD_POST, data);
	}

	getData(profileKeys = [], recordIds = [], slimResult = true){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_API_KEYS, Enums.METHOD_GET, null, null, profileKeys, recordIds, slimResult);
	}

	putData(recordId = "", data = {}){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_API_KEYS, Enums.METHOD_PUT, data, recordId);
	}

	deleteData(recordId = ""){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_API_KEYS, Enums.METHOD_DELETE, null, recordId);
	}
	
	generateApiKey(recordId = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_API_KEYS}/generate`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_RECORD_ID] = recordId;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}

	resetApiKeys(recordId = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_API_KEYS}/reset`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_RECORD_ID] = recordId;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}

	disableApiKey(recordId = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_API_KEYS}/disable`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_RECORD_ID] = recordId;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}

	enableApiKey(recordId = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_API_KEYS}/enable`,
			method: Enums.METHOD_GET,
			headers: {}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;
		config.headers[Enums.HEADER_RECORD_ID] = recordId;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}
}

module.exports = ApiKeys;