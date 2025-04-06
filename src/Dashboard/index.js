import { useEffect, useState } from "react";
import "./index.css";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(history);
  }, []);

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = orders.reduce((count, order) => count + order.items.length, 0);
  const firstOrderDate = orders.length ? new Date(orders[0].date).toLocaleDateString() : "N/A";

  return (
    <div className="dashboard-container">
      <h2>📊 Order Dashboard</h2>
      <div className="stats">
        <p>🛍️ Total Orders: {orders.length}</p>
        <p>💰 Total Spent: ₹{totalSpent}</p>
        <p>📦 Products Bought: {totalProducts}</p>
        <p>📅 First Order: {firstOrderDate}</p>
      </div>

      <h3>📖 Order History</h3>
      <ul className="order-history">
        {orders.map((order) => (
          <li key={order.id} className="order-card">
            <strong>{new Date(order.date).toLocaleString()}</strong>
            <ul>
              {order.items.map((item, i) => (
                <li key={i}>{item.name_en} - ₹{item.price}</li>
              ))}
            </ul>
            <p>🧾 Total: ₹{order.total}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

