/**
 * Created by yunlong on 13-12-11.
 */
Library.generateLocation = sumeru.Library.create(function(exports){
    var baseLoc = {
        x:116.387428,
        y:39.90923
    };

    var baseStep = 0.05;

    exports.generateNewLoc = function(currentLoc){
        var newLoc = {};
        if(!currentLoc) {
            newLoc.x = baseLoc.x + adjustValue(1);
            newLoc.y = baseLoc.y + adjustValue(1);
        } else {
           newLoc.x = currentLoc.x + adjustValue();
           newLoc.y = currentLoc.y + adjustValue();
        }

        newLoc.time = new Date().getTime();

        return newLoc;
    };

    exports.generateNextLoc = function(locArr){
        if(locArr && 0 < locArr.length) {
            var currentLoc = locArr[locArr.length - 1];
        }

        return this.generateNewLoc(currentLoc);
    };



    function adjustValue(rate){
        if(!rate) {
            rate = 0.005;
        }

        var adjust = Math.random() * baseStep * rate;
        return adjust;
    }

    return exports;
});
