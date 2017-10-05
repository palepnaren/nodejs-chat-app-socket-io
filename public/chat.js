$(function(){
   
    var socket = io.connect();
        $msg = $('#pingHere');
        $text = $('#msg');
        $users = $('#users');
        $messages = $('#messages');
        $error = $('#errorMessage');
        $userForm = $('#userForm');
        $name = $('#name');
        $chat = $('#chat');
        $button = $('#userForm');
        $username = '';
    
    $('.container').show();
    $('#chatRoom').hide();
    
    $text.on('keydown',function(e){
       
        if(e.keyCode==13){
            $msg.submit();
            return false;
        }
    });
    
    $button.on('submit', function(e){
        e.preventDefault();
        $username = $name.val();
        socket.emit('new user',$name.val(),function(data){
            if(data){
                $('.container').hide();
                $('#chatRoom').show();
            }
            else{
                $error.html('Choose a different nickname since it is been already taken.');
            }
            $name.val('');
        });
        
        
    });
    
    socket.on('usernames',function(data){
        var creatElement  = '<ul class="list-group">';
        
        for(var i=0;i<data.length;i++){
            creatElement +='<li class="list-group-item">'+data[i]+'</li>';
        }
        creatElement = creatElement+'</ul>';
        $users.append(creatElement);
    });
    
    $msg.submit(function(e){
       e.preventDefault();
        socket.emit('sending message',$text.val(),function(data){
            $chat.append('<p align="right">'+data+'&nbsp;&nbsp;</p><br>');
        });
        $text.val('');
    });
    
    socket.on('new message',function(data){
       
        if(data.name==$username){
            $chat.append('<p align="right" id="newMsg"><b>'+data.name+': </b>'+data.msg+'</p><br>');
        }
        else{
            $chat.append('<p align="left" id="newMsg"> <b>'+data.name+': </b>'+data.msg+'</p><br>');
        }
        scrollCorrect();
    });
    
    socket.on('wisper',function(data){
        $chat.append('<p align="right" id="newMsg" class="wisper"><b>'+data.name+': </b>'+data.msg+'</p><br>');
    });
    
    socket.on('private',function(data){
        $chat.append('<p align="right" id="newMsg" class="private"><b>'+$username+'@'+data.name+': </b>'+data.msg+'</p><br>');
    });
    function scrollCorrect(){
             $messages.scrollTop($chat.outerHeight());
        }
});