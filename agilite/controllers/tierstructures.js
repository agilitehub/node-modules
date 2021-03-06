"use strict";

const Enums = require('../utils/enums');
const Utils = require('../utils/utils.js');

class TierStructures {
	constructor(config){
		this.apiServerUrl = null;
		this.apiKey = null;
		this.teamId = null;
		
		this.sort = {
			ASC: "asc",
			DESC: "desc",
			ASC_VALUE: "asc_value",
			DESC_VALUE: "desc_value",
		};

		this.outputFormat = {
			ARRAY: Enums.VALUE_ARRAY_LOWER,
			JSON: Enums.VALUE_JSON_LOWER,
			STRING: Enums.VALUE_STRING_LOWER
		};

		if(config){
			this.apiServerUrl = config.apiServerUrl;
			this.apiKey = config.apiKey;
			this.teamId = config.teamId;
		}
	}

	postData(data = {}){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_TIER_STRUCTURES, Enums.METHOD_POST, data);
	}

	getData(profileKeys = [], recordIds = [], slimResult = true){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_TIER_STRUCTURES, Enums.METHOD_GET, null, null, profileKeys, recordIds, slimResult);
	}

	putData(recordId = "", data = {}){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_TIER_STRUCTURES, Enums.METHOD_PUT, data, recordId);
	}

	deleteData(recordId = ""){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_TIER_STRUCTURES, Enums.METHOD_DELETE, null, recordId);
	}
	
	getTierByKey(tierKeys = [], includeValues = true, includeMetaData = false, includeTierEntries = false, sortValues = "", valuesOutputFormat = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_TIER_STRUCTURES}/getTierByKey`,
			method: Enums.METHOD_GET,
			headers:{}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_TIER_KEYS] = tierKeys.join(Enums.SEPARATOR_COMMA);
		config.headers[Enums.HEADER_INCLUDE_VALUES] = includeValues;
		config.headers[Enums.HEADER_INCLUDE_META_DATA] = includeMetaData;
		config.headers[Enums.HEADER_INCLUDE_TIER_ENTRIES] = includeTierEntries;
		config.headers[Enums.HEADER_SORT_VALUES] = sortValues;
		config.headers[Enums.HEADER_VALUES_OUTPUT_FORMAT] = valuesOutputFormat;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}
}

module.exports = TierStructures;