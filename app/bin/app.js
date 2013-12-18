sumeru.config({httpServerPort:8080,sumeruPath:"/../sumeru",site_url:"http://172.22.148.251:8080/"}),sumeru.router.add({pattern:"/itworks",action:"App.itworks"}),App.itworks=sumeru.controller.create(function(e,t){e.onrender=function(e){e("itworks",["push","left"])}}),sumeru.router.add({pattern:"/home",action:"App.home"}),sumeru.router.setDefault("App.home"),App.home=sumeru.controller.create(function(e,t){e.onrender=function(e){e("home",["push","left"])},e.onready=function(n){t.event("setTarget",function(){Library.touch.on("#setTarget","touchend",function(){e.redirect("/target")})})}}),sumeru.router.add({pattern:"/location",action:"App.location"}),App.location=sumeru.controller.create(function(e,t){var n={},r,i=Library.generateId.getUserId(),o={},a=10,s=localStorage.getItem("userName")||"",u,l,c=Library.mapOverlay.createRoleController(),d,f="target",p=function(){r=t.get("groupId"),n.groupId=r;var i="true"==t.get("displayLocData");d="true"==t.get("fakeLoc"),t.location=e.subscribe("pubLocation",n,function(e){e.getData().forEach(function(e){o[e.userId]=e}),t.bind("locationLogBlock",{data:e.find(),displayLocData:i}),t.bind("goTargetBlock",{isAdmin:Library.generateId.isAdministrator(r)}),(!o[f]||sessionStorage.getItem("updateTargetFlag"))&&h(),u&&(c.updateRolesData(e.getData()),c.run(u))})};e.onload=function(){return[p]},e.onrender=function(e){e("location",["push","right"])},e.onready=function(n){u=Library.bMapUtil.initMap(n.querySelector("#map")),Library.touch.on("#back","touchend",function(){e.redirect("/home")});var r=n.querySelector("#usernameInput");r.value=s;var i=n.querySelector("#locationTargetAddress");targetAdress=sessionStorage.getItem("targetAddress"),targetAdress&&(i.value=targetAdress),t.event("goTargetBlock",function(){Library.touch.on("#goTarget","touchend",function(){e.redirect("/target",{prePage:"/location"})})}),Library.touch.on("#setUsername","touchend",function(){var e=r.value.trim();return""==e?(alert("input your name firstly"),!1):(s=e,localStorage.setItem("userName",s),void 0)}),Library.location.genererateLoction(u,d,l)},l=function(e){if(o[i]){var n=o[i].coordinate.length;n>=a&&o[i].coordinate.splice(0,n-a),o[i].coordinate.push(e),t.location.update({name:s},{groupId:r,userId:i})}else{var u={userId:i,groupId:r,coordinate:[e],name:s};t.location.add(u)}t.location.save()};var h=function(){if(sessionStorage.setItem("updateTargetFlag",""),r&&Library.generateId.isAdministrator(r)){var e={lat:sessionStorage.getItem("targetPos-lat"),lng:sessionStorage.getItem("targetPos-lng")},n="目的地:"+sessionStorage.getItem("targetAddress");if(o[f])o[i].coordinate=[e],t.location.update({name:n},{groupId:r,userId:f});else{var a={userId:f,groupId:r,coordinate:[e],name:n};t.location.add(a)}t.location.save()}}}),sumeru.router.add({pattern:"/target",action:"App.target"}),App.target=sumeru.controller.create(function(e,t){var n;e.onrender=function(e){e("target",["push","left"])},e.onready=function(r){function i(e,t){var n=Library.location.formatLoction(e);sessionStorage.setItem("targetPos-lat",n.lat),sessionStorage.setItem("targetPos-lng",n.lng),sessionStorage.setItem("targetAddress",t),document.querySelector("#targetName").value=t}function o(e){console.log("@@@",e),n.clearOverlays();var r=Library.location.formatLoction(e);sessionStorage.setItem("targetPos-lat",r.lat),sessionStorage.setItem("targetPos-lng",r.lng);var i=new BMap.Point(e.lng,e.lat);Library.location.pointToAddress(i,a),markergps=new BMap.Marker(i),n.addOverlay(markergps);var o=new BMap.Label("终点",{offset:new BMap.Size(20,-10)});markergps.setLabel(o),n.panTo(i),"/location"==t.get("prePage")&&sessionStorage.setItem("updateTargetFlag",1),d.enable=!0}function a(e,t){c.value=t,sessionStorage.setItem("targetAddress",t),s(t)}function s(e){var t=[];t.push(document.querySelector("#targetName")),t.push(document.querySelector("#locationTargetAddress")),t.forEach(function(t){t&&t.value&&(t.value=e)})}function u(){c.value="正在查询你的位置，请等待..."}function l(e){c.value=e}n=Library.bMapUtil.initMap(r.querySelector("#map")),Library.bMapUtil.keywordLocation(n,r.querySelector("#suggestId"),i);var c=r.querySelector("#suggestId"),d=view.querySelector("#goOn");d.enable=!1,Library.touch.on("#goOn","touchend",function(){e.redirect("/location")}),Library.touch.on("#setself","touchend",function(){Library.bMapUtil.getLocation(o,l,u)}),Library.touch.on("#setDestination","touchend",function(){document.getElementById("selectDestinationMethod").style.display="block"}),Library.touch.on("#setAddressFormLBS","touchend",function(){}),Library.touch.on("#inputAddress","touchend",function(){document.getElementById("selectDestinationMethod").style.display="none",document.getElementById("r-result").style.display="block"}),Library.touch.on("#cancelOption","touchend",function(){document.getElementById("selectDestinationMethod").style.display="none"})}}),Model.location=function(e){e.config={fields:[{name:"userId",type:"string"},{name:"name",type:"string"},{name:"groupId",type:"string"},{name:"coordinate",type:"array",defaultValue:[]}]}},Library.generateId=sumeru.Library.create(function(e){return e.generateUserId=function(){return sumeru.clientId},e.getUserId=function(){return this.userId||(this.userId=this.generateUserId()),this.userId},e.generateGroupId=function(){return this.getUserId()+"_"+(new Date).getTime()},e.getGroupId=function(){return this.groupId||(this.groupId=this.generateGroupId()),this.groupId},e.isAdministrator=function(e){var t=e.split("_");return t.pop(),this.getUserId()===t.join("_")},e}),Library.location=sumeru.Library.create(function(e){e.genererateLoction=function(e,r,i,o){var a={error:o||function(e){console.log("H5 failed ",e)},success:i||function(e){console.log("H5 success ",e)}};this.map=e,r?n(a):t(a)},e.formatLoction=function(e){var t={};return t=e.coords?{lat:e.coords.latitude,lng:e.coords.longitude}:e.point?{lat:e.point.lat,lng:e.point.lng}:{lat:e.lat,lng:e.lng}};var t=function(t){var n=15e3,r={enableHighAccuracy:!0,maximumAge:14e3},i=100,o=new BMap.Geolocation,a=function(){o.getCurrentPosition(s,r)},s=function(n){var r=e.currentLoc,a=o.getStatus();if(BMAP_STATUS_SUCCESS==a){var s=e.formatLoction(n),u=new BMap.Point(s.lng,s.lat);if(r&&e.map.getDistance(r,u)<i)return console.log("Distance is too short to log it!",e.map.getDistance(r,u)),!1;e.currentLoc=u,t.success(s)}else t.error(a)};a(),setInterval(a,n)},n=function(t){function n(e){e||(e=.005);var t=Math.random()*i*e;return t}var r={lng:116.387428,lat:39.90923},i=.05,o=5e3,a=function(){var i={},o=e.currentLoc;o?(i.lat=o.lat+n(),i.lng=o.lng+n()):(i.lat=r.lat+n(1),i.lng=r.lng+n(1)),i.time=(new Date).getTime(),e.currentLoc=i,t.success(i)};a(),setInterval(a,o)};return e}),Library.mapOverlay=sumeru.Library.create(function(e){return e.createRole=function(e){var t=function(e){var t=this,n;this.dataSource=e;var r=function(){return t.dataSource.name||t.dataSource.userId},i=function(){return t.dataSource.userId===Library.generateId.getUserId()},o=function(){return"target"===t.dataSource.userId},a,s,u=new BMap.Label(r(),{offset:new BMap.Size(20,-10)}),l=[];this.lineStyle={},this.getBMapPointArr=function(e){if(e||0==this.BMapPointArr.length){var t=this.dataSource.coordinate||[];t.forEach(function(e){l.push(new BMap.Point(e.lng,e.lat))})}return l},this.setMap=function(e){n=e},this.run=function(){var e=this.getBMapPointArr(!0);if(0!=e.length){s=new BMap.Polyline(e,{strokeColor:"blue",strokeWeight:3,strokeOpacity:0}),n.addOverlay(s);var t=e[e.length-1];a=new BMap.Marker(t),n.addOverlay(a),a.setLabel(u),o()&&a.setAnimation(BMAP_ANIMATION_BOUNCE),i()&&n.panTo(t)}},this.clear=function(){n.removeOverlay(a),n.removeOverlay(s)}};return new t(e)},e.createRoleController=function(){var e=this,t=function(){var t=[];this.init=function(n){n.forEach(function(n){t.push(e.createRole(n))},this)},this.updateRolesData=function(e){this.removeAllRoles(),this.init(e)},this.removeAllRoles=function(){t.forEach(function(e){e.clear(),e=null}),t=[]},this.run=function(e){t.forEach(function(t){t.setMap(e),t.run()})}};return new t},e}),Library.bMapUtil=sumeru.Library.create(function(e){return e.initMap=function(e){var t=new BMap.Map(e),n=new BMap.Point(116.404,39.915);return t.centerAndZoom(n,15),t.enableScrollWheelZoom(),t.addControl(new BMap.NavigationControl),t},e.keywordLocation=function(e,t,n){function r(){function t(){var t=r.getResults().getPoi(0).point;e.centerAndZoom(t,18),e.addOverlay(new BMap.Marker(t)),n(t,o)}e.clearOverlays();var r=new BMap.LocalSearch(e,{onSearchComplete:t});r.search(o)}var i=new BMap.Autocomplete({input:t,location:e}),o;i.addEventListener("onconfirm",function(e){var t=e.item.value;o=t.province+t.city+t.district+t.street+t.business,r()})},e.getLocation=function(e,t,n){var r=new BMap.Geolocation,i={enableHighAccuracy:!0,maximumAge:15e3},o=function(e){console.log("H5 failed ",e)};t||(t=o),r.getCurrentPosition(a),n&&n();var a=function(n){var i=r.getStatus();BMAP_STATUS_SUCCESS==i?e(n):t(i)}},e.pointToAddress=function(e,t){var n=new BMap.Geocoder;n.getLocation(e,function(e){var n=e.addressComponents,r=n.province+", "+n.city+", "+n.district+", "+n.street+", "+n.streetNumber;t(addCompOriObj,addressStr)})},e});