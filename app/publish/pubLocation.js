/**
 * Created by yunlong on 13-12-5.
 */

module.exports = function(fw) {
    fw.publish('location', 'pubLocation', function(options,callback) {
        var collection = this;
        collection.find({groupId:options.groupId}, function(err, items) {
//            items = [{userid:"12",name:"34",groupid:"56",x:1,y:2}];
            callback(items);
        });
    })
};