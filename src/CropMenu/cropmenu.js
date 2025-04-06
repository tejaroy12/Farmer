import { speakTelugu } from "../Home/speakTelugu";
import "./cropmenu.css";

const CropMenu = ({
  categories,
  viruses,
  selectedCategory,
  selectedVirus,
  onCategorySelect,
  onVirusSelect,
  onReset
}) => {
  return (
    <div className="crop-bar">
      <div className="filter-section">
        <span
          className={`crop-name ${!selectedCategory ? "active" : ""}`}
          onClick={onReset}
        >
          🏠 All Products
        </span>

        {categories.map((cat) => (
          <div
            key={`cat-${cat.id}`}
            className={`crop-name ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => onCategorySelect(cat.id)}
          >
            {cat.name_te.charAt(0).toUpperCase() + cat.name_te.slice(1)}
            <button
              className="voice-btn"
              onClick={(e) => {
                e.stopPropagation();
                speakTelugu(cat.name_te);
              }}
            >
              🔊
            </button>
          </div>
        ))}
      </div>

      {selectedCategory && viruses.length > 0 && (
        <div className="filter-section">
          {viruses.map((virus) => (
            <span
              key={`virus-${virus.id}`}
              className={`virus-name ${selectedVirus === virus.id ? "active" : ""}`}
              onClick={() => onVirusSelect(virus.id)}
            >
              {virus.name_te.charAt(0).toUpperCase() + virus.name_te.slice(1)}
              <button
                className="voice-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  speakTelugu(virus.name_te);
                }}
              >
                🔊
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropMenu;
