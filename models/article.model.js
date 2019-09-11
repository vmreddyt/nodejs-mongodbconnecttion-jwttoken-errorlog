module.exports = function(mongoose){
    return [{
        name: {type: String, required: true},
        description: {type: String},
                author: {
                    name: {type: String},
                    website: {type: String}
                }
    }, {
        timestamps: true
    }]
};