const mongoose=require('mongoose');

var imgschema=new mongoose.Schema({
    history_id: {type: String, required: true},
    input_img_path: String,
    output_img_path: String,
    updated_date: { type: Date, default: Date.now() },

});

var resultdb=mongoose.model("resultdb",imgschema);
module.exports=resultdb;