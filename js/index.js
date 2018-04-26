//openfire bosh server address
var BOSH_SERVICE = 'http://119.29.183.171:7070/http-bind/';
var connection = null;
function log(msg) {
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}
function rawInput(data) {
    console.log('接收消息: ' + data);
}
function rawOutput(data) {
    console.log('发送消息: ' + data);
}
//连接
function onConnect(status) {
    if (status === Strophe.Status.CONNECTING) {
        log('openfire连接中');
    } else if (status === Strophe.Status.CONNFAIL) {
        log('openfire连接失败');
        $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.DISCONNECTING) {
        log('openfire连接断开中');
    } else if (status === Strophe.Status.DISCONNECTED) {
        log('openfire连接断开');
        $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
        log('openfire连接成功');
        log('openfire服务器:  ' + connection.jid + ' 开始聊天');
        connection.addHandler(onMessage, null, 'message', null, null, null);
        connection.send($pres().tree());
    }
}
//收到消息
function onMessage(msg) {
    console.log("----------------------收到消息----------------------");
    console.log(msg);
    console.log("----------------------收到消息----------------------");
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    if (type === "chat" && elems.length > 0) {
        var body = elems[0];
        log(from + ': ' + Strophe.getText(body));
    }
    return true;
}
//发送消息
function sendMessage() {
    var message = $('#message').get(0).value;
    console.log("----------------------发送消息----------------------");
    console.log(message);
    console.log("----------------------发送消息----------------------");
    var to = $('#to').get(0).value;
    if (message && to) {
        var reply = $msg({
            to: to,
            type: 'chat'
        }).cnode(Strophe.xmlElement('body', message)).up();
        connection.send(reply);
        log(to + ': ' + message);
    }
}
$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;
    Strophe.log = function (level, msg) {
        console.log('[log] [' + level + ']' + msg);
    };
    $('#connect').bind('click', function () {
        var button = $('#connect').get(0);
        if (button.value === 'connect') {
            button.value = 'disconnect';
            connection.connect($('#jid').get(0).value, $('#pass').get(0).value, onConnect);
        } else {
            button.value = 'connect';
            connection.disconnect();
        }
    });
    $('#send').bind('click', function () {
        sendMessage();
    });
});