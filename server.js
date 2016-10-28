var express = require('express');
var cookieSession = require('cookie-session');
var http = require('http');
var app = express();
//var expressWs = require('express-ws')(app);
var WebSocket = require('ws');
var url = require('url');

app.use(express.static('public'));

app.engine('hjs', require('hogan-express'));
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

var server = http.createServer(app);
app.listen = function() {
    return server.listen.apply(server, arguments);
};
var wss = new WebSocket.Server({server: server});
var wsScreen, wsClients = [];

app.get('/screen', require('./routes/screenRouter.js'));
app.get('/mobile', require('./routes/mobileRouter.js'));

wss.on('connection', function (ws) {
    var location = url.parse(ws.upgradeReq.url, true);
    console.log('Connection url: ', location);

    if (location.pathname === '/mobile') {
        setupClientWebSocket(ws);
    } else if (location.pathname === '/screen') {
        setupScreenWebSocket(ws);
    }
});

function setupClientWebSocket (ws) {
    wsClients.push(ws);

    ws.on('message', function incoming(message) {
        console.log('message from client: %s', message);
        if (wsScreen) {
            wsScreen.send(message);
        }
    });

    ws.on('close', function disconnect() {
        wsClients.splice(wsClients.indexOf(wsClients), 1);
    });

    ws.send('init ok');
}

function setupScreenWebSocket (ws) {
    wsScreen = ws;

    ws.on('message', function incoming(message) {
        console.log('message from screen: %s', message);
        var currentClient = wsClients[0];
        if (currentClient) {
            currentClient.send(message);
        }

    });

    ws.on('close', function disconnect() {
        wsScreen = undefined;
    });

    ws.send('init ok');
}

/*app.get('/', function (req, res) {
  res.send('Hello World');
});*/

/*app.ws('/echo', function(ws, req) {
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});

app.ws('/screen', function(ws, req) {
    ws.on('message', function(msg) {
        console.log('Message from screen. IP: ' + req.ip);
        ws.send(msg);
    });
});

app.ws('/mobile', function(ws, req) {
    ws.on('message', function(msg) {
        console.log('Message from mobile. IP: ' + req.ip);
        ws.send(msg);
    });
});*/

app.listen(3000);
