/**
 * Created by yunlong on 13-12-17.
 */
sumeru.router.add(
    {
        pattern: '/target',
        action: 'App.target'
    }
);

App.target = sumeru.controller.create(function(env, session){

    var map;

    env.onrender = function(doRender){
        doRender("target", ['push','left']);
    };

    env.onready = function(viewRoot){
//        Library.bMapUtil.initMap(map,viewRoot.querySelector('#map'));

        Library.touch.on('#goHome','touchend',function(){
            env.redirect("/home");
        });

    }

});