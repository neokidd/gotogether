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

    var userId = Library.generateId.getUserId();
    var usersInfo = {};
    var historyLocMaxLen = 10;
    var userName = localStorage.getItem('userName') || '';
    var groupId;

    var map;
    var roleController = Library.mapOverlay.createRoleController();

    var targetId = "target";

    var locSuccessCallback;
    var isFakeLoc;

    var getLocation = function(){

        groupId = session.get('groupId');

        if(!groupId) {
            return;
        }

        fetchOptions.groupId = groupId;
        var isDisplayLocData = "true" == session.get('displayLocData');
        isFakeLoc = true;//"true" == session.get('fakeLoc');

        session.location = env.subscribe('pubLocation', fetchOptions,function(locationCollection){
            locationCollection.getData().forEach(function(item){
                usersInfo[item.userId] = item;
            });

            session.bind('locationLogBlock', {
                data : locationCollection.find(),
                displayLocData : isDisplayLocData
            });

            session.bind('settingBlock', {
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

        var usernameInput = viewRoot.querySelector("#usernameInput");
        usernameInput.value = userName;

        Library.touch.on('#modify_address',"touchend",function(){
            viewRoot.querySelector('#setting').style.display = "block";

        });

        Library.touch.on('#settingClose',"touchend",function(){
            viewRoot.querySelector('#setting').style.display = "none";

        });

        Library.touch.on("#setUsername","touchend",function(){
            var userNameTemp = usernameInput.value.trim();
            if('' == userNameTemp){
                alert('input your name firstly');
                return false;
            }

            userName = userNameTemp;
            localStorage.setItem('userName',userName);
            viewRoot.querySelector('#setting').style.display = "none";
            session.set('groupId',Library.generateId.getGroupId());
            session.commit();

        });

        var timeInt= setInterval(function(){
            if(groupId) {
                clearInterval(timeInt);
                Library.location.genererateLoction(map,isFakeLoc,locSuccessCallback);
            }
        },100);
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

            if(!sessionStorage.getItem('targetPos-lat')) {
                alert("终点数据不可用，请重新设置终点！");
                env.redirect('/target');
            } else {
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
    }

});
