import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CropMenu from "../CropMenu/cropmenu";
import Loader from "../Loader/loader";
import CartPanel from "./CartPanel";
import ProductCard from "./ProductCard";
import "./index.css";

// Constants
const SHOP_LOCATION = {
  lat: 14.6197511,
  lng: 78.0043446
};
const WHATSAPP_NUMBER = "919390315670";

const Home = () => {
  // URL State Management
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlVirus = searchParams.get('virus');


  const [visibleCount, setVisibleCount] = useState(10); // number of products to show initially
  const [loaderRef, setLoaderRef] = useState(null); // ref for the last product

  useEffect(() => {
    if (!loaderRef) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 10); // load next 10 items
        }
      },
      { threshold: 1.0 }
    );
  
    observer.observe(loaderRef);
  
    return () => {
      if (loaderRef) observer.unobserve(loaderRef);
    };
  }, [loaderRef]);
  


  // Application State
  const [products, setProducts] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage", error);
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [viruses, setViruses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory ? parseInt(urlCategory) : null
  );
  const [selectedVirus, setSelectedVirus] = useState(
    urlVirus ? parseInt(urlVirus) : null
  );
  const [filteredViruses, setFilteredViruses] = useState([]);
  const [distance, setDistance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data Fetching
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      return [];
    }
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedVirus) params.set('virus', selectedVirus);
    setSearchParams(params);
  }, [selectedCategory, selectedVirus, setSearchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedCategory) queryParams.set('category', selectedCategory);
        if (selectedVirus) queryParams.set('virus', selectedVirus);
  
        const data = await fetchData(
          `https://raythu-admin.vercel.app/product/v2?${queryParams.toString()}`
        );
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [selectedCategory, selectedVirus]);
  
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setSelectedVirus(null); // this fixes your problem
  };
  useEffect(() => {
    setSelectedVirus(null); // whenever category changes, reset virus
  }, [selectedCategory]);
  

  // Fetch initial data (categories and viruses)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, virusesData] = await Promise.all([
          fetchData("https://raythu-admin.vercel.app/category"),
          fetchData("https://raythu-admin.vercel.app/virus")
        ]);
        setCategories(categoriesData);
        setViruses(virusesData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchInitialData();
  }, []);

  // Filter viruses based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = viruses.filter(v => v.category_id === selectedCategory);
      setFilteredViruses(filtered);
      // Only reset virus if not coming from URL
      if (!urlVirus) setSelectedVirus(null);
    } else {
      setFilteredViruses([]);
      setSelectedVirus(null);
    }
  }, [selectedCategory, viruses, urlVirus]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cart]);

  // Geolocation tracking
  useEffect(() => {
    let watchId;
    
    const handleGeolocation = ({ coords }) => {
      const dist = calculateDistance(
        coords.latitude, 
        coords.longitude, 
        SHOP_LOCATION.lat, 
        SHOP_LOCATION.lng
      );
      setDistance(dist.toFixed(1));
      setUserLocation({ lat: coords.latitude, lng: coords.longitude });
    };

    const handleGeolocationError = (error) => {
      console.error("Geolocation error:", error);
      setDistance(null);
      setUserLocation(null);
    };

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        handleGeolocation,
        handleGeolocationError,
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.warn("Geolocation not supported");
    }

    return () => watchId && navigator.geolocation.clearWatch(watchId);
  }, []);

  // Helper Functions
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * 
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const animateButton = () => {
    const btn = document.querySelector(".floating-cart-button");
    btn?.classList.add("cart-bounce");
    setTimeout(() => btn?.classList.remove("cart-bounce"), 300);
  };

  // Cart Handlers
  const handleBuyNow = (product) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(p => p.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      const newCart = [...prev, { ...product, quantity: 1 }];
      if (newCart.length === 1) setCartOpen(true);
      return newCart;
    });
    animateButton();
  };

  const handleRemove = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map((item, i) => 
      i === index ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleTotalBuy = (deliveryType) => {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const baseTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = {
      auto: 20 * itemCount,
      bike: 50,
      visit: 0
    }[deliveryType];
    
    const total = baseTotal + deliveryCharge;
    const deliveryLabel = {
      auto: "Auto (₹20 per item)",
      bike: "Bike (₹50 flat)",
      visit: "Visit Store (Free)"
    }[deliveryType];

    const cartLines = cart.map(
      (item, i) => `${i + 1}. ${item.name_en} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");

    const locationLink = userLocation 
      ? `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`
      : "Location not shared";

    const message = `New Order:\n\n${cartLines}\n\nDelivery: ${deliveryLabel}\n` +
                   `Delivery Charge: ₹${deliveryCharge}\n` +
                   `Total Items: ${itemCount}\nTotal: ₹${total}\n` +
                   `Location: ${locationLink}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Filter Handlers
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const handleVirusSelect = (virusId) => {
    setSelectedVirus(prev => prev === virusId ? null : virusId);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedVirus(null);
  };

  const filteredProducts = products.filter(product => {
    // Safely process categories (handle both array and string formats)
    const categoryIds = product.categories
      ? Array.isArray(product.categories)
        ? product.categories.map(Number)
        : product.categories.split(',').map(Number)
      : [];
  
    // Safely process viruses (handle both array and string formats)
    const virusIds = product.viruses
      ? Array.isArray(product.viruses)
        ? product.viruses.map(Number)
        : product.viruses.split(',').map(Number)
      : [];
  
    const categoryMatch = !selectedCategory || categoryIds.includes(selectedCategory);
    const virusMatch = !selectedVirus || virusIds.includes(selectedVirus);
    
    return categoryMatch && virusMatch;
  });

  


  if (loading) return <Loader />;
  if (error) return <div className="error-message">Error: {error}</div>;
  return (
    <>
      {cart.length > 0 && (
        <button
          className="floating-cart-button"
          onClick={() => setCartOpen(!cartOpen)}
          aria-label="View cart"
        >
          🛒 Total Buy ({cart.reduce((sum, item) => sum + item.quantity, 0)})
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
      {products.slice(0, visibleCount).map((product, index) => {
    const isLast = index === visibleCount - 1;
    return (
      <div key={product.id} ref={isLast ? setLoaderRef : null}>
        <ProductCard
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
      </div>
    );
  })}
      </div>

      <footer className="footer">
        {distance && (
          <p>📍 You are approximately {distance} km from our shop.</p>
        )}
        {userLocation && (
          <a
            href="https://maps.app.goo.gl/tGYqsVexcVXhcYmN6"
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
  );
};

export default Home;
