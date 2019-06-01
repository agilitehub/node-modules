module.exports = function (RED) {
    function AgiliteLogin(config) {
        RED.nodes.createNode(this, config);

        this.serverType = config.serverType;
        this.server = config.server;
        this.apiKey = this.credentials.apiKey;
        this.name = config.name;
    }

    RED.nodes.registerType("agilite-login", AgiliteLogin, {
        credentials: {
            apiKey: {
                type: "password"
            }
        }
    });
}