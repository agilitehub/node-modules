"use strict";

const Enums = require('../utils/enums');
const Utils = require('../utils/utils.js');

class Roles {
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
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_ROLES, Enums.METHOD_POST, data);
	}

	getData(profileKeys = [], recordIds = [], slimResult = true){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_ROLES, Enums.METHOD_GET, null, null, profileKeys, recordIds, slimResult);
	}

	putData(recordId = "", data = {}){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_ROLES, Enums.METHOD_PUT, data, recordId);
	}

	deleteData(recordId = ""){
		return Utils.executeCRUDRequest(this.apiServerUrl, this.apiKey, this.teamId, Enums.MODULE_KEY_ROLES, Enums.METHOD_DELETE, null, recordId);
	}
	
	getRole(roleNames = [], conditionalLevels = [], data = {}){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_ROLES}/getRole`,
			method: Enums.METHOD_POST,
			headers: {},
			data
		};

		config.headers[Enums.HEADER_CONTENT_TYPE] = Enums.HEADER_APPLICATION_JSON;
		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_ROLE_NAMES] = roleNames.join(Enums.SEPARATOR_COMMA);
		config.headers[Enums.HEADER_CONDITIONAL_LEVELS] = conditionalLevels.join(Enums.SEPARATOR_COMMA);

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}

	assignRole(processKey = "", bpmRecordId = "", roleName = "", currentUser = "", responsibleUsers = []){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_ROLES}/assignRole`,
			method: Enums.METHOD_GET,
			headers:{}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_PROCESS_KEY] = processKey;
		config.headers[Enums.HEADER_BPM_RECORD_ID] = bpmRecordId;
		config.headers[Enums.HEADER_ROLE_NAME] = roleName;
		config.headers[Enums.HEADER_CURRENT_USER] = currentUser;
		config.headers[Enums.HEADER_RESPONSIBLE_USERS] = responsibleUsers.join(Enums.SEPARATOR_COMMA);

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}

	getAssignedRoles(processKey = "", bpmRecordId = "", roleNames = []){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_ROLES}/getAssignedRoles`,
			method: Enums.METHOD_GET,
			headers:{}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_PROCESS_KEY] = processKey;
		config.headers[Enums.HEADER_BPM_RECORD_ID] = bpmRecordId;
		config.headers[Enums.HEADER_ROLE_NAMES] = roleNames.join(Enums.SEPARATOR_COMMA);

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}

	changeConditionalLevels(recordId = "", conditionalLevels = []){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_ROLES}/changeConditionalLevels`,
			method: Enums.METHOD_GET,
			headers:{}
		};

		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_RECORD_ID] = recordId;
		config.headers[Enums.HEADER_CONDITIONAL_LEVELS] = conditionalLevels.join(Enums.SEPARATOR_COMMA);

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}	

	reAssignResponsibleUser(recordId = "", responsibleUser = ""){
		let config = {
			url: `${this.apiServerUrl}/${Enums.MODULE_KEY_ROLES}/reAssignResponsibleUser`,
			method: Enums.METHOD_GET,
			headers:{}
		};
		config.headers[Enums.HEADER_API_KEY] = this.apiKey;

		config.headers[Enums.HEADER_RECORD_ID] = recordId;
		config.headers[Enums.HEADER_RESPONSIBLE_USER] = responsibleUser;

		if(this.teamId !== undefined && this.teamId !== null )
			config.headers[Enums.HEADER_TEAM_NAME] = this.teamId;

		return Utils.executeRequest(config);
	}
}

module.exports = Roles;