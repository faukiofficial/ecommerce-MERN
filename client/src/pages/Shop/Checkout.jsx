import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../store/productSlice/productSlice";
import { checkout } from "../../store/checkoutSlice/checkoutSlice";
import { AiOutlineLoading } from "react-icons/ai";
import Cookies from "js-cookie";
import { getAllAddress } from "../../store/addressForm-slice/addressFormSlice";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedItems, token } = location.state;
  const { isCheckoutLoading, successMessage } = useSelector(
    (state) => state.checkout
  );
  const { addresses } = useSelector((state) => state.address);
  const { isLoading } = useSelector((state) => state.product);

  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [shippingCost, setShippingCost] = useState(0); // State untuk ongkir
  const [selectedAddress, setSelectedAddress] = useState({}); // State untuk alamat

  console.log("ini alamatnya",selectedAddress);
  

  useEffect(() => {
    document.title = "Checkout | Shopping App";
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    dispatch(getAllAddress(token));
  }, [dispatch]);

  // Ambil detail produk berdasarkan selectedItems
  useEffect(() => {
    const fetchProductDetails = async () => {
      const products = [];
      for (const productId of Object.keys(selectedItems)) {
        const product = await dispatch(getProductById({ productId })).unwrap();
        products.push(product);
      }
      setFetchedProducts(products);
    };

    fetchProductDetails();
  }, [dispatch, selectedItems]);

  const handleConfirmCheckout = () => {
    const productsToCheckout = Object.keys(selectedItems).map((productId) => ({
      productId,
      quantity: selectedItems[productId],
    }));

    dispatch(checkout({ selectedItems: productsToCheckout, token })).then(
      () => {
        if (successMessage) {
          navigate("/order-success");
        }
      }
    );
  };

  const handleSelectAddress = (addressId) => {
    const selected = addresses.find((address) => address._id === addressId);
    setSelectedAddress(selected);
  };

  const totalWithoutShipping = fetchedProducts.reduce(
    (total, item) => total + item.salePrice * selectedItems[item._id],
    0
  );
  const totalWeight = fetchedProducts.reduce(
    (total, item) => total + item.weight * selectedItems[item._id],
    0
  ); // Hitung total berat
  const totalPrice = totalWithoutShipping + shippingCost; // Total termasuk ongkir

  return (
    <div className="w-full p-4 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Checkout Summary</h2>

      <div className="mb-7 border-b pb-3">
        <h3 className="text-xl font-semibold mb-2">Pilih Alamat:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`border rounded-md p-3 shadow-sm cursor-pointer ${
                selectedAddress._id === address._id ? "bg-primary-light" : ""
              }`}
              onClick={() => handleSelectAddress(address._id)}
            >
              <h4 className="font-semibold">
                {address.namaPenerima} | {address.nomorTelepon}
              </h4>
              <p>
                {address.jalan}, {address.rtrw && 'RT/RW'} {address.rtrw}, {address.kelurahan}, Kec. {address.kecamatan}
              </p>
              <p className="mb-2">
                {address.kota.type === "Kabupaten" ? "Kab." : "Kota"}{" "}
                {address.kota.city_name}, {address.provinsi.province},{" "}
                {address.kota.postal_code}
              </p>
            </div>
          ))}
        </div>
      </div>

      {isLoading || fetchedProducts.length === 0 ? (
        <div className="flex justify-center">
          <AiOutlineLoading className="animate-spin text-2xl" />
        </div>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Product Title</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Weight</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {fetchedProducts.map((item) => {
              const totalPrice = item.salePrice * selectedItems[item._id];
              return (
                <tr key={item._id}>
                  <td className="border px-4 py-2">{item.title}</td>
                  <td className="border px-4 py-2">
                    Rp {item.salePrice.toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {selectedItems[item._id]}
                  </td>
                  <td className="border px-4 py-2">@{item.weight} gr</td>
                  <td className="border px-4 py-2">
                    Rp {totalPrice.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-right font-bold">
                Total:
              </td>
              <td className="border px-4 py-2 font-bold">
                Rp {totalWithoutShipping.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="text-right font-bold">
                Total Weight:
              </td>
              <td className="border px-4 py-2 font-bold">
                {totalWeight.toLocaleString()} gr
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="text-right font-bold">
                Ongkir:
              </td>
              <td className="border px-4 py-2 font-bold">
                Rp {shippingCost.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="text-right font-bold">
                Total + Ongkir:
              </td>
              <td className="border px-4 py-2 font-bold">
                Rp {totalPrice.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleConfirmCheckout}
          className={`px-4 py-2 text-white ${
            isCheckoutLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark"
          }`}
          disabled={isCheckoutLoading}
        >
          {isCheckoutLoading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            "Confirm Checkout"
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
