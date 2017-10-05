jQuery(function($){
       var socket=io.connect();
       var $messageForm=$('#message-box');
       var $messageBox=$('#message');
       var $chat=$('#chat');

       var chatOuter=$('#chatWrap');
       var chatInner=$('#chat');

       var $users=$('#users');
       var $nickForm=$('#setNick');
       var $nickError=$('#nickError');
       var $nickBox=$('#nickname');
       var title='anonymous';

       $('#message').keydown(function(event) {
          if (event.keyCode == 13) {
               $(this.form).submit()
              return false;
             }
       });


       $nickForm.submit(function(e){
           e.preventDefault();
           title=$nickBox.val();
           socket.emit('new user',$nickBox.val(),function(data){
                if(data){
                  $('#nickWrap').hide();
                    document.title=title;
                  $('#chatWindow').show();
                }else{
                  $nickError.html("Sorry, that nickname is already taken , try something else");
                }
           });
           $nickBox.val('');
       });

       socket.on('usernames',function(data){
            var html='<ul>';
            for(i=0;i<data.length;i++){
              html+='<li><span>'+data[i]+'</span></li>';
            }
            html=html+'</ul>';
            $users.html(html);
        });



       $messageForm.submit(function(e){
            e.preventDefault();
            socket.emit('send message',$messageBox.val(),function(data){
              $chat.append("<p align='right' class='error'>"+data+"&nbsp;&nbsp;</p><br/>");
            });
            $messageBox.val('');
       });



       socket.on('new message',function(data){
         if(data.nick===title){
           $chat.append("<p style='' align='right' class='msg'><b>"+data.nick+" : </b>"+data.msg+"&nbsp;&nbsp;</p>");
         }else{
           $chat.append("<p style='' align='left' class='msg'><b>&nbsp;&nbsp;&nbsp;"+data.nick+" : </b>"+data.msg+"</p>");
         }
         scrollCorrect();
       });



       socket.on('whisper',function(data){
           $chat.append("<p align='left' class='whisper'><b>&nbsp;&nbsp;&nbsp;"+data.nick+" : </b>"+data.msg+"</p><br/>");

       });

       socket.on('private',function(data){
           $chat.append("<p align='right' class='whisper'><b>"+title+"@"+data.nick+": </b>"+data.msg+"&nbsp;&nbsp;</p><br/>");

       });


        function scrollCorrect(){
             chatOuter.scrollTop(chatInner.outerHeight());
        }
    });
