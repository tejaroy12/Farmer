// components/ProductCard/ProductCard.jsx
import { speakTelugu } from "./speakTelugu";

const ProductCard = ({ product, expanded, toggleExpand, handleBuyNow }) => {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name_en} className="product-image" />
      <div className="product-info">
        <div>
          <h3 className="product-name">{product.name_te}</h3>
          <p className="product-company">{product.company}</p>
        </div>
        {/* <p className="product-description">
          {expanded
            ? product.description
            : product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
          {product.description.length > 100 && (
            <span className="view-toggle-btn" onClick={toggleExpand}>
              {expanded ? "view less" : "view more"}
            </span>
          )}
        </p> */}
        <button className="voice-button" onClick={() => speakTelugu(product.description)}>
          🔊 Description వినండి
        </button>
        <div className="price-buy">
          <p className="product-price">₹{product.price}</p>

          {product.quantity > 0 ? 
          <button 
          className="buy-button" 
          onClick={(e) => {
              e.stopPropagation();
              {const sentence = `${product.name_te} మీ కార్ట్‌లో విజయవంతంగా. కొనుగోలు కొనసాగించాలంటే, దయచేసి దిగువనున్న టోటల్ బటన్‌పై క్లిక్ చేయండి.`;
              speakTelugu(sentence);}
              // speakTelugu(`${product.name_te} కార్ట్ జోడించబడింది. మీరు కొనాలనుకుంటే దిగువన టోటల్ బటన్ పై క్లిక్ చేయండి.`);
              handleBuyNow(product);
          }}
          >
          Buy Now
          </button>
          :<button
          className="out-of-stock-button"
          onClick={(e) => {
            e.stopPropagation();
            {const sentence = `ప్రస్తుతం ${product.name_te} ఉత్పత్తి అందుబాటులో లేదు.`;
            speakTelugu(sentence);}
            // speakTelugu(`${product.name_te} కార్ట్ జోడించబడింది. మీరు కొనాలనుకుంటే టోటల్ బటన్ పై క్లిక్ చేయండి.`);

          }}
          >
            Out Of Stock
            </button>}

        </div>
      </div>
    </div>
  );
};

export default ProductCard;
