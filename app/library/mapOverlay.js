/**
 * Created by yunlong on 13-12-11.
 */
Library.mapOverlay = sumeru.Library.create(function(exports){

    exports.createRole = function(roleData){
        var role = function(roleData){
            var me = this;
            var bm;
            this.dataSource = roleData;

            var getUserIdentity = function(){
                return me.dataSource.name || me.dataSource.userId;
            }

            var isSelf = function(){
                return me.dataSource.userId === Library.generateId.getUserId();
            }

            var markergps;
            var polyline;

            var labelgps = new BMap.Label(getUserIdentity(),{offset:new BMap.Size(20,-10)});

            var BMapPointArr = [];

            this.lineStyle = {};

            this.getBMapPointArr = function(update){
                if(update || 0 == this.BMapPointArr.length) {
                    var locationPointArr = this.dataSource.coordinate || [];
                    locationPointArr.forEach(function(item){
                        BMapPointArr.push(new BMap.Point(item.lng,item.lat));
                    });
                }

                return BMapPointArr;
            };

            this.setMap = function(map){
                bm = map;
            };

            this.run = function(){
                var allBMapPoint = this.getBMapPointArr(true);
                if(0 == allBMapPoint.length){
                    return;
                }

                polyline = new BMap.Polyline(allBMapPoint, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0});
                bm.addOverlay(polyline);

                var currentPoint = allBMapPoint[allBMapPoint.length - 1];
                markergps = new BMap.Marker(currentPoint);
                bm.addOverlay(markergps); //添加标注
                markergps.setLabel(labelgps); //添加标注
                if(isSelf()) {
                    bm.panTo(currentPoint);
                }

            }

            this.clear = function(){
                bm.removeOverlay(markergps);
                bm.removeOverlay(polyline);

            }
        };

        return new role(roleData);
    };

    exports.createRoleController = function(){
        var me = this;
        var roleController = function(){
            var rolePool = [];

            this.init = function(usersInfo){
                usersInfo.forEach(function(item){
                    rolePool.push(me.createRole(item));
                },this);
            };


            this.updateRolesData = function(usersInfo){
                this.removeAllRoles();
                this.init(usersInfo);
            };


            this.removeAllRoles = function(){
                rolePool.forEach(function(item){
                    item.clear();
                    item = null;
                });
                rolePool = [];
            };

            this.run = function(map){
                rolePool.forEach(function(item){
                    item.setMap(map);
                    item.run();
                });
            }

        }

        return new roleController();

    }


    return exports;
});
