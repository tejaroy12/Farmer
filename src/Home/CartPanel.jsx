import { useState } from "react";
import "./CartPanel.css";

const CartPanel = ({ cart, handleRemove, handleTotalBuy, onClose, handleQuantityChange }) => {
  const [deliveryType, setDeliveryType] = useState("visit");

  const baseTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const extraCharge =
    deliveryType === "auto" ? 20 * itemCount :
    deliveryType === "bike" ? 50 : 0;
  const finalTotal = baseTotal + extraCharge;

  const handleCheckout = () => {
    handleTotalBuy(deliveryType);
  };

  return (
    <div className="cart-panel shadow">
      <div className="cart-header">
        <h3>Your Cart 🛒</h3>
        <button className="close-cart-btn" style={{color:"red"}} onClick={onClose}>X</button>
      </div>
      <hr />

      {cart.length === 0 ? (
        <p className="empty-cart">🧺 Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <div className="item-info">
                <span className="item-name">{item.name_te}</span>
                <span className="item-price">₹{item.price}</span>
                {item.stock <= 5 && (
                  <p className="warning-text" style={{ color: "red", fontWeight: "bold" }}>
                    ⚠️ Only {item.stock} left in stock!
                  </p>
                )}
              </div>
              <div className="quantity-controls clean">
                <button onClick={() => handleQuantityChange(index, item.quantity - 1)} disabled={item.quantity <= 1} style={{backgroundColor:"red" ,color:"white",border:"none"}}>−</button>
                <span className="quantity"> {item.quantity} </span>
                <button onClick={() => handleQuantityChange(index, item.quantity + 1)} style={{backgroundColor:"green",color:"white",border:"none"}}>＋</button>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(index)}>X</button>
            </li>
          ))}
        </ul>
      )}

      <div className="delivery-options">
        <h4>Choose Delivery Option:</h4>
        <label>
          <input
            type="radio"
            name="delivery"
            value="auto"
            checked={deliveryType === "auto"}
            onChange={() => setDeliveryType("auto")}
          />
          🚗 Auto (₹20 per item)
        </label><br/>
        <label>
          <input
            type="radio"
            name="delivery"
            value="bike"
            checked={deliveryType === "bike"}
            onChange={() => setDeliveryType("bike")}
          />
          🛵 Bike (₹50 flat)
        </label><br/>
        <label>
          <input
            type="radio"
            name="delivery"
            value="visit"
            checked={deliveryType === "visit"}
            onChange={() => setDeliveryType("visit")}
          />
          🏪 Visit Store (Free)
        </label>
      </div>

      <div className="cart-footer">
        <p>Total Items: {itemCount}</p>
        {deliveryType === "auto" && <p>Delivery Charge: ₹{extraCharge}</p>}
        <p className="cart-total">Total: ₹{finalTotal}</p>
        <button className="checkout-button" onClick={handleCheckout}>
          ✅ Confirm & Send via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CartPanel;
