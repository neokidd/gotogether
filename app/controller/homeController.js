/**
 * Created by yunlong on 13-12-5.
 */
sumeru.router.add(
    {
        pattern: '/home',
        action: 'App.home'
    }
);

sumeru.router.setDefault('App.home');

App.home = sumeru.controller.create(function(env, session){

    var isDebug = false;

    env.onload = function(){
        return [function(){
            isDebug = session.get('debug');
            session.bind("debugBlock",{
                debug:isDebug
            })
        }];
    };

    env.onrender = function(doRender){
        doRender("home", ['push','left']);
    };

    env.onready = function(viewRoot){
        var genBtn = viewRoot.querySelector('#generateGroup');
        var userNameInput = viewRoot.querySelector('#userName');
        var shareLinkInput = viewRoot.querySelector('#shareLink');
        var goLocationBtn = viewRoot.querySelector('#goLocation');
        var goLocationalbe = false;
        var groupId;

        if(userNameInput.value.trim() == '' && localStorage.getItem("userName")) {
            userNameInput.value = String(localStorage.getItem("userName")).trim()
        }

        Library.touch.on("#generateGroup","touchend",function(){
            if(userNameInput.value.trim() == '') {
                alert('input your name firstly.');
                return false;
            }

            localStorage.setItem("userName",userNameInput.value.trim());

            groupId = Library.generateId.getGroupId();//"123456789Group";
            localStorage.setItem("groupId",groupId);
            shareLinkInput.value = "http://172.22.148.231:8080/" + "debug.html/location?groupId=" + groupId;
            goLocationalbe = true
        });

        Library.touch.on("#openApp","touchend", function(e){
            // 通过iframe的方式试图打开APP，如果能正常打开，会直接切换到APP，并自动阻止a标签的默认行为
            // 否则打开a标签的href链接
            var ifr = document.createElement('iframe');
            ifr.src = 'weixin://';
            ifr.style.display = 'none';
            document.body.appendChild(ifr);
            window.setTimeout(function(){
                document.body.removeChild(ifr);
            },3000)
        });

        Library.touch.on("#goLocation","touchend", goLocationPage);

        function goLocationPage(){
            if(goLocationalbe) {
                var query = {groupId:groupId};
                if(isDebug){
                    query.debug = 1;
                }
                env.redirect('/location',query);
            } else {
                alert("generate a share link firstly");
            }
        }



    }



});
