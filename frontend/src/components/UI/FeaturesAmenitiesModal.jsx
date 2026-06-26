import { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp, Zap, Droplets, Trash2, Check } from "lucide-react";

const featureCategories = [
  {
    id: "primary",
    title: "Primary Features",
    icon: "home",
    features: [
      "Built in year",
      "Tv lounge",
      "Store room",
      "Laundry room",
      "Study room",
      "Dinning room",
      "Drawing room",
      "Powder room",
      "Servant quarter",
      "Balcony",
      "Kitchen",
      "Corner plot",
      "Basement",
      "Furnished",
      "Semi furnished"
    ]
  },
  {
    id: "utilities",
    title: "Utilities",
    icon: "zap",
    features: [
      "Sewerage",
      "Electricity",
      "Water supply"
    ]
  }
];

const FeaturesAmenitiesModal = ({ isOpen, onClose, onConfirm, initialFeatures = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState(initialFeatures);
  const [openSections, setOpenSections] = useState(["primary"]);

  // Filter features based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return featureCategories;
    
    const query = searchQuery.toLowerCase();
    return featureCategories.map(category => ({
      ...category,
      features: category.features.filter(feature => 
        feature.toLowerCase().includes(query)
      )
    })).filter(category => category.features.length > 0);
  }, [searchQuery]);

  // Toggle section accordion
  const toggleSection = (sectionId) => {
    setOpenSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Toggle feature selection
  const toggleFeature = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Remove feature from selected
  const removeFeature = (feature) => {
    setSelectedFeatures(prev => prev.filter(f => f !== feature));
  };

  // Reset all selections
  const handleReset = () => {
    setSelectedFeatures([]);
  };

  // Confirm and close
  const handleConfirm = () => {
    onConfirm(selectedFeatures);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Features and Amenities
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Features"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Selected Tags */}
        {selectedFeatures.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-100 bg-red-50/50">
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map((feature) => (
                <span
                  key={feature}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-full"
                >
                  {feature}
                  <button
                    onClick={() => removeFeature(feature)}
                    className="ml-1 hover:bg-red-600 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No features found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(category.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.title}</span>
                      <span className="text-sm text-gray-500">
                        ({category.features.length})
                      </span>
                    </div>
                    {openSections.includes(category.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {/* Section Content */}
                  {openSections.includes(category.id) && (
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {category.features.map((feature) => {
                        const isSelected = selectedFeatures.includes(feature);
                        return (
                          <button
                            key={feature}
                            onClick={() => toggleFeature(feature)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                              isSelected
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 text-red-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{feature}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            disabled={selectedFeatures.length === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              selectedFeatures.length === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Trash2 className="w-4 h-4" />
            Reset
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Confirm ({selectedFeatures.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesAmenitiesModal;

