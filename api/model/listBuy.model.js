import mongoose from "mongoose";

const listBuySchema = new mongoose.Schema({

    listId : {
        type : String,
        required:true,
    },

    userId : {
        type : String,
        required : true,
    },

    buyerName : {
        type: String,
        required: true
    },

    agentId : {
        type : String,
        required : true,
    },

    offer : {
        type : Number,
        required : true,
    },
    viewed : {
        type:Boolean,
        default : false
    },
    date : {
        type: Date,
        default:Date.now
    },
    accepted : {
        type: Number,
        default: 0
    }

  }, { timestamps: true });

const listBuyMap = mongoose.model('listBuy',listBuySchema);

export default listBuyMap;