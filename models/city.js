const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const {citySchemaValidation} = require('./validation/cityValidation');

const Schema = mongoose.Schema;
const citySchema = Schema({
    name:{type:String,trim:true,required:true},
    slug:{type:String,trim:true,required:true,unique:true},
    province:{type:Schema.Types.ObjectId,ref:"Province",default:null}
},{timestamps:true});


citySchema.plugin(mongoosePaginate);

citySchema.statics.cityValidation = function(body){
   return citySchemaValidation.validate(body,{abortEarly:false})
}

module.exports = mongoose.model("City",citySchema)
