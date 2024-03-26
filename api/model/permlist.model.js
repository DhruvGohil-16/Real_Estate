import mongoose from "mongoose";

const userlisting = new mongoose.Schema({
    propertyName: { 
        type: String,
        required: true
    },
     user:{
        type: String,
        required: true
    },
    propertyType: {
        type: String, 
        required: true
    },
    description: { 
        type: String, 
        required: true 
    },
    saleType: {
        type:String,
        enum: ['rent','sell'],
        required:true
    },
    price: { 
        type: Number, 
        required: true 
    },
    discountPrice:{
        type: Number, 
        required: true 
    },
    offer: {
        type:Boolean,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    bedrooms: { 
        type: Number, 
        required: true 
    },
    bathrooms: { 
        type: Number, 
        required: true 
    },
    sqarea: { 
        type: Number, 
        required: true 
    },
    images: {
        type:Array,
        required:true
    },
    parking: {
        type: Boolean,
    },
    noOfVehicle: {
        type: Number,
        required: function() {
          return this.parking !== undefined; // Set as required only when parking is available
        }
    },
    amenities: {
        type: Array,
        default: 'no'
    },
    furnished: {
        type: Boolean,
    },
    listedDate: {
        type: Date,
        default: Date.now
    },
    builtDate: {
        type: Date,
        required: true
    },
  }, { timestamps: true });

const permlist = mongoose.model('userlist',userlisting);

export default permlist;