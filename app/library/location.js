/**
 * Created by yunlong on 13-12-11.
 */
Library.location = sumeru.Library.create(function(exports){

    exports.genererateLoction = function(map,isFake,successCallback,errorCallback){
        var callBack = {
            error: errorCallback || function(error){
                console.log('H5 failed ', error);
            },

            success : successCallback ||function(position){
                console.log('H5 success ', position);
            }
        }

        this.map = map;

        isFake?fakeGenFunc(callBack):realGenFunc(callBack);
    };

    exports.formatLoction = function(originPoint){
        var formatPot = {};
        if(originPoint.coords) {
            formatPot = {
                lat:originPoint.coords.latitude,
                lng:originPoint.coords.longitude
            };
        } else if(originPoint.point){
            formatPot = {
                lat:originPoint.point.lat,
                lng:originPoint.point.lng
            };

        } else {
            formatPot = {
                lat:originPoint.lat,
                lng:originPoint.lng
            };
        }

        return formatPot;
    };


    var realGenFunc = function(callback){

        var timeInterval = 15000;
        var positionOptions = {
            enableHighAccuracy:true,
            maximumAge:14000
        }
        var distanceThreshold = 100;
        var geolocation = new BMap.Geolocation();

        var generateNewLoc = function(){
            geolocation.getCurrentPosition(locCallback,positionOptions);
        }

        var locCallback = function(pos){
            var currentLoc = exports.currentLoc;
            var status = geolocation.getStatus();
            if(BMAP_STATUS_SUCCESS == status){
                var position = exports.formatLoction(pos);
                var bPoint = new BMap.Point(position.lng,position.lat);
                if(currentLoc && exports.map.getDistance(currentLoc,bPoint) < distanceThreshold ) {
                    console.log("Distance is too short to log it!",exports.map.getDistance(currentLoc,bPoint));
                    return false;
                } else {
                    exports.currentLoc = bPoint;
                    callback.success(position);
                }

            } else {
                callback.error(status);
            }
        }

        generateNewLoc();
        setInterval(generateNewLoc,timeInterval);
    };


    var fakeGenFunc = function(callback){

        var baseLoc = {
            lng:116.387428,
            lat:39.90923
        };

        var baseStep = 0.05;
        var timeInterval = 5000;

        var generateNewLoc = function(){
            var newLoc = {};
            var currentLoc = exports.currentLoc;
            if(!currentLoc) {
                newLoc.lat = baseLoc.lat + adjustValue(1);
                newLoc.lng = baseLoc.lng + adjustValue(1);
            } else {
                newLoc.lat = currentLoc.lat + adjustValue();
                newLoc.lng = currentLoc.lng + adjustValue();
            }

            newLoc.time = new Date().getTime();
            exports.currentLoc = newLoc;

            callback.success(newLoc);

        };

        function adjustValue(rate){
            if(!rate) {
                rate = 0.005;
            }

            var adjust = Math.random() * baseStep * rate;
            return adjust;
        };

        generateNewLoc();
        setInterval(generateNewLoc,timeInterval);

    };

    return exports;
});
