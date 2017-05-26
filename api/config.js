var config = {
    secret: 'Pif et paf et pouf',
    port : 1234,
    socket_port : 1234,
    db : {url:'mongodb://pifpafpouf:pifpafpouf974@localhost:27017/pifpafpouf', port:27017, name:'pifpafpouf'}, //163.5.84.197
    model:{
        user:{
            login: {type: String, required: true},
            password: {type: String, required: true}
        }
    },
    mask : function (obj, tab) {
        var res = {};
        for (var key in tab)
            if(obj[key])
                res[key] = obj[key];
        return res;
    }
};

module.exports = config;