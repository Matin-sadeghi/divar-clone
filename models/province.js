const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const {provinceSchemaValidation} = require('./validation/provinceValidation');

const Schema = mongoose.Schema;
const provinceSchema = Schema({
    name:{type:String,trim:true,required:true},
    slug:{type:String,trim:true,required:true,unique:true},
    
},{timestamps:true,toJSON:{virtuals:true}});


provinceSchema.plugin(mongoosePaginate);

provinceSchema.statics.provinceValidation = function(body){
   return provinceSchemaValidation.validate(body,{abortEarly:false})
}

provinceSchema.methods.information = function(){
    const provinc = this;
    let unseen = 0, seen = 0, accept = 0, rejection = 0;
    provinc.posts.forEach(post => {
        
        switch (post.status) {
            case "unseen":
                unseen++
                break;
                case "seen":
                seen++
                break;

            case "accept":
                accept++
                break;

                case "rejection":
                    rejection++
                break;

            default:
                break;
        }


    });
    let info = {unseen,seen,accept,rejection}
    return info
}

provinceSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'province',
  });

module.exports = mongoose.model("Province",provinceSchema)
