
import React from 'react';
import { CustomizationOptions, ImageFile } from '../types';
import { 
    SHOT_TYPES, CAMERA_ANGLES, GALLERY_STYLES, GALLERY_BACKGROUNDS, 
    AD_STYLES, AD_BACKGROUNDS, ASPECT_RATIOS, LIGHTING_STYLES, ATMOSPHERES, MODEL_BODY_TYPES 
} from '../constants';
import ImageUploader from './ImageUploader';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  setOptions: React.Dispatch<React.SetStateAction<CustomizationOptions>>;
  styleImage: ImageFile | null;
  onStyleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isAnalyzingStyle: boolean;
  faceReferenceImage: ImageFile | null;
  onFaceReferenceImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomSelect: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <select value={value} onChange={onChange} className="w-full glass-input text-white rounded-md py-2 px-3 transition-all">
            {options.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-800">{opt.label}</option>)}
        </select>
    </div>
);


const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ 
    options, 
    setOptions, 
    styleImage, 
    onStyleImageUpload, 
    isAnalyzingStyle,
    faceReferenceImage,
    onFaceReferenceImageUpload
}) => {
  const handleTopLevelChange = (key: keyof Omit<CustomizationOptions, 'gallery' | 'ad'>, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleNestedOptionChange = (
    category: 'gallery' | 'ad',
    key: keyof CustomizationOptions['gallery'] | keyof CustomizationOptions['ad'],
    value: string
  ) => {
    setOptions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const showOnModelInputs = options.shotType === 'Creative Ad' || 
                           (options.shotType === 'Product Gallery' && options.gallery.style === 'On-Model Shot');

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white">Customize Your Shot</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Shot Type</label>
        <div className="flex bg-black/20 rounded-lg p-1">
            {SHOT_TYPES.map(type => (
                <button
                key={type.value}
                onClick={() => handleTopLevelChange('shotType', type.value)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 ${
                    options.shotType === type.value
                    ? 'bg-fuchsia-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
                >
                {type.label}
                </button>
            ))}
        </div>
      </div>

       <CustomSelect 
          label="Camera Angle"
          value={options.cameraAngle}
          onChange={(e) => handleTopLevelChange('cameraAngle', e.target.value)}
          options={CAMERA_ANGLES}
      />

       <CustomSelect 
          label="Lighting Style"
          value={options.lighting}
          onChange={(e) => handleTopLevelChange('lighting', e.target.value)}
          options={LIGHTING_STYLES}
      />

      {showOnModelInputs && (
        <div className="animate-fade-in flex flex-col gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Face Reference (Optional)</label>
            <p className="text-xs text-gray-400 mb-2 -mt-1">Upload a model's face to maintain consistency across shots.</p>
            <ImageUploader 
                id="face-reference-uploader"
                title="Upload Face Image"
                image={faceReferenceImage}
                onImageUpload={onFaceReferenceImageUpload}
            />
          </div>
          <CustomSelect 
              label="Model Body Type"
              value={options.modelBodyType}
              onChange={(e) => handleTopLevelChange('modelBodyType', e.target.value)}
              options={MODEL_BODY_TYPES}
          />
          <div>
            <label htmlFor="model-description-input" className="block text-sm font-medium text-gray-300 mb-2">Model Description (Optional)</label>
            <input
              id="model-description-input"
              type="text"
              value={options.modelDescription}
              onChange={(e) => handleTopLevelChange('modelDescription', e.target.value)}
              placeholder="e.g., woman with curly red hair"
              className="w-full glass-input text-white rounded-md py-2 px-3 transition-all"
            />
          </div>
          <div>
            <label htmlFor="accessories-input" className="block text-sm font-medium text-gray-300 mb-2">Accessories (Optional)</label>
            <input
              id="accessories-input"
              type="text"
              value={options.accessories}
              onChange={(e) => handleTopLevelChange('accessories', e.target.value)}
              placeholder="e.g., silver necklace, brown leather bag"
              className="w-full glass-input text-white rounded-md py-2 px-3 transition-all"
            />
          </div>
        </div>
      )}

      {options.shotType === 'Product Gallery' && (
        <div className="flex flex-col gap-4 animate-fade-in">
            <CustomSelect 
                label="Gallery Style"
                value={options.gallery.style}
                onChange={(e) => handleNestedOptionChange('gallery', 'style', e.target.value)}
                options={GALLERY_STYLES}
            />
            <CustomSelect 
                label="Gallery Background"
                value={options.gallery.background}
                onChange={(e) => handleNestedOptionChange('gallery', 'background', e.target.value)}
                options={GALLERY_BACKGROUNDS}
            />
        </div>
      )}

      {options.shotType === 'Creative Ad' && (
        <div className="flex flex-col gap-4 animate-fade-in">
            <CustomSelect 
                label="Ad Style"
                value={options.ad.style}
                onChange={(e) => handleNestedOptionChange('ad', 'style', e.target.value)}
                options={AD_STYLES}
            />
            <CustomSelect 
                label="Ad Scene / Background"
                value={options.ad.background}
                onChange={(e) => handleNestedOptionChange('ad', 'background', e.target.value)}
                options={AD_BACKGROUNDS}
            />
             <CustomSelect 
                label="Atmosphere"
                value={options.atmosphere}
                onChange={(e) => handleTopLevelChange('atmosphere', e.target.value)}
                options={ATMOSPHERES}
            />
            <CustomSelect 
                label="Aspect Ratio"
                value={options.ad.aspectRatio}
                onChange={(e) => handleNestedOptionChange('ad', 'aspectRatio', e.target.value)}
                options={ASPECT_RATIOS}
            />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Style Reference (Optional)</label>
        <div className="relative">
            <ImageUploader 
                id="style-uploader"
                title="Upload Style Image"
                image={styleImage}
                onImageUpload={onStyleImageUpload}
            />
            {isAnalyzingStyle && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-500"></div>
                <p className="text-sm text-white mt-2">Analyzing style...</p>
                </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomizationPanel;