import "../../../styles/style.css";
import { PiCarProfile } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { SiDatabricks } from "react-icons/si";
import { FaSortUp } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";

const columns = [
  { key: "createdAt", label: "New" },
  { key: "stock", label: "Stock" },
  { key: "sold", label: "Sold" },
  { key: "salePrice", label: "Price" },
];

const ProductTableMobile = ({
  sortedProducts,
  handleDeleteClick,
  formatNumber,
  sortProducts,
  setSortField,
  setSortDirection,
  sortConfig,
}) => {
  return (
    <div className="lg:hidden">
      <div className="w-full bg-white flex">
        {columns.map(({ key, label }) => (
          <div
            key={key}
            className={`border px-1 py-1 cursor-pointer flex-1`}
            onClick={() => {
              if (sortConfig.key === key) {
                // Jika kolom yang diklik sudah dalam keadaan sorting
                const newDirection =
                  sortConfig.direction === "ascending"
                    ? "descending"
                    : "ascending";
                setSortField(key);
                setSortDirection(newDirection === "ascending" ? 1 : -1); // Mengirim 1 untuk ascending, -1 untuk descending
                sortProducts(key); // Mengurutkan berdasarkan kolom
              } else {
                // Jika kolom baru diklik
                setSortField(key);
                setSortDirection(1); // Mulai dari ascending (1)
                sortProducts(key); // Mengurutkan berdasarkan kolom
              }
            }}
          >
            <div className="flex gap-1 items-center justify-center text-sm">
              <div>{label}</div>
              <div className="flex flex-col gap-1">
                <FaSortUp
                  className={`-mb-2 text-slate-400 ${
                    sortConfig.key === key
                      ? sortConfig.direction === "ascending"
                        ? "text-slate-600"
                        : ""
                      : ""
                  }`}
                />
                <FaSortDown
                  className={`-mt-2 text-slate-400 ${
                    sortConfig.key === key
                      ? sortConfig.direction === "descending"
                        ? "text-slate-600"
                        : ""
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-100 p-2">
        {sortedProducts.map((product) => (
          <div key={product._id} className="w-full">
            <div className="max-w-sm border overflow-hidden bg-white min-w-full">
              <div className="flex gap-2 p-4">
                <div className="h-20 w-20 min-w-20 relative bg-white rounded-md border border-gray-300">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-semibold text-clamp leading-tight">
                    {product.title}
                  </div>
                  <span className="text-[12px]">{product.category}</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between px-5 mb-4">
                <div className="flex gap-1 justify-center font-semibold">
                  <span className="text-sm flex items-end">Rp.</span>{" "}
                  <span className="text-2xl">
                    {formatNumber(`${product.salePrice}`)}
                  </span>
                </div>
                <div className="border-t border-gray-300 my-4 w-full"></div>
                <div className="flex items-center justify-around w-full">
                  <p className="text-gray-700">
                    <span className="text-sm flex items-center gap-1">
                      <SiDatabricks className="text-lg" />{" "}
                      {formatNumber(product.stock)}
                    </span>
                  </p>
                  <div className="border-l border-gray-300 h-6 mx-4"></div>
                  <p className="text-gray-700">
                    <span className="text-sm">
                      Sold: {formatNumber(product.sold)}
                    </span>
                  </p>
                  <div className="border-l border-gray-300 h-6 mx-4"></div>
                  <div className="text-gray-700">
                    <span className="text-sm relative">
                      <PiCarProfile className="text-2xl" />
                      <div className="absolute -top-1 -right-3">
                        {product.deliveryAvailable ? (
                          <MdOutlineDone className="text-green-400 text-lg" />
                        ) : (
                          <IoCloseSharp className="text-red-400 text-lg" />
                        )}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-white text-black w-full px-3 py-1 border-[1px] border-primary"
                  onClick={() =>
                    (window.location.href = `http://localhost:5173/admin/edit-product?id=${product._id}`)
                  }
                >
                  <span className="text-primary-dark font-semibold">Edit</span>
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={() => handleDeleteClick(product)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTableMobile;
