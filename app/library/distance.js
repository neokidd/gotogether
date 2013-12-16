/**
 * Created by yunlong on 13-12-16.
 */


Library.distance = sumeru.Library.create(function(exports){
    var earthRadius = 6378.137;//地球半径

    function rad(d){
        return d * Math.PI / 180;
    }

    exports.getDistance = function(point1,point2){
        var radLat1 = rad(point1.latitude);
        var radLat2 = rad(point2.latitude);
        var a = radLat1 - radLat2;
        var b = rad(point1.longitude) - rad(point2.longitude);

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
            Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s * earthRadius;
        s = Math.round(s * 10000) / 10000;
        return s;
    };


    return exports;
});