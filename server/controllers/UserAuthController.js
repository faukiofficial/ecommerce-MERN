const bcrypts = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const { imageUploadUtil, deleteImageUtil } = require("../config/cloudinary");

// Registrasi User
exports.register = async (req, res) => {
  try {
    const { fullName, userName, email, phoneNumber, password } = req.body;

    // Cek jika email atau userName sudah terdaftar
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ success: false, message: "Email already used." });
      } else if (existingUser.userName === userName) {
        return res
          .status(400)
          .json({ success: false, message: "Username already used." });
      }
    }

    // Hash password
    const hashedPassword = await bcrypts.hash(password, 12);

    // Buat user baru
    const newUser = new User({
      fullName,
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registrasr Successfully.",
      fullName,
      userName,
      email,
      phoneNumber,
      password,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Register Failed",
    });
    console.log("Error in registerUser controller", error);
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Tentukan jenis identifier (email atau userName)
    const query = identifier.includes("@")
      ? { email: identifier }
      : { userName: identifier };

    // Cari user berdasarkan identifier
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "Invalid user or password" });
    }

    // Cek password
    const isMatch = await bcrypts.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid user or password" });
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        id: user.id,
        fullName: user.fullName,
        userId: user._id,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePicture: user.profilePicture,
        role: user.role,
        addresses: user.addresses,
        orders: user.orders,
        userCartItems: user.userCartItems,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Simpan token di HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 hari
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        fullName: user.fullName,
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber, // Tambahkan data yang diinginkan
        profilePicture: user.profilePicture, // Jika ada
        role: user.role,
        addresses: user.addresses, // Jika ingin mengirimkan data alamat
        orders: user.orders, // Jika ingin mengirimkan data pesanan
        userCartItems: user.userCartItems, // Jika ingin mengirimkan data keranjang
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login Failed" });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token").json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log("Error in logoutUser controller", error);
    res.status(500).json({
      success: false,
      message: "Logout Failed",
    });
  }
};

// Edit Profil User
exports.editProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, phoneNumber, email, userName } = req.body;

    console.log("Received data:", req.body);

    // Cari user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }


    // Jika ada gambar baru, upload gambar ke Cloudinary dan hapus gambar lama
    if (req.file) {
      if (user.profilePicture && user.profilePicture.publicId) {
        console.log(
          "Deleting old image with publicId:",
          user.profilePicture.publicId
        );
        await deleteImageUtil(user.profilePicture.publicId); // Hapus gambar lama dari Cloudinary
      } else {
        console.log("No previous profile picture to delete.");
      }
      const uploadResult = await imageUploadUtil(req.file.buffer); // Upload gambar baru
      user.profilePicture = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };
    }

    // Update profil user
    user.fullName = fullName || user.fullName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.email = email || user.email;
    user.userName = userName || user.userName;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Profil berhasil diperbarui.", user });
  } catch (error) {
    console.log("Error di edit profile controller:", error);

    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat memperbarui profil.", error });
  }
};

// Hapus Akun User
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log('user id delete', userId);
    

    // Cari user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    // Hapus foto profil dari Cloudinary jika ada
    if (user.profilePicture && user.profilePicture.publicId) {
      const deleteResult = await deleteImageUtil(user.profilePicture.publicId);
      console.log("Delete Result:", deleteResult); // Log hasil penghapusan
    } else {
      console.log("No profile picture to delete.");
    }

    // Hapus user dari database
    await User.findByIdAndDelete(userId);

    res.clearCookie("token"); // Hapus cookie token

    req.user = null;

    res.status(200).json({ message: "Akun berhasil dihapus." });
  } catch (error) {
    console.log('Error di deletePofile controller', error.message);
    
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghapus akun.", error });
  }
};