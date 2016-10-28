(function () {
    var outputEl = document.getElementById("output");
    var orientation = {};
    var connection = new Connection("ws://" + location.host + "/mobile");

    function output (str) {
        outputEl.innerHTML += str.replace(/\\n/, "<br/>");
    }

    if (!window.DeviceOrientationEvent) {
        alert("DeviceOrientation (accelerometer) is not supported on your device");
    }

    window.addEventListener("deviceorientation", function myself(e) {
        orientation.gamma = e.gamma;
        orientation.beta = e.beta;
        orientation.alpha = e.alpha;
    }, false);

    function getControlData () {
        var yaw = Math.floor(orientation.beta);
        if (orientation.gamma > 0) {
            yaw *= -1;
        }
        return {
            yaw: yaw
        };
    }

    requestAnimationFrame(function tick () {
        if (connection.active && orientation.gamma) {
            var msg = JSON.stringify(getControlData());
            console.log("Sending: " + msg);
            connection.send(msg);
        }
        requestAnimationFrame(tick);
    });
})();
