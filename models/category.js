const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const {categorySchemaValidation} = require('./validation/categoryValidation');

const Schema = mongoose.Schema;
const categorySchema = Schema({
    title:{type:String,trim:true,required:true},
    slug:{type:String,trim:true,required:true,unique:true},
    parent:{type:Schema.Types.ObjectId,ref:"Category",default:null}
},{timestamps:true});


categorySchema.plugin(mongoosePaginate);

categorySchema.statics.categoryValidation = function(body){
   return categorySchemaValidation.validate(body,{abortEarly:false})
}

module.exports = mongoose.model("Category",categorySchema)
