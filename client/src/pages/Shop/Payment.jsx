import React from "react";
import { useLocation } from "react-router-dom";
import formatNumber from "../../components/helpers/formatNumber";

const PaymentPage = () => {
  const location = useLocation();
  const {
    items,
    quantities,
    addressId,
    shippingCost,
    selectedShippingCode,
    totalWithoutShipping,
    selectedShippingOption,
    orderId,
  } = location.state;

  console.log(location.state);

  // Hitung total harga yang harus dibayar
  const totalToPay = totalWithoutShipping + shippingCost;

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Payment Summary</h1>

      <div className="my-4">
        <ul className="border">
          {items.map((item, index) => (
            <li
              key={item._id}
              className={`flex items-center justify-between p-2 hover:bg-slate-200 ${
                index % 2 === 1 ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                  <img src={item.images[0]} alt={item.title} className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <span className="text-sm">
                    Rp. {formatNumber(item.salePrice)} x {quantities[item._id]}
                  </span>
                </div>
              </div>
              <span>
                Rp. {formatNumber(item.salePrice * quantities[item._id])}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Shipping Information:</h2>
        <p>
          {selectedShippingCode.toUpperCase()} -{" "}
          {selectedShippingOption.description} ({selectedShippingOption.service}{" "}
          : {selectedShippingOption.cost[0].etd}{" "}
          {selectedShippingOption.cost[0].etd.includes("HARI") ? "" : "HARI"})
        </p>
        <p>Shipping Cost: Rp. {formatNumber(shippingCost)}</p>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold">
          Total: Rp. {formatNumber(totalToPay)}
        </p>
      </div>

      <button className="mt-4 bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded">
        Confirm Payment
      </button>
    </div>
  );
};

export default PaymentPage;
