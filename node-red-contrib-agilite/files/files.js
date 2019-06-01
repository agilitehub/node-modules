const Agilite = require('agilite');

module.exports = function (RED) {
    function Files(config) {
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
            var responseType = "";
            var recordId = config.recordId;
            var url = "";
            var requestType = "";
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

                if (msg.agilite.files) {
                    if (msg.agilite.files.recordId) {
                        if (msg.agilite.files.recordId !== "") {
                            recordId = msg.agilite.files.recordId;
                        }
                    }

                    if (msg.agilite.files.responseType) {
                        if (msg.agilite.files.responseType !== "") {
                            responseType = msg.agilite.files.responseType;
                        }
                    }

                }
            }

            if (apiKey === "") {
                apiKey = serverConfig.credentials.apiKey;
            }

            if (recordId === "") {
                recordId = config.recordId;
            }

            if (responseType === "" && config.responseType && config.responseType !== "") {
                responseType = config.responseType;
            }else{
                responseType = "arraybuffer";
            }

            //Mustache
            recordId = Mustache.render(recordId, msg);

            //Validate Values
            if (apiKey === "") {
                success = false;
                errorMessage = "No valid API Key Provided. Please authenticate with Agilit-e first";
            } else if (url === "") {
                success = false;
                errorMessage = "No Server URL Provided";
            } else if (recordId === "") {
                success = false;
                errorMessage = "No Record Id Provided";
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
            if (!msg.agilite) {
                msg.agilite = {};
            }

            node.status({
                fill: "yellow",
                text: "Running",
                shape: "ring"
            });

            switch (config.actionType) {
                case "1": //Get File
                    agilite.Files.getFile(recordId, responseType)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;
                case "2": //Get File Name
                    agilite.Files.getFileName(recordId)
                        .then(function (response) {
                            reqSuccess(response);
                        })
                        .catch(function (error) {
                            reqCatch(error);
                        });
                    break;
                case "3": //Delete File
                    agilite.Files.deleteFile(recordId)
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

    RED.nodes.registerType("files", Files);
}