/**
 * Created by yunlong on 13-12-10.
 */


            var last_note = locationCollection.

            if (last_note){
                last_note.play();
            }


env.onready = function(){
//        session.notes.destroy();
    if(!map) {
        map = new BMap.Map("map");            // 创建Map实例
        var point = new BMap.Point(116.404, 39.915);    // 创建点坐标
        map.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。
        map.enableScrollWheelZoom();                            //启用滚轮放大缩小
    }

    Library.touch.on("#positionBtn","touchend",getPosition);

        $(".drum").bind("hit", function(e){
            $drum = $(this)
            var pitch = $drum.data('number');
            var instrument = 'drum';
            $drum.attr("class",'drum hitted');
            setTimeout(function(){
                $drum.attr("class",'drum');
            }, 250)
            addNote(pitch, instrument);
        });
        $('.drum').mousedown(function(e){$(this).trigger("hit")});
        keymaster('0,1,2,3,4,5', keyboardPress);
}


    var keyboardPress = function(e){
        e.preventDefault();
        $(".drum[data-number='" + this.key + "']").trigger("hit")
    }
    var addNote = function(pitch, instrument){
        if (session.notes.length > 100){
            session.notes.destroy()
        }
        session.notes.add({
            pitch: pitch,
            instrument: instrument
        });
        session.notes.save();
    };