const Agilite = require('agilite');

module.exports = function (RED) {
    function Roles(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        var success = true;
        var errorMessage = "";
        this.field = config.field || "payload";
        this.fieldType = config.fieldType || "msg";

        const typeDetect = require("type-detect");
        const Mustache = require("mustache");

        this.on('input', function (msg) {
            var serverConfig = RED.nodes.getNode(config.server);
            var apiKey = "";
            var roleName = config.roleName;
            var conditionalLevels = config.conditionalLevels;
            var processKey = config.processKey;
            var bpmRecordId = config.bpmRecordId;
            var currentUser = config.currentUser;
            var responsibleUsers = config.responsibleUsers;
            var url = "";
            var data = {};
            var failFlow = config.failFlow;

            // Function that is called inside .then of requests
            var reqSuccess = function(response){
                msg.agilite.message = response.data.errorMessage;

                if (response.status === 200) {
                    switch (node.fieldType) {
                        case "msg":
                            RED.util.setMessageProperty(msg, node.field, response.data);
                            break;
                        case "flow":
                            node.context().flow.set(node.field, response.data);
                            break;
                        case "global":
                            node.context().global.set(node.field, response.data);
                            break;
                    }

                    node.status({
                        fill: "green",
                        text: "Success",
                        shape: "ring"
                    });

                    node.send(msg);
                } else {
                    msg.payload = {};

                    node.status({
                        fill: "red",
                        text: "Error",
                        shape: "ring"
                    });

                    if (failFlow) {
                        node.error(msg.agilite.message, msg);
                    } else {
                        node.send(msg);
                    }
                }
            };

            // Function that is used inside the .catch of requests
            var reqCatch = function(error){
                msg.payload = {};

                if (error.response.data) {
                    msg.agilite.message = error.response.data.errorMessage;
                } else {
                    msg.agilite.message = "Unknown Error Occurred";
                }

                node.status({
                    fill: "red",
                    text: "Error",
                    shape: "ring"
                });

                if (failFlow) {
                    node.error(msg.agilite.message, msg);
                } else {
                    node.send(msg);
                }
            }

            url = serverConfig.server;

            //Check if there's valid data to pass
            if (typeDetect(msg.payload) !== "Object")
                msg.payload = {};

            data = msg.payload;

            //Check if we need to use programmatic values
            if (msg.agilite) {
                if (msg.agilite.logProcessId) {
                    if (msg.agilite.logProcessId !== "") {
                        logProcessId = msg.agilite.logProcessId;
                    }
                }

                if (msg.agilite.apiKey) {
                    if (msg.agilite.apiKey !== "") {
                        apiKey = msg.agilite.apiKey;
                    }
                }

                if (msg.agilite.roles) {
                    if (msg.agilite.roles.roleName) {
                        if (msg.agilite.roles.roleName !== "") {
                            roleName = msg.agilite.roles.roleName;
                        }
                    }

                    if (msg.agilite.roles.conditionalLevels) {
                        if (msg.agilite.roles.conditionalLevels !== "") {
                            conditionalLevels = msg.agilite.roles.conditionalLevels;
                        }
                    }

                    if (msg.agilite.roles.processKey) {
                        if (msg.agilite.roles.processKey !== "") {
                            processKey = msg.agilite.roles.processKey;
                        }
                    }

                    if (msg.agilite.roles.bpmRecordId) {
                        if (msg.agilite.roles.bpmRecordId !== "") {
                            bpmRecordId = msg.agilite.roles.bpmRecordId;
                        }
                    }

                    if (msg.agilite.roles.currentUser) {
                        if (msg.agilite.roles.currentUser !== "") {
                            currentUser = msg.agilite.roles.currentUser;
                        }
                    }

                    if (msg.agilite.roles.responsibleUsers) {
                        if (msg.agilite.roles.responsibleUsers !== "") {
                            responsibleUsers = msg.agilite.roles.responsibleUsers;
                        }
                    }
                }
            }

            if (apiKey === "") {
                apiKey = serverConfig.credentials.apiKey;
            }

            if (roleName === "") {
                roleName = config.roleName;
            }

            if (conditionalLevels === "") {
                conditionalLevels = config.conditionalLevels;
            }

            if (processKey === "") {
                processKey = config.processKey;
            }

            if (bpmRecordId === "") {
                bpmRecordId = config.bpmRecordId;
            }

            if (currentUser === "") {
                currentUser = config.currentUser;
            }

            if (responsibleUsers === "") {
                responsibleUsers = config.responsibleUsers;
            }

            //Mustache
            roleName = Mustache.render(roleName, msg);
            conditionalLevels = Mustache.render(conditionalLevels, msg);
            processKey = Mustache.render(processKey, msg);
            bpmRecordId = Mustache.render(bpmRecordId, msg);
            currentUser = Mustache.render(currentUser, msg);
            responsibleUsers = Mustache.render(responsibleUsers, msg);

            // Finalize array properties
            roleName = roleName.split(',');
            conditionalLevels = conditionalLevels.split(',');
            responsibleUsers = responsibleUsers.split(',');

            //We need a apiKey, key and data to proceed
            if (apiKey === "") {
                success = false;
                errorMessage = "No valid API Key Provided. Please authenticate with Agilit-e first";
            } else if (url === "") {
                success = false;
                errorMessage = "No Server URL Provided";
            } else {
                switch (config.actionType) {
                    case "3": //Get Role
                        if (roleName === "") {
                            success = false;
                            errorMessage = "No Role Name found";
                        }

                        break;
                    case "2": //Get Assigned Roles
                        if (processKey === "") {
                            success = false;
                            errorMessage = "No BPM Process Key found";
                        } else if (bpmRecordId === "") {
                            success = false;
                            errorMessage = "No BPM Record Id found";
                        } else if (roleName === "") {
                            success = false;
                            errorMessage = "No Role Name found";
                        }

                        break;
                    case "1": //Assign Role
                        if (processKey === "") {
                            success = false;
                            errorMessage = "No BPM Process Key found";
                        } else if (bpmRecordId === "") {
                            success = false;
                            errorMessage = "No BPM Record Id found";
                        } else if (roleName === "") {
                            success = false;
                            errorMessage = "No Role Name found";
                        } else if (currentUser === "") {
                            success = false;
                            errorMessage = "No Current User found";
                        } else if (responsibleUsers === "") {
                            success = false;
                            errorMessage = "No Responsible User(s) found";
                        }

                        break;
                }
            }

            if (!success) {
                msg.payload = errorMessage;
                node.send(msg);
                return false;
            }

            // Create New instance of Agilite Module that will be performing requests
            const agilite = new Agilite({
                apiServerUrl: url,
                apiKey
            });

            //Create msg.agilite if it's null so we can store the result
            if (!msg.agilite)
                msg.agilite = {};

            node.status({
                fill: "yellow",
                text: "Running",
                shape: "ring"
            });

            switch (config.actionType) {
                case "3": //Get Role
                    agilite.Roles.getRole(roleName, conditionalLevels, data)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;  
                case "2": //Get Assigned Roles
                    agilite.Roles.getAssignedRoles(processKey, bpmRecordId, roleName)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;
                case "1": //Assign Role
                    agilite.Roles.assignRole(processKey, bpmRecordId, roleName, currentUser, responsibleUsers)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;
            }
        });
    }

    RED.nodes.registerType("roles", Roles);
}