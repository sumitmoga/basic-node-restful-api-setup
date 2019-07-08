const mongoose=require('mongoose');

const orderSchema= mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"Product"},
    quantity:{type:Number, default:1}
});

module.exports= mongoose.model('Order', orderSchema);