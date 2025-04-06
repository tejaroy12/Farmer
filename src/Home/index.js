import { useEffect, useState } from "react";
import CropMenu from "../CropMenu/cropmenu";
import Loader from "../Loader/loader";
import "./index.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    fetch("https://raythu-admin.vercel.app/product")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleBuyNow = (product) => {
    setCart((prev) => {
      const updated = [...prev, product];
  
      // ✅ Auto-open cart if it's the first item
      if (updated.length === 1) {
        setCartOpen(true);
      }
  
      return updated;
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
  
    // ✅ Auto-close cart if empty
    if (updated.length === 0) {
      setCartOpen(false);
    }
  };
  

  const handleTotalBuy = () => {
    if (cart.length === 0) return alert("Cart is empty.");
    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
    const productList = cart
      .map((p, i) => `${i + 1}. ${p.name_en} - ₹${p.price}`)
      .join("%0A");
    const message = `🛒 New Order:%0A%0A${productList}%0A%0ATotal: ₹${total}`;
    window.open(`https://wa.me/919390315670?text=${message}`, "_blank");
  };

  const speakTelugu = (text) => {
    const synth = window.speechSynthesis;
  
    const speak = () => {
      const voices = synth.getVoices();
      const teluguVoice =
        voices.find(v => v.lang === "te-IN") ||
        voices.find(v => v.lang.includes("IN") || v.lang.includes("hi"));
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "te-IN";
      utterance.pitch = 0.5;
      utterance.rate = 0.9;
  
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      } else {
        console.warn("Telugu voice not found, using default.");
      }
  
      synth.cancel();
      synth.speak(utterance);
    };
  
    if (synth.getVoices().length === 0) {
      // Wait for voices to load, then speak
      synth.onvoiceschanged = () => {
        speak();
        synth.onvoiceschanged = null; // Clear listener
      };
    } else {
      speak();
    }
  };
  
  
  
  
  
  

  const filteredProducts = selectedCrop
  ? products.filter(p => p.category?.toLowerCase() === selectedCrop.toLowerCase())
  : products;


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
            <CropMenu onCropSelect={(crop) => setSelectedCrop(crop)} />
            {selectedCrop && (
              <button
                className="reset-button"
                onClick={() => setSelectedCrop(null)}
              >
                ⬅️ Homeకి తిరిగి వెళ్ళండి
              </button>
            )}
          </div>

          {cartOpen && (
            <div className="cart-panel">
              <h3>Your Cart</h3>
              <button className="close-cart-btn" onClick={() => setCartOpen(false)}>❌</button>
              <ul className="cart-list">
                {cart.map((item, index) => (
                    <li key={index} className="cart-item">
                    <span className="cart-item-text">
                        {item.name_en} - ₹{item.price}
                    </span>
                    <button className="remove-btn" onClick={() => handleRemove(index)}>
                        ❌
                    </button>
                    </li>
                ))}
                </ul>

              <p className="cart-total">
                Total: ₹
                {cart.reduce((sum, item) => sum + Number(item.price), 0)}
              </p>
              <button className="checkout-button" onClick={handleTotalBuy}>
                ✅ Confirm & Send via WhatsApp
              </button>
            </div>
          )}

          <div className="home-container">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.imageUrl}
                  alt={product.name_en}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.name_te}</h3>
                  <p className="product-company">{product.company}</p>
                  <p className="product-description">{product.description}</p>
                  <button
                    className="voice-button"
                    onClick={() => speakTelugu(product.description)}
                  >
                    🔊 Description వినండి
                  </button>
                  <p className="product-price">₹{product.price}</p>
                  <button
                    className="buy-button"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <footer className="footer">
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
