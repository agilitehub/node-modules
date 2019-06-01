const Agilite = require('agilite');

module.exports = function (RED) {
    function Bpm(config) {
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
            var profileKey = config.profileKey;
            var currentUser = config.currentUser;
            var bpmRecordId = config.bpmRecordId;
            var optionSelected = config.optionSelected;
            var bpmRecordIds = config.bpmRecordIds;
            var responsibleUsers = config.responsibleUsers;
            var stepNames = config.stepNames;
            var relevantUsers = config.relevantUsers;
            var history = config.excludeHistory;
            var stepOptions = config.excludeStepOptions;
            var visibleObjects = config.excludeVisibleObjects;
            var profileKeys = config.profileKeys;
            var comments = "";
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
                if (msg.agilite.apiKey) {
                    if (msg.agilite.apiKey !== "") {
                        apiKey = msg.agilite.apiKey;
                    }
                }

                if (msg.agilite.bpm) {
                    if (msg.agilite.bpm.profileKey) {
                        if (msg.agilite.bpm.profileKey !== "") {
                            profileKey = msg.agilite.bpm.profileKey;
                        }
                    }

                    if (msg.agilite.bpm.currentUser) {
                        if (msg.agilite.bpm.currentUser !== "") {
                            currentUser = msg.agilite.bpm.currentUser;
                        }
                    }

                    if (msg.agilite.bpm.bpmRecordId) {
                        if (msg.agilite.bpm.bpmRecordId !== "") {
                            bpmRecordId = msg.agilite.bpm.bpmRecordId;
                        }
                    }

                    if (msg.agilite.bpm.optionSelected) {
                        if (msg.agilite.bpm.optionSelected !== "") {
                            optionSelected = msg.agilite.bpm.optionSelected;
                        }
                    }

                    if (msg.agilite.bpm.bpmRecordIds) {
                        if (msg.agilite.bpm.bpmRecordIds !== "") {
                            bpmRecordIds = msg.agilite.bpm.bpmRecordIds;
                        }
                    }

                    if (msg.agilite.bpm.responsibleUsers) {
                        if (msg.agilite.bpm.responsibleUsers !== "") {
                            responsibleUsers = msg.agilite.bpm.responsibleUsers;
                        }
                    }

                    if (msg.agilite.bpm.stepNames) {
                        if (msg.agilite.bpm.stepNames !== "") {
                            stepNames = msg.agilite.bpm.stepNames;
                        }
                    }

                    if (msg.agilite.bpm.relevantUsers) {
                        if (msg.agilite.bpm.relevantUsers !== "") {
                            relevantUsers = msg.agilite.bpm.relevantUsers;
                        }
                    }

                    if (msg.agilite.bpm.profileKeys) {
                        if (msg.agilite.bpm.profileKeys !== "") {
                            profileKeys = msg.agilite.bpm.profileKeys;
                        }
                    }
                }
            }

            if (apiKey === "") {
                apiKey = serverConfig.credentials.apiKey;
            }

            //We need a apiKey, key and data to proceed
            if (apiKey === "") {
                success = false;
                errorMessage = "No valid API Key Provided. Please authenticate with Agilit-e first";
            } else if (url === "") {
                success = false;
                errorMessage = "No Server URL Provided";
            } else {
                switch (config.actionType) {
                    case "1": //Register BPM Record
                        if (profileKey === "") {
                            success = false;
                            errorMessage = "No Profile Key found";
                        }

                        if (currentUser === "") {
                            success = false;
                            errorMessage = "No Current User found";
                        }

                        break;
                    case "2": //Execute
                        if (profileKey === "") {
                            success = false;
                            errorMessage = "No Profile Key found";
                        }

                        if (bpmRecordId === "") {
                            success = false;
                            errorMessage = "No BPM Record Id found";
                        }

                        if (optionSelected === "") {
                            success = false;
                            errorMessage = "No Option Selected found";
                        }

                        if (currentUser === "") {
                            success = false;
                            errorMessage = "No Current User found";
                        }

                        break;
                    case "3": //Get Record State
                        if (profileKeys === "") {
                            success = false;
                            errorMessage = "No Profile Keys found";
                        }

                        break;
                    case "4": //Get By Profile Key
                        if (profileKey === "") {
                            success = false;
                            errorMessage = "No Profile Key found";
                        }

                        break;
                    case "5": //Get Active Steps
                    case "6": //Get Active Users
                        if (profileKey === "") {
                            success = false;
                            errorMessage = "No Profile Key found";
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

            // Format Mustache properties
            profileKey = Mustache.render(profileKey, msg);
            currentUser = Mustache.render(currentUser, msg);
            bpmRecordId = Mustache.render(bpmRecordId, msg);
            optionSelected = Mustache.render(optionSelected, msg);
            bpmRecordIds = Mustache.render(bpmRecordIds, msg);
            responsibleUsers = Mustache.render(responsibleUsers, msg);
            stepNames = Mustache.render(stepNames, msg);
            relevantUsers = Mustache.render(relevantUsers, msg);
            profileKeys = Mustache.render(profileKeys, msg);

            // Finalize array properties
            profileKeys = profileKeys.split(',');
            bpmRecordIds = bpmRecordIds.split(',');
            stepNames = stepNames.split(',');
            responsibleUsers = responsibleUsers.split(',');
            relevantUsers = relevantUsers.split(',');

            //Create msg.agilite if it's null so we can store the result
            if (!msg.agilite)
                msg.agilite = {};

            node.status({
                fill: "yellow",
                text: "Running",
                shape: "ring"
            });

            switch (config.actionType) {
                case "1": //Register BPM Record
                    agilite.BPM.registerBPMRecord(profileKey, currentUser)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;
                case "2": //Execute
                    agilite.BPM.execute(profileKey, bpmRecordId, optionSelected, currentUser, comments, data)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;
                case "3": //Get Record State
                    agilite.BPM.getRecordState(profileKeys, bpmRecordIds, stepNames, responsibleUsers, relevantUsers, history, stepOptions, visibleObjects)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;
                case "4": //Get By Profile Key
                    agilite.BPM.getByProfileKey(profileKey)
                    .then(function (response) {
                        reqSuccess(response);
                    })
                    .catch(function (error) {
                        reqCatch(error);
                    });
                    break;
                case "5": //Get Active Steps
                    agilite.BPM.getActiveSteps(profileKey)
                    .then(function (response) {
                        reqSuccess(response);
                    })
                    .catch(function (error) {
                        reqCatch(error);
                    });
                    break;
                case "6": //Get Active Users
                    agilite.BPM.getActiveUsers(profileKey)
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

    RED.nodes.registerType("bpm", Bpm);
}