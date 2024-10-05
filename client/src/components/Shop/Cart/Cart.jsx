import { AiOutlineLoading } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImFileEmpty } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { checkout } from "../../../store/checkoutSlice/checkoutSlice";
import { useNavigate } from "react-router-dom";

const Cart = ({
  isCartOpen,
  setIsCartOpen,
  cartRef,
  cart,
  selectedItemsFK,
  handleSelectItem,
  handleRemoveFromCart,
  handleUpdateQuantity,
  isQuantityUpdateting,
  updatingItemId,
  inputValues,
  setInputValues,
  handleKeyDown,
  isRemoving,
  removingItemId,
  selectedTotal,
  token,
}) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/shop/checkout", {
      state: {
        selectedItems: selectedItemsFK,
        total: selectedTotal,
        token,
      },
    })
    setIsCartOpen(false)
  };

  console.log('selected',selectedItemsFK)
  return (
    <div>
      {isCartOpen && (
        <div
          ref={cartRef}
          className="bg-white border border-primary-light p-4 shadow-lg w-full md:w-1/2 xl:w-1/3 fixed top-[65px] md:right-4 z-10"
        >
          <h2 className="text-xl font-semibold mb-4 border-b pb-3">
            Your Cart
          </h2>
          <div className="cart-items-container flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {cart?.items.length > 0 ? (
              cart?.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    {/* Checkbox for selecting item */}
                    <input
                      type="checkbox"
                      checked={selectedItemsFK[item.product._id] || false}
                      onChange={() => handleSelectItem(item.product._id, item.quantity)}
                      className="mr-2"
                    />
                    {/* Display product image */}
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.images[0]} // Ambil gambar pertama dari array images
                        alt={item.product.title}
                        className="w-16 h-16 object-contain border"
                      />
                      <div className="flex flex-col">
                        {/* Product title */}
                        <h4 className="font-semibold">{item.product.title}</h4>
                        {/* Display product price formatted as currency */}
                        <span>
                          Rp. {item.product.salePrice.toLocaleString()}
                        </span>
                        <span className="text-sm">
                          Stock: {item.product.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            handleRemoveFromCart(item.product._id);
                          } else {
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity - 1
                            );
                          }
                        }}
                        className="px-2 py-1 bg-gray-200"
                        disabled={isQuantityUpdateting}
                      >
                        -
                      </button>
                      {isQuantityUpdateting &&
                      updatingItemId === item?.product._id ? (
                        <span className="animate-spin text-xl mx-5">
                          <AiOutlineLoading />
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={inputValues[item.product._id] || item.quantity}
                          className="w-[60px] py-1 text-center border rounded focus:outline-none"
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (/^\d*$/.test(newValue)) {
                              setInputValues((prev) => ({
                                ...prev,
                                [item.product._id]: newValue,
                              }));
                            }
                          }}
                          onKeyDown={(e) => handleKeyDown(e, item.product._id)}
                        />
                      )}
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 bg-gray-200"
                        disabled={isQuantityUpdateting}
                      >
                        +
                      </button>
                    </div>

                    {/* Remove item button */}
                    {isRemoving && removingItemId === item?.product._id ? (
                      <span className="animate-spin text-xl ml-1">
                        <AiOutlineLoading className="text-red-500" />
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRemoveFromCart(item?.product._id)}
                        className="text-red-500 hover:text-red-600 text-2xl"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-2">
                <ImFileEmpty className="text-2xl" />
                <span>You have no data in your cart</span>
              </div>
            )}
          </div>
          {/* Total and Checkout button */}
          <div className="flex justify-between items-center mt-4 border-t pt-3">
            <div className="font-bold">
              Total: Rp. {selectedTotal.toLocaleString()}
            </div>
            <button
              onClick={handleCheckout}
              className={`px-4 py-2 text-white ${
                selectedTotal > 0
                  ? "bg-primary hover:bg-primary-dark"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={selectedTotal === 0}
            >
                <span>Checkout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
