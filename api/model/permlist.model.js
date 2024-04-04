import mongoose from "mongoose";

const userlisting = new mongoose.Schema({
    propertyName: { 
        type: String,
        required: true
    },
    owner:{
        type: String,
        required: true
    },
    agentName:{
        type: String,
        required:true
    },
    propertyId:{
        type: String,
        required: true,
        unique: true
    },
    user:{
        type: String,
        required: true
    },
    userProfile:{
        type: String,
        required: true
    },
    agent:{
        type:String,
        required:true
    },
    agentProfile:{
        type: String,
        required: true
    },
    agentEmail:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    propertyType: {
        type: String, 
        required: true
    },
    description: { 
        type: String, 
        required: true 
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
    noOfVehicle: {
        type: Number,
        required: true
    },
    amenities: {
        type: Array,
        default: 'no'
    },
    furnished: {
        type: Boolean,
    },
    sold: {
        type: Boolean,
        default:false
    },
    listedDate: {
        type: Date,
        default: Date.now
    },
    builtDate: {
        type: String,
        required: true
    },
    parking : {
        type: Boolean,
        default:false
    },
    swimmingPool : {
        type: Boolean,
        default:false
    },
    garden : {
        type: Boolean,
        default:false
    },
    elevator : {
        type: Boolean,
        default:false
    }
  }, { timestamps: true });

const permlist = mongoose.model('permlist',userlisting);

export default permlist;