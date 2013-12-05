/**
 * Created by yunlong on 13-12-5.
 */
sumeru.router.add(
    {
        pattern: '',
        action: 'App.home'
    }
);


App.home = sumeru.controller.create(function(env, session){
//    var getMsgs = function(){
//        session.notes = env.subscribeByPage('music', {pagesize:1, page:0}, function(noteCollection){
//            //manipulate synced collection and bind it to serveral view blocks.
//            var last_note = noteCollection.slice(-1)[0];
//            if (last_note){
//                last_note.play();
//            }
//        });
//    };
//    env.onload = function(){
//        return [getMsgs];
//    };
    env.onrender = function(doRender){
        doRender("home", ['push','left']);
    };

    env.onready = function(){
//        session.notes.destroy();

//        var point = new BMap.Point(116.331398,39.897445);
//        map.centerAndZoom(point,18);
//        var i = 0;
//        navigator.geolocation.watchPosition(successCallback,
//            errorCallback,
//            {maximumAge:600000, enableHighAccuracy:true});

        Library.touch.on("#positionBtn","touchend",getPosition);


//        $(".drum").bind("hit", function(e){
//            $drum = $(this)
//            var pitch = $drum.data('number');
//            var instrument = 'drum';
//            $drum.attr("class",'drum hitted');
//            setTimeout(function(){
//                $drum.attr("class",'drum');
//            }, 250)
//            addNote(pitch, instrument);
//        });
//        $('.drum').mousedown(function(e){$(this).trigger("hit")});
//        keymaster('0,1,2,3,4,5', keyboardPress);
    };

    function successCallback(position) {
        // By using the 'maximumAge' option above, the position
        // object is guaranteed to be at most 10 minutes old.
        var p = new BMap.Point(position.coords.longitude, position.coords.latitude);
        var mk = new BMap.Marker(p);
        map.addOverlay(mk);
        map.panTo(p);
        //alert('您的H5位置：'+p.lng+','+p.lat);
        //document.getElementById("txtlog").innerHtml.value= i++ + ' 您的H5位置：'+p.lng+','+p.lat;
    }

    function errorCallback(error) {
        // Update a div element with error.message.
        alert('H5 failed'+ error.code);
    }

    function getPosition() {
        navigator.geolocation.getCurrentPosition(successCallback,
            errorCallback,
            {maximumAge:600000, enableHighAccuracy:true});
    }


//
//    var keyboardPress = function(e){
//        e.preventDefault();
//        $(".drum[data-number='" + this.key + "']").trigger("hit")
//    }
//    var addNote = function(pitch, instrument){
//        if (session.notes.length > 100){
//            session.notes.destroy()
//        }
//        session.notes.add({
//            pitch: pitch,
//            instrument: instrument
//        });
//        session.notes.save();
//    };
});
