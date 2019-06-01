module.exports = function (RED) {
    function Logs(config) {
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
            var recordId = config.recordId;
            var url = "";
            var failFlow = config.failFlow;

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

                if (msg.agilite.logs) {
                    if (msg.agilite.logs.profileKey) {
                        if (msg.agilite.logs.profileKey !== "") {
                            profileKey = msg.agilite.logs.profileKey;
                        }
                    }

                    if (msg.agilite.logs.recordId) {
                        if (msg.agilite.logs.recordId !== "") {
                            recordId = msg.agilite.logs.recordId;
                        }
                    }
                }
            }

            if (apiKey === "") {
                apiKey = serverConfig.credentials.apiKey;
            }

            if (profileKey === "") {
                profileKey = config.profileKey;
            }

            if (recordId === "") {
                recordId = config.recordId;
            }

            //Mustache
            profileKey = Mustache.render(profileKey, msg);
            recordId = Mustache.render(recordId, msg);

            //Validate Values
            if (apiKey === "") {
                success = false;
                errorMessage = "No valid API Key Provided. Please authenticate with Agilit-e first";
            } else if (url === "") {
                success = false;
                errorMessage = "No Server URL Provided";
            } else {
                switch (config.actionType) {
                    case "1": //Create Batch Log Process
                        if (profileKey === "") {
                            success = false;
                            errorMessage = "No Profile Key Provided";
                        }

                        break;
                    case "2": //Get Log Batch Process
                        if (recordId === "") {
                            success = false;
                            errorMessage = "No Record Id Provided";
                        }

                        break;
                }
            }

            if (!success) {
                node.error(errorMessage, msg);
                return false;
            }

            //Perform a HTTP Post to Agilit-e for Numbering, passing the body content
            var axios = require("axios");

            var headers = {
                maxContentLength: 99999999,
                headers: {
                    "api-key": apiKey,
                    "Content-Type": "application/json"
                }
            };

            //Create msg.agilite if it's null so we can store the result
            if (!msg.agilite)
                msg.agilite = {};

            switch (config.actionType) {
                case "1": //Create Batch Log Process
                    url = url + "/logs/batch/createProcess";
                    headers.headers["profile-key"] = profileKey;
                    break;
                case "2": //Get Log Batch Process
                    url = url + "/logs/batch/getProcessLogs";
                    headers.headers["profile-key"] = profileKey;
                    headers.headers["record-id"] = recordId;
                    break;
            }

            node.status({
                fill: "yellow",
                text: "Running",
                shape: "ring"
            });

            axios.get(url, headers)
                .then(function (response) {
                    msg.agilite.success = response.data.success;
                    msg.agilite.messages = response.data.messages;

                    if (response.data.success) {
                        msg.payload = response.data.data;

                        //Automatically add Log Process Id to msg.agilite.logProcessId
                        if (config.actionType === "1") {
                            msg.agilite.logProcessId = response.data.data._id;
                        }

                        switch (node.fieldType) {
                            case "msg":
                                RED.util.setMessageProperty(msg, node.field, response.data.data);
                                break;
                            case "flow":
                                node.context().flow.set(node.field, response.data.data);
                                break;
                            case "global":
                                node.context().global.set(node.field, response.data.data);
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
                            node.error(msg.agilite.messages, msg);
                        } else {
                            node.send(msg);
                        }
                    }
                })
                .catch(function (error) {
                    msg.payload = {};
                    
                    if (error.response) {
                        msg.agilite.success = error.response.data.success;
                        msg.agilite.messages = error.response.data.messages;
                    } else {
                        msg.agilite.success = false;
                        msg.agilite.messages = ["Unknown Error Occurred"];
                    }

                    node.status({
                        fill: "red",
                        text: "Error",
                        shape: "ring"
                    });

                    if (failFlow) {
                        node.error(msg.agilite.messages, msg);
                    } else {
                        node.send(msg);
                    }
                });
        });
    }

    RED.nodes.registerType("logs", Logs);
}