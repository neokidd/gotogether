sumeru.router.add(
	{
		pattern: '/accel',
        action: 'App.accel'
	}
);

App.accel = sumeru.controller.create(function(env, session) {

    env.onrender = function(doRender){
        doRender("accelerometer", ['push','left']);
    };

    env.onready = function() {

        andAbsorbEvent('device');

        var steps;

        var s = {};
        var s1 = {};
        var flag=0;
        var flag1=0;
        var step=0;
        var i1=0;

        var detectSteps = function (sen) {
            var x = sen.x;
            var y = sen.y;
            var z = sen.z;

            console.log("Accel JS " + x + ", " + y + "," + z);

             for(var i = 1 ; i < 200 ; i++) {  
                    s1[i-1] = s[i] ;  
                }

                s1[199]=y;

                if (s1[0]!==0)
                {
                    flag1=1;
                }
                if(flag1==1)
                {
                    
                    for(i=1;i<30;i++){
                        if(s1[100]>s1[100-i])
                            if(s1[100]>11)
                            i1++;
                    }
                    for(i=1;i<30;i++){
                        if(s1[100]>s1[100+i])
                            if(s1[100]>11)
                            i1++;
                    }
                    if (i1==58)
                        step++;
                }
                console.log("steps:" + step);
                document.getElementById('step').innerText = step;
                i1=0;
                for(i = 0 ; i < 200 ; i++) {  
                    s[i] = s1[i] ;  
                }
        }

        var successCallback = function (ret) {
            var obj = document.getElementById('acceleration');
            //obj.innerHTML = JSON.stringify(ret, null, 4);
            document.getElementById('x').innerText = ret.x;
            document.getElementById('y').innerText = ret.y;
            document.getElementById('z').innerText = ret.z;
            document.getElementById('timestamp').innerText = ret.timestamp;

            detectSteps(ret);
        };


        var errorCallback = function (code) {
            var obj = document.getElementById('error');
            obj.innerHTML = code
        }
        ;

        var getAcceleration = function() {
            var device = nuwa.require('device');
            device.accelerometer.getCurrentAcceleration(successCallback, errorCallback);
        }

        var acceleration_id;
        var watchAcceleration = function() {
            var device = nuwa.require('device');
            ID = device.accelerometer.watchAcceleration(successCallback, errorCallback, {frequency: 500});
            var idspan = document.getElementById('acceleration_id');
            idspan.innerHTML = ID;
            acceleration_id = ID;
        }

        var stopWatchAcceleration = function () {
            var idspan = document.getElementById('acceleration_id');
            ID = idspan.innerTEXT;
            var device = nuwa.require('device');
            device.accelerometer.clearWatch(acceleration_id);
        }


        Library.touch.on('#getAcceleration','touchend', getAcceleration);
        Library.touch.on('#watchAcceleration','touchend', watchAcceleration);
        Library.touch.on('#stopWatchAcceleration','touchend', stopWatchAcceleration);


    }

});
