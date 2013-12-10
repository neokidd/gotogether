/**
 * Created by yunlong on 13-12-5.
 */
Model.location = function(exports){
    exports.config = {
        fields : [
            { name : 'userid', type : 'string'},
            { name : 'name', type : 'string', defaultValue:''},
            { name : 'groupid', type : 'string'},
            { name:'x',type:'int'},
            { name:'y',type:'int'}
        ]
    }
}