const Agilite = require('agilite');

module.exports = function (RED) {
    function TierStructures(config) {
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

            var tierKeys = config.tierKeys;
            var sortValues = config.sortValues;
            var valuesOutputFormat = config.valuesOutputFormat;
            var includeValues = config.includeValues;
            var includeMetaData = config.includeMetaData;
            var includeTierEntries = config.includeTierEntries;

            var url = "";
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

                if (msg.agilite.tierStructures) {
                    if (msg.agilite.tierStructures.tierKeys) {
                        if (msg.agilite.tierStructures.tierKeys !== "") {
                            tierKeys = msg.agilite.tierStructures.tierKeys;
                        }
                    }

                    if (msg.agilite.tierStructures.sortValues) {
                        if (msg.agilite.tierStructures.sortValues !== "") {
                            sortValues = msg.agilite.tierStructures.sortValues;
                        }
                    }

                    if (msg.agilite.tierStructures.valuesOutputFormat) {
                        if (msg.agilite.tierStructures.valuesOutputFormat !== "") {
                            valuesOutputFormat = msg.agilite.tierStructures.valuesOutputFormat;
                        }
                    }

                    if (msg.agilite.tierStructures.includeValues) {
                        if (msg.agilite.tierStructures.includeValues !== "") {
                            includeValues = msg.agilite.tierStructures.includeValues;
                        }
                    }

                    if (msg.agilite.tierStructures.includeMetaData) {
                        if (msg.agilite.tierStructures.includeMetaData !== "") {
                            includeMetaData = msg.agilite.tierStructures.includeMetaData;
                        }
                    }

                    if (msg.agilite.tierStructures.includeTierEntries) {
                        if (msg.agilite.tierStructures.includeTierEntries !== "") {
                            includeTierEntries = msg.agilite.tierStructures.includeTierEntries;
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
                    case "1": //getTierByKey
                        if (tierKeys === "") {
                            success = false;
                            errorMessage = "No Tier Keys Provided";
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
            tierKeys = Mustache.render(tierKeys, msg);
            sortValues = Mustache.render(sortValues, msg);
            valuesOutputFormat = Mustache.render(valuesOutputFormat, msg);

            // Finalize array properties
            tierKeys = tierKeys.split(",");

            //Create msg.agilite if it's null so we can store the result
            if (!msg.agilite)
                msg.agilite = {};

            node.status({
                fill: "yellow",
                text: "Running",
                shape: "ring"
            });

            switch (config.actionType) {
                case "1": //getTierByKey
                    agilite.TierStructures.getTierByKey(tierKeys, includeValues, includeMetaData, includeTierEntries, sortValues, valuesOutputFormat)
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

    RED.nodes.registerType("tier-structures", TierStructures);
}