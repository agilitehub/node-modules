const Agilite = require('agilite');

module.exports = function (RED) {
    function IoEConnectors(config) {
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
            var routeKey = config.routeKey;
            var data = null;
            var url = "";
            var failFlow = config.failFlow;

            url = serverConfig.server;

            //Check if there's valid data to pass
            if (typeDetect(msg.payload) !== "Object")
                msg.payload = {};

            data = msg.payload;

            //Check if we need to use a profile and route key passed to this node
            if (msg.agilite) {
                if (msg.agilite.apiKey) {
                    if (msg.agilite.apiKey !== "") {
                        apiKey = msg.agilite.apiKey;
                    }
                }

                if (msg.agilite.connectors) {
                    if (msg.agilite.connectors.profileKey) {
                        if (msg.agilite.connectors.profileKey !== "") {
                            profileKey = msg.agilite.connectors.profileKey;
                        }
                    }

                    if (msg.agilite.connectors.routeKey) {
                        if (msg.agilite.connectors.routeKey !== "") {
                            routeKey = msg.agilite.connectors.routeKey;
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

            if (routeKey === "") {
                routeKey = config.routeKey;
            }

            //Mustache
            profileKey = Mustache.render(profileKey, msg);
            routeKey = Mustache.render(routeKey, msg);

            //We need a token, keys and data to proceed
            if (apiKey === "") {
                success = false;
                errorMessage = "No valid API Key Provided. Please authenticate with Agilit-e first";
            } else if (url === "") {
                success = false;
                errorMessage = "No Server URL Provided";
            } else if (profileKey === "") {
                success = false;
                errorMessage = "No Profile Key Provided";
            } else if (routeKey === "") {
                success = false;
                errorMessage = "No Route Key Provided";
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

            agilite.Connectors.execute(profileKey, routeKey, data)
                .then(function (response) {
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
                })
                .catch(function (error) {
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
                });
        });
    }

    RED.nodes.registerType("connectors", IoEConnectors);
}