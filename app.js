var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

var port = process.env.PORT || 8080;
 server.listen(port);
console.log("server started."+port);

app.use(express.static(__dirname+'/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('index'); 
});

io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log("New connection: "+connections.length);
    
    socket.on('new user', function(data,callback){
       if(data in users){
           console.log('Username already taken');
        callback(false);
       }
        else{
            console.log("Name available");
            socket.username = data;
            users[socket.username]=socket;
            callback(true);
            updateName();
        }
    });
    
    function updateName(){
        io.sockets.emit('usernames',Object.keys(users));
    }
    
    socket.on('sending message',function(data,callback){
       
        var msg = data.trim();
        
        if(msg.substr(0,1)=='@'){
            msg = msg.substr(1);
            var index =msg.indexOf(' ');
            if(index != -1){
                var name = msg.substring(0,index);
                var msg = msg.substring(index+1);
                if(name in users){
                    users[name].emit('wisper',{msg:msg,name:socket.username});
                    socket.emit('private',{msg:msg,name:name});
                    console.log('Only the preson with @name will get the message');
                }
                else{
                    callback("This person "+name+" not onlie");
                }
                
            }else{
                callback("Please enter some text to send a message.")
            }
            
        }else{
            console.log("Got Message :"+data)
         io.sockets.emit('new message',{msg:msg,name:socket.username});
        }
        
    });
    
    socket.on('disconnect', function(data){
        if(!socket.username) return;
        delete users[socket.nickname];
        updateName();
    });
    
});
