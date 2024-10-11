import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  fetchProvinces,
  fetchCities,
} from "../../store/locationSlice/locationSlice";
import {
  createStoreProfile,
  updateStoreProfile,
  getStoreProfile,
  clearStoreProfile,
} from "../../store/storeProfileSlice/storeProfileSlice";

const StoreProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Mengambil state dari Redux store
  const {
    provinces,
    cities,
    error: locationError,
  } = useSelector((state) => state.location);
  const {
    storeProfile,
    loading : submitLoading,
    error,
  } = useSelector((state) => state.storeProfile);

  const token = Cookies.get("token");

  useEffect(() => {
    dispatch(getStoreProfile());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    namaToko: "",
    nomorTelepon: "",
    email: "",
    jalan: "",
    rtrw: "",
    kelurahan: "",
    kecamatan: "",
    province: "",
    city: "",
    type: "",
    postal_code: "",
    mediaSosial: {
      instagram: "",
      facebook: "",
      whatsapp: "",
      twitter: "",
      tiktok: "",
    },
  });

  console.log("Store profile", storeProfile);
  console.log("SKotaaaa", cities);

  // Fetch provinces
  useEffect(() => {
    dispatch(fetchProvinces())
      .unwrap()
      .catch((err) => {
        console.log(err.message || "Gagal mengambil provinsi");
      });

    // Cleanup saat komponen unmount
    return () => {
      dispatch(clearStoreProfile());
    };
  }, [dispatch]);

  // Initialize form data if in edit mode
  useEffect(() => {
    if (storeProfile) {
      // If storeProfile is fetched, update formData
      setFormData({
        namaToko: storeProfile.namaToko || "",
        nomorTelepon: storeProfile.nomorTelepon || "",
        email: storeProfile.email || "",
        jalan: storeProfile.alamat.jalan || "",
        rtrw: storeProfile.alamat.rtrw || "",
        kelurahan: storeProfile.alamat.kelurahan || "",
        kecamatan: storeProfile.alamat.kecamatan || "",
        province: storeProfile.alamat.kota
          ? storeProfile.alamat.kota.province_id
          : "",
        city: storeProfile.alamat.kota ? storeProfile.alamat.kota.city_id : "",
        type: storeProfile.alamat.kota ? storeProfile.alamat.kota.type : "",
        postal_code: storeProfile.alamat.kota
          ? storeProfile.alamat.kota.postal_code
          : "",
        mediaSosial: storeProfile.mediaSosial || {
          instagram: "",
          facebook: "",
          whatsapp: "",
          twitter: "",
          tiktok: "",
        },
      });

      // Setelah mengatur province, fetch cities untuk province tersebut
      if (storeProfile.alamat.kota && storeProfile.alamat.kota.province_id) {
        dispatch(fetchCities(storeProfile.alamat.kota.province_id))
          .unwrap()
          .catch((err) => {
            console.log(err.message || "Gagal mengambil kota");
          });
      }
    }
  }, [storeProfile, dispatch]);

  const mediaSosialFields = ["instagram", "facebook", "whatsapp", "twitter", "tiktok"];

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (mediaSosialFields.includes(name)) {
      // Update nested mediaSosial object
      setFormData((prev) => ({
        ...prev,
        mediaSosial: {
          ...prev.mediaSosial,
          [name]: value,
        },
      }));
    } else if (name === "province") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        city: "",
        postal_code: "",
        type: "",
      }));
      if (value) {
        dispatch(fetchCities(value))
          .unwrap()
          .catch((err) => {
            console.log(err.message || "Gagal mengambil city");
          });
      }
    } else if (name === "city") {
      // Set postal code based on selected city
      const selectedCity = cities.find((city) => city.city_id === value);
      console.log("Selected City:", selectedCity);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        postal_code: selectedCity ? selectedCity.postal_code : "",
        type: selectedCity ? selectedCity.type : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "namaToko",
      "nomorTelepon",
      "email",
      "jalan",
      "province",
      "city",
      "postal_code",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        console.log(`Field ${field} harus diisi`);
        return;
      }
    }

    console.log("jalanin ini deh", formData);

    const payload = {
      namaToko: formData.namaToko,
      nomorTelepon: formData.nomorTelepon,
      email: formData.email,
      alamat: {
        jalan: formData.jalan,
        rtrw: formData.rtrw,
        kelurahan: formData.kelurahan,
        kecamatan: formData.kecamatan,
        kota: {
          city_id: formData.city,
          type: formData.type,
          province: formData.province,
          city_name:
            cities.find((city) => city.city_id === formData.city)?.city_name ||
            "",
          postal_code: formData.postal_code,
          province_id: formData.province,
        },
        provinsi: {
          province_id: formData.province,
          province:
            provinces.find((prov) => prov.province_id === formData.province)
              ?.province || "",
        },
      },
      mediaSosial: formData.mediaSosial,
    };

    console.log("ini payloaddddnyaaaa", payload);

    if (!token) {
      console.log("Token tidak ditemukan. Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    try {
      // Jika Anda dalam mode edit
      if (storeProfile) {
        console.log("di sini yang jalaaaan kaaan", payload);
        await dispatch(
          updateStoreProfile({
            storeProfileData: payload,
            token,
          })
        ).unwrap();
        console.log("Profil toko berhasil diupdate");
      } else {
        console.log("di sini yang jalaaaan");

        await dispatch(
          createStoreProfile({ storeProfileData: payload, token })
        ).unwrap();
        console.log("Profil toko berhasil ditambahkan");
      }
    } catch (err) {
      console.log("ini errrorrrr", err);

      console.log(err.message || "Terjadi kesalahan pada saat submit");
    }
  };

  return (
    <div className="w-full p-6 bg-white shadow-md">
      <h2 className="text-2xl font-semibold my-4">Profil Toko</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Nama Toko */}
          <div className="mb-4">
            <label className="block text-gray-700">Nama Toko</label>
            <input
              type="text"
              name="namaToko"
              value={formData.namaToko}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Nomor HP */}
          <div className="mb-4">
            <label className="block text-gray-700">Nomor Telepon</label>
            <input
              type="text"
              name="nomorTelepon"
              value={formData.nomorTelepon}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Alamat */}
          <div className="mb-4">
            <label className="block text-gray-700">Jalan</label>
            <input
              type="text"
              name="jalan"
              value={formData.jalan}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* RT/RW */}
          <div className="mb-4">
            <label className="block text-gray-700">RT/RW</label>
            <input
              type="text"
              name="rtrw"
              value={formData.rtrw}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Kelurahan */}
          <div className="mb-4">
            <label className="block text-gray-700">Kelurahan</label>
            <input
              type="text"
              name="kelurahan"
              value={formData.kelurahan}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Kecamatan */}
          <div className="mb-4">
            <label className="block text-gray-700">Kecamatan</label>
            <input
              type="text"
              name="kecamatan"
              value={formData.kecamatan}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Provinsi */}
          <div className="mb-4">
            <label className="block text-gray-700">Provinsi</label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((prov) => (
                <option key={prov.province_id} value={prov.province_id}>
                  {prov.province}
                </option>
              ))}
            </select>
          </div>

          {/* city */}
          <div className="mb-4">
            <label className="block text-gray-700">Kota</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!formData.province}
              required
            >
              <option value="">Pilih Kota</option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.type === "Kabupaten" ? "Kab." : "Kota"} {city.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* Kode Pos */}
          <div className="mb-4">
            <label className="block text-gray-700">Kode Pos</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold w-full border-t pt-4 pb-2">
          Media Sosial
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Instagram */}
          <div className="mb-4">
            <label className="block text-gray-700">Istagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.mediaSosial.instagram}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan link"
            />
          </div>

          {/* Facebook */}
          <div className="mb-4">
            <label className="block text-gray-700">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={formData.mediaSosial.facebook}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan link"
            />
          </div>

          {/* whatsapp */}
          <div className="mb-4">
            <label className="block text-gray-700">Whatsapp</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.mediaSosial.whatsapp}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan link"
            />
          </div>

          {/* twitter */}
          <div className="mb-4">
            <label className="block text-gray-700">Twitter</label>
            <input
              type="text"
              name="twitter"
              value={formData.mediaSosial.twitter}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan link"
            />
          </div>

          {/* tiktok */}
          <div className="mb-4">
            <label className="block text-gray-700">Tiktok</label>
            <input
              type="text"
              name="tiktok"
              value={formData.mediaSosial.tiktok}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan link"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="my-4">
          <button
            type="submit"
            className="p-2 bg-primary text-white rounded-md hover:bg-primary-hover"
          >
            {submitLoading ? "Loading..." : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreProfile;
