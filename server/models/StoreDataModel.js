const mongoose = require('mongoose');

// Define schema for StoreData
const storeDataSchema = new mongoose.Schema({
  namaToko: {
    type: String,
    required: true,
    trim: true
  },
  nomorHp: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  alamat: {
    negara: { 
      type: String, 
      required: true, 
      trim: true 
    },
    provinsi: { 
      type: String, 
      required: true, 
      trim: true 
    },
    kota: { 
      type: String, 
      required: true, 
      trim: true 
    },
    kecamatan: { 
      type: String, 
      required: true, 
      trim: true 
    },
    desa: { 
      type: String, 
      required: true, 
      trim: true 
    },
    jalan: { 
      type: String, 
      required: true, 
      trim: true 
    },
    kodePos: { 
      type: String, 
      required: true, 
      trim: true 
    }
  },
  mediaSosial: {
    instagram: {
      type: String,
      trim: true,
      default: ''
    },
    facebook: {
      type: String,
      trim: true,
      default: ''
    },
    whatsapp: {
      type: String,
      trim: true,
      default: ''
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    tiktok: {
      type: String,
      trim: true,
      default: ''
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const StoreData = mongoose.model('StoreData', storeDataSchema);

module.exports = StoreData;
