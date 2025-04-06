import { useEffect, useState } from "react";
import CropMenu from "../CropMenu/cropmenu";
import Loader from "../Loader/loader";
import CartPanel from "./CartPanel";
import "./index.css";
import ProductCard from "./ProductCard";

const shopLat = 17.160855;
const shopLng = 79.495642;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({ type: null, id: null });
  const [categories, setCategories] = useState([]);
  const [viruses, setViruses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVirus, setSelectedVirus] = useState(null);
  const [filteredViruses, setFilteredViruses] = useState([]);
  const [distance, setDistance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetch("https://raythu-admin.vercel.app/product")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);

    fetch("https://raythu-admin.vercel.app/category")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);

    fetch("https://raythu-admin.vercel.app/virus")
      .then((res) => res.json())
      .then(setViruses)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = viruses.filter(v => v.category_id === selectedCategory);
      setFilteredViruses(filtered);
      setSelectedVirus(null);
    } else {
      setFilteredViruses([]);
      setSelectedVirus(null);
    }
  }, [selectedCategory, viruses]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let watchId;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        ({ coords: { latitude, longitude } }) => {
          const dist = getDistance(latitude, longitude, shopLat, shopLng);
          setDistance(dist.toFixed(1));
          setUserLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setDistance(null);
          setUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleBuyNow = (product) => {
    setCart((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index].quantity += 1;
        return updated;
      } else {
        const updated = [...prev, { ...product, quantity: 1 }];
        if (updated.length === 1) setCartOpen(true);
        return updated;
      }
    });
    animateButton();
    alert(`${product.name_en} added to cart.`);
  };

  const animateButton = () => {
    const btn = document.querySelector(".floating-cart-button");
    if (btn) {
      btn.classList.add("cart-bounce");
      setTimeout(() => btn.classList.remove("cart-bounce"), 300);
    }
  };

  const handleRemove = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    if (updated.length === 0) setCartOpen(false);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updated = [...cart];
    updated[index].quantity = newQuantity;
    setCart(updated);
  };

  const handleTotalBuy = (deliveryType) => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const baseTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = deliveryType === "auto" ? 20 * itemCount :
                           deliveryType === "bike" ? 50 : 0;
    const finalTotal = baseTotal + deliveryCharge;
  
    const deliveryLabel = {
      auto: "Auto (₹20 per item)",
      bike: "Bike (₹50 flat)",
      visit: "Visit Store (Free)",
    }[deliveryType];
  
    const cartLines = cart.map(
      (item, i) => `${i + 1}. ${item.name_en} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");
  
    const locationLink = userLocation
      ? `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`
      : "Location not shared";
  
    const message = `New Order:\n\n${cartLines}\n\nDelivery: ${deliveryLabel}\nDelivery Charge: ₹${deliveryCharge}\nTotal Items: ${itemCount}\nTotal: ₹${finalTotal}\nLocation: ${locationLink}`;
  
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/919390315670?text=${encoded}`;
    window.open(url, "_blank");
  };
  

  const filteredProducts = selectedCategory
    ? products.filter((p) => {
        const matchesCategory = p.category_id === selectedCategory;
        const matchesVirus = selectedVirus ? p.virus_id === selectedVirus : true;
        return matchesCategory && matchesVirus;
      })
    : products;

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleVirusSelect = (virusId) => {
    setSelectedVirus(virusId === selectedVirus ? null : virusId);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedVirus(null);
  };

  return (
    <>
      {products.length === 0 ? (
        <Loader />
      ) : (
        <>
          {cart.length > 0 && (
            <button
              className="floating-cart-button"
              onClick={() => setCartOpen(!cartOpen)}
            >
              🛒 Total Buy ({cart.length})
            </button>
          )}

          <div className="crop-menu">
            <CropMenu
              categories={categories}
              viruses={filteredViruses}
              selectedCategory={selectedCategory}
              selectedVirus={selectedVirus}
              onCategorySelect={handleCategorySelect}
              onVirusSelect={handleVirusSelect}
              onReset={resetFilters}
            />
          </div>

          {cartOpen && (
            <CartPanel
              cart={cart}
              handleRemove={handleRemove}
              handleQuantityChange={handleQuantityChange}
              onClose={() => setCartOpen(false)}
              handleTotalBuy={handleTotalBuy}
            />
          )}

          <div className="home-container">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                expanded={expandedProducts[product.id]}
                toggleExpand={() =>
                  setExpandedProducts((prev) => ({
                    ...prev,
                    [product.id]: !prev[product.id],
                  }))
                }
                handleBuyNow={handleBuyNow}
              />
            ))}
          </div>

          <footer className="footer">
            {distance && (
              <p>📍 You are approximately {distance} km from our shop.</p>
            )}
            {userLocation && (
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${shopLat},${shopLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
              >
                🧭 Get Directions
              </a>
            )}
            <p>🤝 We are trusted by 1000+ farmers and families.</p>
            <a
              href="https://wa.me/919390315670?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20shop%20and%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              📞 Contact us on WhatsApp
            </a>
          </footer>
        </>
      )}
    </>
  );
};

export default Home;
