import { useCart } from "../context/useCart";
import { useNavigate } from "react-router-dom";
import { useCartUI } from "../context/useCartUI";

export default function CartDrawer() {
  const { cart, subtotal, updateQuantity } = useCart();
  const { isOpen, closeCart } = useCartUI();
  const navigate = useNavigate();

  // Helper to format color for display
  const formatColor = (color) => {
    if (!color) return "";
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div onClick={closeCart} className="fixed inset-0 bg-black/40 z-60" />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[85%] md:w-[60%] lg:w-[45%] xl:w-[35%] 2xl:w-[27%] bg-white z-60 rounded-l-xl
        shadow-2xl transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button onClick={closeCart} className="text-xl p-1">
            ✕
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto h-[calc(100vh-180px)]">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center items-center justify-center mt-12">
              Your cart is empty
            </p>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product._id}-${item.size}-${item.color}`}
                className={`flex gap-3 sm:gap-4 items-center py-3 sm:py-4 ${index !== cart.length - 1 ? "border-b" : ""}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-20 sm:w-20 sm:h-28 object-cover rounded"
                />
                <div className="flex-1 min-w-0 text-sm sm:text-base">
                  <p className="font-medium text-sm sm:text-base tracking-tight break-words">
                    {item.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatColor(item.color)} / {item.size}
                  </p>
                  <div className="flex items-center justify-start gap-2 sm:gap-3 mt-1 sm:mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.size,
                          item.color,
                          item.quantity - 1,
                        )
                      }
                      className="w-6 h-6 sm:w-7 sm:h-7 border rounded flex items-center justify-center hover:bg-gray-100 text-sm"
                    >
                      −
                    </button>

                    <span className="text-sm font-medium">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.size,
                          item.color,
                          item.quantity + 1,
                        )
                      }
                      className="w-6 h-6 sm:w-7 sm:h-7 border rounded flex items-center justify-center hover:bg-gray-100 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => {
              closeCart();
              navigate("/cart");
            }}
            className="w-full border py-2.5 sm:py-3 rounded text-sm sm:text-base"
          >
            View cart
          </button>

          <button
            onClick={() => {
              closeCart();
              navigate("/checkout");
            }}
            className="w-full bg-black text-white py-2.5 sm:py-3 rounded text-sm sm:text-base"
          >
            Proceed to checkout
          </button>
        </div>
      </aside>
    </>
  );
}
