function Connection (url) {
    this.websocket = new WebSocket(url);
    this.active = false;

    this.websocket.onopen = function () {
        console.log("CONNECTED");
        //this.send("WebSocket rocks");
        this.active = true;
    }.bind(this);
    this.websocket.onclose = function () {
        console.log("DISCONNECTED");
        this.active = false;
    }
    /*this.websocket.onmessage = function (evt) {
        //console.log("RESPONSE: " + evt.data);
        //this.websocket.close();
    }.bind(this);*/
    this.websocket.onerror = function (evt) {
        console.error("ERROR: " + evt.data);
    }
}

Connection.prototype.send = function (data) {
    console.log("SEND: " + data);
    this.websocket.send(data);
};
