const Agilite = require('agilite');

module.exports = function (RED) {
    function Adhoc(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        var success = true;
        var errorMessage = "";
        this.field = config.field || "payload";
        this.fieldType = config.fieldType || "msg";
        
        const typeDetect = require('type-detect');
        const Mustache = require('mustache');

        this.on('input', function (msg) {
            var serverConfig = RED.nodes.getNode(config.server);
            var apiKey = "";
            var dateTimeValue = config.dateTimeValue;
            var formatKey = config.formatKey;
            var url = "";
            var action = "";
            var data = null;
            var failFlow = config.failFlow;

            url = serverConfig.server;

            //Check if there's valid data to pass
            switch(config.actionType){
                case "1": //Encode XML
                case "6": //Decode XML
                case "7": //XML to JS
                case "2": //Convert HTML to JSON
                    //Make sure data is a string
                    if (typeDetect(msg.payload) !== "string")
                        msg.payload = "";

                        data = msg.payload;
                    break;
                case "8": //JS to XML
                case "3": //Generate PDF
                    //Make sure data is a object
                    if (typeDetect(msg.payload) !== "Object")
                        msg.payload = {};

                        data = msg.payload;
                    break;
                default: //get request
                    data = null;
            }

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
            }

            if (apiKey === "") {
                apiKey = serverConfig.credentials.apiKey;
            }

            //We need a token, key and data to proceed
            if (apiKey === "") {
                success = false;
                errorMessage = "No valid API Key Provided. Please authenticate with Agilit-e first";
            } else if (url === "") {
                success = false;
                errorMessage = "No Server URL Provided";
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

            dateTimeValue = Mustache.render(dateTimeValue, msg);
            formatKey = Mustache.render(formatKey, msg);

            //Create msg.agilite if it's null so we can store the result
            if (!msg.agilite)
                msg.agilite = {};

            switch (config.actionType) {
                case "1": //Encode XML
                    action = "encodeXML";
                    break;
                case "2": //Convert HTML to JSON
                    action = "html2json";
                    break;
                case "3": //Generate PDF
                    action = "generatePDF";
                    break;
                case "4": //Generate UUID
                    action = "generateUUID";
                    break;
                case "5": //Format Dated/Time Value
                    action = "formatDateTime";
                    break;
                case "6": //Decode XML
                    action = "decodeXML";
                    break;
                case "7": //XML to JS
                    action = "XMLToJS";
                    break;
                case "8": //JS to XML
                    action = "JSToXML";
                    break;
            }

            node.status({
                fill: "yellow",
                text: "Running",
                shape: "ring"
            });

            agilite.Utils[action](action !== "formatDateTime" ? data : dateTimeValue, formatKey)
                .then(function (response){
                        
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

    RED.nodes.registerType("adhoc", Adhoc);
}