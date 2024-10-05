const StoreData = require('../models/StoreDataModel');

// Create new store data
exports.createStoreData = async (req, res) => {
  try {
    const storeData = new StoreData(req.body);
    await storeData.save();
    res.status(201).json({ message: "Store data created successfully", storeData });
  } catch (error) {
    res.status(400).json({ message: "Error creating store data", error });
  }
};

// Get all store data
exports.getAllStoreData = async (req, res) => {
  try {
    const storeData = await StoreData.find();
    res.status(200).json(storeData);
  } catch (error) {
    res.status(400).json({ message: "Error fetching store data", error });
  }
};

// Get store data by ID
exports.getStoreDataById = async (req, res) => {
  try {
    const storeData = await StoreData.findById(req.params.id);
    if (!storeData) {
      return res.status(404).json({ message: "Store data not found" });
    }
    res.status(200).json(storeData);
  } catch (error) {
    res.status(400).json({ message: "Error fetching store data", error });
  }
};

// Update store data by ID
exports.updateStoreData = async (req, res) => {
  try {
    const storeData = await StoreData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!storeData) {
      return res.status(404).json({ message: "Store data not found" });
    }
    res.status(200).json({ message: "Store data updated successfully", storeData });
  } catch (error) {
    res.status(400).json({ message: "Error updating store data", error });
  }
};

// Delete store data by ID
exports.deleteStoreData = async (req, res) => {
  try {
    const storeData = await StoreData.findByIdAndDelete(req.params.id);
    if (!storeData) {
      return res.status(404).json({ message: "Store data not found" });
    }
    res.status(200).json({ message: "Store data deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting store data", error });
  }
};
