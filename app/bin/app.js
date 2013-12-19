sumeru.config({httpServerPort:8080,sumeruPath:"/../sumeru",site_url:"http://localhost:8080/"}),sumeru.router.add({pattern:"/itworks",action:"App.itworks"}),App.itworks=sumeru.controller.create(function(e,t){e.onrender=function(e){e("itworks",["push","left"])}}),sumeru.router.add({pattern:"/home",action:"App.home"}),sumeru.router.setDefault("App.home"),App.home=sumeru.controller.create(function(e,t){e.onrender=function(e){e("home",["push","left"])},e.onready=function(n){var r=sumeru.reachability.getStatus();console.log("network_status:"+r),t.event("setTarget",function(){Library.touch.on("#setTarget","touchend",function(){e.redirect("/target")})})}}),sumeru.router.add({pattern:"/location",action:"App.location"}),App.location=sumeru.controller.create(function(e,t){var n={},r=Library.generateId.getUserId(),i={},o=10,a=localStorage.getItem("userName")||"",s,u,l=Library.mapOverlay.createRoleController(),c="target",d,f,p=function(){if(s=t.get("groupId")){n.groupId=s;var r="true"==t.get("displayLocData");f=!0,t.location=e.subscribe("pubLocation",n,function(e){e.getData().forEach(function(e){i[e.userId]=e}),t.bind("locationLogBlock",{data:e.find(),displayLocData:r}),t.bind("settingBlock",{isAdmin:Library.generateId.isAdministrator(s)}),(!i[c]||sessionStorage.getItem("updateTargetFlag"))&&h(),u&&(l.updateRolesData(e.getData()),l.run(u))})}};e.onload=function(){return[p]},e.onrender=function(e){e("location",["push","right"])},e.onready=function(e){u=Library.bMapUtil.initMap(e.querySelector("#map"));var n=e.querySelector("#usernameInput");n.value=a,Library.touch.on("#top_setting","touchend",function(){e.querySelector("#setting").style.display="block"}),Library.touch.on("#settingClose","touchend",function(){e.querySelector("#setting").style.display="none"}),Library.touch.on("#invitation","touchend",function(){e.querySelector("#invitation_flow").style.display="block"}),Library.touch.on("#smsMethod","touchend",function(){}),Library.touch.on("#weixinMethod","touchend",function(){}),Library.touch.on("#erweimaMethod","touchend",function(){}),Library.touch.on("#shareClose","touchend",function(){e.querySelector("#invitation_flow").style.display="none"}),Library.touch.on("#setUsername","touchend",function(){var r=n.value.trim();return""==r?(alert("input your name firstly"),!1):(a=r,localStorage.setItem("userName",a),e.querySelector("#setting").style.display="none",t.set("groupId",Library.generateId.getGroupId()),t.commit(),void 0)});var r=setInterval(function(){s&&(clearInterval(r),Library.location.genererateLoction(u,f,d))},100)},d=function(e){if(i[r]){var n=i[r].coordinate.length;n>=o&&i[r].coordinate.splice(0,n-o),i[r].coordinate.push(e),t.location.update({name:a},{groupId:s,userId:r})}else{var u={userId:r,groupId:s,coordinate:[e],name:a};t.location.add(u)}t.location.save()};var h=function(){if(sessionStorage.setItem("updateTargetFlag",""),s&&Library.generateId.isAdministrator(s)){var n={lat:sessionStorage.getItem("targetPos-lat"),lng:sessionStorage.getItem("targetPos-lng")};if(sessionStorage.getItem("targetPos-lat")){var o="目的地:"+sessionStorage.getItem("targetAddress");if(i[c])i[r].coordinate=[n],t.location.update({name:o},{groupId:s,userId:c});else{var a={userId:c,groupId:s,coordinate:[n],name:o};t.location.add(a)}t.location.save()}else alert("终点数据不可用，请重新设置终点！"),e.redirect("/target")}}}),sumeru.router.add({pattern:"/target",action:"App.target"}),App.target=sumeru.controller.create(function(e,t){var n;e.onrender=function(e){e("target",["push","left"])},e.onready=function(r){function i(e,t){var n=Library.location.formatLoction(e);sessionStorage.setItem("targetPos-lat",n.lat),sessionStorage.setItem("targetPos-lng",n.lng),sessionStorage.setItem("targetAddress",t),a()}function o(e){console.log("@@@",e),n.clearOverlays();var r=Library.location.formatLoction(e);sessionStorage.setItem("targetPos-lat",r.lat),sessionStorage.setItem("targetPos-lng",r.lng);var i=new BMap.Point(e.lng,e.lat);Library.location.pointToAddress(i,s),markergps=new BMap.Marker(i),n.addOverlay(markergps);var o=new BMap.Label("终点",{offset:new BMap.Size(20,-10)});markergps.setLabel(o),n.panTo(i),"/location"==t.get("prePage")&&sessionStorage.setItem("updateTargetFlag",1),a()}function a(){f.disabled=!1}function s(e,t){d.value=t,sessionStorage.setItem("targetAddress",t),u(t)}function u(e){var t=[];t.push(document.querySelector("#targetName")),t.push(document.querySelector("#locationTargetAddress")),t.forEach(function(t){t&&t.value&&(t.value=e)})}function l(){d.value="正在查询你的位置，请等待..."}function c(e){d.value=e}n=Library.bMapUtil.initMap(r.querySelector("#map")),Library.bMapUtil.keywordLocation(n,r.querySelector("#suggestId"),i);var d=r.querySelector("#suggestId"),f=r.querySelector("#goOn");f.disabled=!0,Library.touch.on("#goOn","touchend",function(){e.redirect("/location")}),Library.touch.on("#setself","touchend",function(){Library.bMapUtil.getLocation(o,c,l)}),Library.touch.on("#setDestination","touchend",function(){document.getElementById("selectDestinationMethod").style.display="block"}),Library.touch.on("#setAddressFormLBS","touchend",function(){}),Library.touch.on("#inputAddress","touchend",function(){document.getElementById("selectDestinationMethod").style.display="none",document.getElementById("r-result").style.display="block"}),Library.touch.on("#cancelOption","touchend",function(){document.getElementById("selectDestinationMethod").style.display="none"})}}),Model.location=function(e){e.config={fields:[{name:"userId",type:"string"},{name:"name",type:"string"},{name:"groupId",type:"string"},{name:"coordinate",type:"array",defaultValue:[]}]}},Library.generateId=sumeru.Library.create(function(e){return e.generateUserId=function(){return sumeru.clientId},e.getUserId=function(){return this.userId||(this.userId=this.generateUserId()),this.userId},e.generateGroupId=function(){return this.getUserId()+"_"+(new Date).getTime()},e.getGroupId=function(){return this.groupId||(this.groupId=this.generateGroupId()),this.groupId},e.isAdministrator=function(e){var t=e.split("_");return t.pop(),this.getUserId()===t.join("_")},e}),Library.location=sumeru.Library.create(function(e){e.genererateLoction=function(e,r,i,o){var a={error:o||function(e){console.log("H5 failed ",e)},success:i||function(e){console.log("H5 success ",e)}};this.map=e,r?n(a):t(a)},e.formatLoction=function(e){var t={};return t=e.coords?{lat:e.coords.latitude,lng:e.coords.longitude}:e.point?{lat:e.point.lat,lng:e.point.lng}:{lat:e.lat,lng:e.lng}};var t=function(t){var n=15e3,r={enableHighAccuracy:!0,maximumAge:14e3},i=100,o=new BMap.Geolocation,a=function(){o.getCurrentPosition(s,r)},s=function(n){var r=e.currentLoc,a=o.getStatus();if(BMAP_STATUS_SUCCESS==a){var s=e.formatLoction(n),u=new BMap.Point(s.lng,s.lat);if(r&&e.map.getDistance(r,u)<i)return console.log("Distance is too short to log it!",e.map.getDistance(r,u)),!1;e.currentLoc=u,t.success(s)}else t.error(a)};a(),setInterval(a,n)},n=function(t){function n(e){e||(e=.005);var t=Math.random()*i*e;return t}var r={lng:116.387428,lat:39.90923},i=.05,o=5e3,a=function(){var i={},o=e.currentLoc;o?(i.lat=o.lat+n(),i.lng=o.lng+n()):(i.lat=r.lat+n(1),i.lng=r.lng+n(1)),i.time=(new Date).getTime(),e.currentLoc=i,t.success(i)};a(),setInterval(a,o)};return e}),Library.mapOverlay=sumeru.Library.create(function(e){return e.createRole=function(e){var t=function(e){var t=this,n;this.dataSource=e;var r=function(){return t.dataSource.name||t.dataSource.userId},i=function(){return t.dataSource.userId===Library.generateId.getUserId()},o=function(){return"target"===t.dataSource.userId},a,s,u=new BMap.Label(r(),{offset:new BMap.Size(20,-10)}),l=[];this.lineStyle={},this.getBMapPointArr=function(e){if(e||0==this.BMapPointArr.length){var t=this.dataSource.coordinate||[];t.forEach(function(e){l.push(new BMap.Point(e.lng,e.lat))})}return l},this.setMap=function(e){n=e},this.run=function(){var e=this.getBMapPointArr(!0);if(0!=e.length){s=new BMap.Polyline(e,{strokeColor:"blue",strokeWeight:3,strokeOpacity:0}),n.addOverlay(s);var t=e[e.length-1];a=new BMap.Marker(t),n.addOverlay(a),a.setLabel(u),o()&&a.setAnimation(BMAP_ANIMATION_BOUNCE),i()&&n.panTo(t)}},this.clear=function(){n.removeOverlay(a),n.removeOverlay(s)}};return new t(e)},e.createRoleController=function(){var e=this,t=function(){var t=[];this.init=function(n){n.forEach(function(n){t.push(e.createRole(n))},this)},this.updateRolesData=function(e){this.removeAllRoles(),this.init(e)},this.removeAllRoles=function(){t.forEach(function(e){e.clear(),e=null}),t=[]},this.run=function(e){t.forEach(function(t){t.setMap(e),t.run()})}};return new t},e}),Library.bMapUtil=sumeru.Library.create(function(e){return e.initMap=function(e){var t=new BMap.Map(e),n=new BMap.Point(116.404,39.915);return t.centerAndZoom(n,15),t.enableScrollWheelZoom(),t.addControl(new BMap.NavigationControl),t},e.keywordLocation=function(e,t,n){function r(){function t(){var t=r.getResults().getPoi(0).point;e.centerAndZoom(t,18),e.addOverlay(new BMap.Marker(t)),n(t,o)}e.clearOverlays();var r=new BMap.LocalSearch(e,{onSearchComplete:t});r.search(o)}var i=new BMap.Autocomplete({input:t,location:e}),o;i.addEventListener("onconfirm",function(e){var t=e.item.value;o=t.province+t.city+t.district+t.street+t.business,r()})},e.getLocation=function(e,t,n){var r=new BMap.Geolocation,i={enableHighAccuracy:!0,maximumAge:15e3},o=function(e){console.log("H5 failed ",e)};t||(t=o),r.getCurrentPosition(a),n&&n();var a=function(n){var i=r.getStatus();BMAP_STATUS_SUCCESS==i?e(n):t(i)}},e.pointToAddress=function(e,t){var n=new BMap.Geocoder;n.getLocation(e,function(e){var n=e.addressComponents,r=n.province+", "+n.city+", "+n.district+", "+n.street+", "+n.streetNumber;t(addCompOriObj,addressStr)})},e});