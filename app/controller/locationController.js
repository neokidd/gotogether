/**
 * Created by yunlong on 13-12-5.
 */
sumeru.router.add(
    {
        pattern: '/location',
        action: 'App.location'
    }
);


App.location = sumeru.controller.create(function(env, session){

    var fetchOptions = {};
    var groupId;
    var userId = Library.generateId.getUserId();
    var usersInfo = {};
    var historyLocMaxLen = 10;
    var userName = localStorage.getItem('userName') || '';
    var map;
    var locSuccessCallback;
    var roleController = Library.mapOverlay.createRoleController();
    var isFakeLoc;
    var targetId = "target";

    var getLocation = function(){
        groupId = session.get('groupId');
        fetchOptions.groupId = groupId;
        var isDisplayLocData = "true" == session.get('displayLocData');
        isFakeLoc = "true" == session.get('fakeLoc');

        session.location = env.subscribe('pubLocation', fetchOptions,function(locationCollection){
            locationCollection.getData().forEach(function(item){
                usersInfo[item.userId] = item;
            });

            session.bind('locationLogBlock', {
                data : locationCollection.find(),
                displayLocData : isDisplayLocData
            });

            session.bind('goTargetBlock', {
                isAdmin: Library.generateId.isAdministrator(groupId)
            });

            if(!usersInfo[targetId] || sessionStorage.getItem('updateTargetFlag')){
                setTarget();
            }

            if(map) {
                roleController.updateRolesData(locationCollection.getData());
                roleController.run(map);
            }

        });

    };
    env.onload = function(){
        return [getLocation];
    };
    env.onrender = function(doRender){
        doRender("location", ['push','right']);
    };

    env.onready = function(viewRoot){
        map = Library.bMapUtil.initMap(viewRoot.querySelector('#map'));

        Library.touch.on("#back","touchend",function(){
            env.redirect('/home');
        });


        var usernameInput = viewRoot.querySelector("#usernameInput");
        usernameInput.value = userName;

        var addressInput = viewRoot.querySelector("#locationTargetAddress");
        targetAdress = sessionStorage.getItem('targetAddress');
        targetAdress && (addressInput.value = targetAdress);

        session.event('goTargetBlock',function(){
            Library.touch.on('#goTarget',"touchend",function(){
                env.redirect('/target',{prePage:'/location'});

            });
        });

        Library.touch.on("#setUsername","touchend",function(){
            var userNameTemp = usernameInput.value.trim();
            if('' == userNameTemp){
                alert('input your name firstly');
                return false;
            }

            userName = userNameTemp;
            localStorage.setItem('userName',userName);

        });

        Library.location.genererateLoction(map,isFakeLoc,locSuccessCallback);
    };

    locSuccessCallback = function(position) {

        if(!usersInfo[userId]) {
            var newItem = {
                'userId':userId,
                'groupId':groupId,
                'coordinate':[position],
                'name':userName
            };

            session.location.add(newItem);
        } else{
            var currLocLen = usersInfo[userId].coordinate.length;
            if(historyLocMaxLen <= currLocLen ) {
                usersInfo[userId].coordinate.splice(0,currLocLen - historyLocMaxLen );
            }
            usersInfo[userId].coordinate.push(position);

            session.location.update({'name':userName},{'groupId':groupId,'userId':userId});
        }
        session.location.save();
    }

    //后续添加server验证
    var setTarget = function(){
        sessionStorage.setItem('updateTargetFlag','');

        if(groupId && Library.generateId.isAdministrator(groupId)) {
            var position = {
                lat:sessionStorage.getItem('targetPos-lat'),
                lng:sessionStorage.getItem('targetPos-lng')
            };

            var targetName = '目的地:' + sessionStorage.getItem('targetAddress');

            if(!usersInfo[targetId]) {
                var newItem = {
                    'userId':targetId,
                    'groupId':groupId,
                    'coordinate':[position],
                    'name':targetName
                };

                session.location.add(newItem);
            } else {
                usersInfo[userId].coordinate = [position];

                session.location.update({'name':targetName},{'groupId':groupId,'userId':targetId});
            }
            session.location.save();
        }
    }


});
