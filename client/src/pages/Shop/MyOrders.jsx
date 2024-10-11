import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { getUserOrders } from "../../store/orderSlice/orderSlice"; // Path ke checkoutSlice Redux
import moment from "moment";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import formatNumber from "../../components/helpers/formatNumber";

const MyOrders = () => {
  const dispatch = useDispatch();

  // Mengambil state user orders dari redux store
  const {
    userOrders,
    isLoadingOrders,
    errorMessage,
    totalUserOrders,
    totalUserPages,
    currentUserPage,
  } = useSelector((state) => state.order);

  console.log(
    "userOrders",
    userOrders,
    totalUserOrders,
    totalUserPages,
    currentUserPage
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Mengambil token dari cookie
  const token = Cookies.get("token");

  // Mendapatkan data pesanan pengguna saat komponen di-mount
  useEffect(() => {
    if (token) {
      dispatch(getUserOrders({ token, page: currentPage, limit }));
    }
  }, [dispatch, token, currentPage, limit]);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalUserPages) {
      setCurrentPage(newPage);
    }
  };

  // Fungsi untuk mengubah batas per halaman
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setCurrentPage(1); // Reset ke halaman 1 saat limit berubah
  };

  // Render loading spinner saat sedang mengambil data pesanan
  if (isLoadingOrders) {
    return <div>Loading your orders...</div>;
  }

  // Render pesan kesalahan jika ada
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  // Jika tidak ada pesanan
  if (!userOrders || userOrders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div className="w-full p-6 bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-slate-50">
            <tr>
              <th className="py-2 border">No</th>
              <th className="py-2 px-4 border">Products</th>
              <th className="py-2 px-4 border">Address</th>
              <th className="py-2 px-4 border">Total Price</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="py-2 border align-top text-center">
                  {(currentPage - 1) * limit + index + 1}
                </td>
                <td className="py-2 px-4 border align-top">
                  <span className="text-sm border-b">
                    {moment(order.createdAt).format("MMM Do YYYY, h:mm a")}
                  </span>
                  {order.items.map((item) => (
                    <div key={item._id} className="flex flex-col my-1">
                      <div className="flex items-start gap-2">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <p className="font-semibold">{item.product.title}</p>
                          <p className="text-sm text-gray-600">
                            x{item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border align-top">
                <p className="font-semibold">
                    {userOrders[index]?.addressId?.namaPenerima} |{" "}
                    {userOrders[index]?.addressId?.nomorTelepon}
                  </p>
                  <span>{userOrders[index]?.addressId?.jalan}</span>
                  <br />
                  <span>
                    {userOrders[index]?.addressId?.kelurahan}, RT/RW{" "}
                    {userOrders[index]?.addressId?.rtrw}, kec.{" "}
                    {userOrders[index]?.addressId?.kecamatan},
                  </span>
                  <br />
                  <span>
                    {userOrders[index]?.addressId?.kota?.type === "Kabupaten"
                      ? "Kab. "
                      : "Kota "}{" "}
                    {userOrders[index]?.addressId?.kota?.city_name},{" "}
                    {userOrders[index]?.addressId?.provinsi?.province},{" "}
                    {userOrders[index]?.addressId?.kota?.postal_code}
                  </span>
                </td>
                <td className="py-2 px-4 border align-top">
                  <div className="font-semibold mb-1">Rp. {formatNumber(order.totalPrice + order.shippingCost)}</div>
                  <div className="text-sm p-1 border">
                    <div>Price: Rp. {formatNumber(order.totalPrice)}</div>
                    <div>Shipping Cost: Rp. {formatNumber(order.shippingCost)}</div>
                  </div>
                </td>
                <td className="py-2 px-4 border align-top capitalize">
                  <div>{order.paymentStatus} | {order.status}</div>
                  <div className="text-sm text-gray-500">
                    {order.status === "pending" && order.paymentStatus === "paid" &&
                      "Waiting for confrmation . . ."}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.status === "process" && order.paymentStatus === "paid" &&
                      "On process in packaging . . ."}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.status === "ondelivery" &&
                      "Tracking Code: " + order?.trackingCode}
                  </div>
                  {order.paymentStatus === "unpaid" && (
                    <div className="mt-3 flex gap-2">
                      <div
                        className="hover:text-primary-hover underline text-primary cursor-pointer"
                        onClick={() => {
                          // Lakukan aksi yang diinginkan
                        }}
                      >
                        Pay Now
                      </div>
                      <div
                        className="hover:text-red-500 underline text-red-600 cursor-pointer"
                        onClick={() => {
                          // Lakukan aksi yang diinginkan
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                  )}
                  {order.paymentStatus === "paid" &&
                    order.status === "ondelivery" && (
                      <a
                        className="hover:text-primary-hover underline text-primary cursor-pointer"
                        href="https://rajaongkir.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Track Order
                      </a>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center mb-4 gap-2 mt-4">
        {/* Dropdown untuk memilih batas per halaman */}
      <div>
        <select
          id="limit"
          value={limit}
          onChange={handleLimitChange}
          className="border rounded px-1 py-1 focus:outline-none"
        >
          <option value={5}>5 / page</option>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <MdNavigateBefore />
        </button>
        <span>
          {currentPage} / {totalUserPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalUserPages}
        >
          <MdNavigateNext />
        </button>
      </div>
      </div>
    </div>
  );
};

export default MyOrders;
