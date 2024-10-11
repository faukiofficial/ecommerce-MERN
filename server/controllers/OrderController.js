const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const Address = require("../models/AddressModel"); // Pastikan model Address diimpor

// Create an Order (Checkout)
exports.createOrder = async (req, res) => {
  const userId = req.user._id;
  const {
    items,
    quantities,
    shippingCost,
    addressId,
    totalPrice,
    shippingOption,
    selectedShippingCode,
  } = req.body;

  // Validasi input
  if (!items || !Array.isArray(items) || items.length === 0) {
    console.log("Items are required and should be a non-empty array.");

    return res
      .status(400)
      .json({ message: "Items are required and should be a non-empty array." });
  }

  if (
    !quantities ||
    typeof quantities !== "object" ||
    Object.keys(quantities).length === 0
  ) {
    console.log("Quantities are required and should be an object.");
    return res
      .status(400)
      .json({ message: "Quantities are required and should be an object." });
  }

  if (!addressId) {
    console.log("Address ID is required.");
    return res.status(400).json({ message: "Address ID is required." });
  }

  if (totalPrice === undefined || typeof totalPrice !== "number") {
    console.log("Total price is required and should be a number.");
    return res
      .status(400)
      .json({ message: "Total price is required and should be a number." });
  }

  // Validasi shippingOption
  if (
    !shippingOption ||
    !shippingOption.service ||
    !shippingOption.description ||
    !shippingOption.cost
  ) {
    console.log("Shipping option is required.");
    return res.status(400).json({ message: "Shipping option is required." });
  }

  try {
    // Validasi bahwa alamat ada dan milik pengguna
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      console.log("Invalid address ID.");
      return res.status(400).json({ message: "Invalid address ID." });
    }

    // Extract productIds dari items
    const productIds = items.map((item) => item._id);

    // Fetch produk dari database untuk memastikan keberadaan
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      console.log("Some products not found.");
      return res.status(400).json({ message: "Some products not found." });
    }

    // Buat mapping productId ke produk
    const productMap = {};
    products.forEach((product) => {
      productMap[product._id.toString()] = product;
    });

    // Menyusun orderItems
    const orderItems = [];

    for (const item of items) {
      const productId = item._id.toString();

      if (!quantities[productId]) {
        console.log(`Quantity for product ID ${productId} is missing.`);
        return res.status(400).json({
          message: `Quantity for product ID ${productId} is missing.`,
        });
      }

      const quantity = quantities[productId];

      if (typeof quantity !== "number" || quantity <= 0) {
        console.log(`Invalid quantity for product ID ${productId}.`);
        return res
          .status(400)
          .json({ message: `Invalid quantity for product ID ${productId}.` });
      }

      // Opsional: Cek ketersediaan stok
      if (productMap[productId].stock < quantity) {
        console.log(`Insufficient stock for product ID ${productId}.`);
        return res
          .status(400)
          .json({ message: `Insufficient stock for product ID ${productId}.` });
      }

      orderItems.push({
        product: productMap[productId]._id,
        quantity: quantity,
      });
    }

    const newOrder = new Order({
      userId,
      addressId,
      items: orderItems,
      totalPrice,
      shippingCost: shippingCost || 0,
      shippingOption: {
        // Menyimpan informasi pengiriman
        service: shippingOption.service,
        description: shippingOption.description,
        cost: shippingOption.cost,
      },
      selectedShippingCode,
    });

    await newOrder.save();

    console.log("Order created successfully:", newOrder);

    res
      .status(201)
      .json({ success: true, message: "Order created successfully", newOrder });
  } catch (error) {
    console.error("Error in createOrder controller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Hitung jumlah total pesanan
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find()
      .populate("items.product")
      .populate("addressId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found." });
    }

    res
      .status(200)
      .json({
        success: true,
        orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
      });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders by userId
exports.getUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    // Hitung jumlah total pesanan untuk user ini
    const totalUserOrders = await Order.countDocuments({ userId });

    const userOrders = await Order.find({ userId })
      .populate("items.product")
      .populate("addressId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    console.log(`Fetched orders for user ID ${userId}:`, userOrders);

    if (!userOrders || userOrders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user." });
    }

    res.status(200).json({ success: true,
      userOrders,
      totalUserOrders,
      totalPages: Math.ceil(totalUserOrders / limit),
      currentPage: page, });
  } catch (error) {
    console.error("Error in getUserOrders controller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
