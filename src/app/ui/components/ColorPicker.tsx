import React, { useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { FaCopy, FaCheck } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ColorPicker = ({ setColor }: { setColor: (color: string) => void }) => {
  const [selectedColor, setSelectedColor] = useState("#1a73e8");
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const predefinedColors = {
    basic: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    pastel: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFB3FF", "#B3FFFF"],
    vibrant: ["#FF1744", "#00E676", "#2979FF", "#FFEA00", "#D500F9", "#00E5FF"],
    grayscale: [
      "#000000",
      "#333333",
      "#666666",
      "#999999",
      "#CCCCCC",
      "#FFFFFF",
    ],
  };

  const handleColorSelect = useCallback((color: string) => {
    setColor(color);
    setSelectedColor(color);
    setRecentColors((prev) => [
      color,
      ...prev.filter((c) => c !== color).slice(0, 5),
    ]);
  }, []);

  const copyToClipboard = async (color: string) => {
    try {
      console.log(color);
      await navigator.clipboard.writeText(color);
      setCopySuccess(true);
      toast.success("Color copied to clipboard!");
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error("Failed to copy color");
    }
  };

  const handleCustomInput = (e) => {
    const value = e.target.value;
    setCustomInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      handleColorSelect(value);
    }
  };

  const ColorTile = ({ color, label }: { color: string; label: string }) => (
    <button
      aria-label={`Select color ${color}`}
      className="w-12 h-12 rounded-lg shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      style={{ backgroundColor: color }}
      onClick={() => handleColorSelect(color)}
    >
      <span className="sr-only">{label}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div
              className="w-24 h-24 rounded-lg shadow-lg"
              style={{ backgroundColor: selectedColor }}
            />
            <div className="space-y-2">
              <p className="text-lg font-semibold">Selected Color</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={selectedColor}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                />
                <button
                  onClick={() => copyToClipboard(selectedColor)}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  aria-label="Copy color code"
                >
                  {copySuccess ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Color</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={customInput}
                onChange={handleCustomInput}
                placeholder="Enter HEX code (e.g., #FF0000)"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <HexColorPicker
                color={selectedColor}
                onChange={handleColorSelect}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(predefinedColors).map(([category, colors]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-lg font-semibold capitalize">
                {category} Colors
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <ColorTile
                    key={color}
                    color={color}
                    label={`${category} color ${color}`}
                  />
                ))}
              </div>
            </div>
          ))}

          {recentColors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Recent Colors</h3>
              <div className="grid grid-cols-6 gap-2">
                {recentColors.map((color) => (
                  <ColorTile
                    key={color}
                    color={color}
                    label={`Recent color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ColorPicker;
