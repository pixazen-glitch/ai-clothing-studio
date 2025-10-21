
import React, { useState, useEffect, useCallback } from 'react';
import { CustomizationOptions, ImageFile } from './types';
import { generateImage, analyzeStyleImage } from './services/geminiService';
import CustomizationPanel from './components/CustomizationPanel';
import ImageWorkspace from './components/ImageWorkspace';
import PromptEditor from './components/PromptEditor';
import {
  SHOT_TYPES,
  CAMERA_ANGLES,
  GALLERY_STYLES,
  GALLERY_BACKGROUNDS,
  AD_STYLES,
  AD_BACKGROUNDS,
  ASPECT_RATIOS,
  LIGHTING_STYLES,
  ATMOSPHERES,
  MODEL_BODY_TYPES
} from './constants';

function App() {
  const [productImage, setProductImage] = useState<ImageFile | null>(null);
  const [styleImage, setStyleImage] = useState<ImageFile | null>(null);
  const [faceReferenceImage, setFaceReferenceImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
  
  const [styleDescription, setStyleDescription] = useState<string | null>(null);
  const [isAnalyzingStyle, setIsAnalyzingStyle] = useState<boolean>(false);

  const [options, setOptions] = useState<CustomizationOptions>({
    shotType: SHOT_TYPES[0].value,
    cameraAngle: CAMERA_ANGLES[0].value,
    lighting: LIGHTING_STYLES[0].value,
    modelDescription: '',
    modelBodyType: MODEL_BODY_TYPES[2].value, // Default to Average
    accessories: '',
    atmosphere: ATMOSPHERES[0].value,
    gallery: {
      style: GALLERY_STYLES[0].value,
      background: GALLERY_BACKGROUNDS[0].value,
    },
    ad: {
      style: AD_STYLES[0].value,
      background: AD_BACKGROUNDS[0].value,
      aspectRatio: ASPECT_RATIOS[0].value,
    },
  });

  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (styleImage) {
      const getStyleDescription = async () => {
        setIsAnalyzingStyle(true);
        setError(null);
        try {
          const description = await analyzeStyleImage(styleImage);
          setStyleDescription(description);
        } catch (err) {
          console.error(err);
          setError(err instanceof Error ? err.message : "Could not analyze the style image.");
          setStyleDescription(null);
        } finally {
          setIsAnalyzingStyle(false);
        }
      };
      getStyleDescription();
    } else {
      setStyleDescription(null);
    }
  }, [styleImage]);


  useEffect(() => {
    if (!productImage) {
      setPrompt('');
      return;
    }
    
    const crucialInstruction = `
**Crucial Instruction:** The original clothing item from the provided image must be preserved with absolute fidelity. Do not alter its design, color, texture, fabric, or any other visual characteristic. The goal is to place the *exact same* clothing item into a new scene, not to create a new version of it.`;
    
    const showOnModelShot = options.shotType === 'Creative Ad' || (options.shotType === 'Product Gallery' && options.gallery.style === 'On-Model Shot');

    let modelInstruction = '';
    if (showOnModelShot) {
        const modelDetails = [];
        if (options.modelDescription.trim()) {
            modelDetails.push(options.modelDescription.trim());
        }
        modelDetails.push(`a "${options.modelBodyType}" body type`);

        modelInstruction = `- Model: The model wearing the clothing should be ${modelDetails.join(' with ')}. It is crucial that the clothing fits this specified body shape in a natural and flattering way.`
    }
    
    const accessoriesInstruction = options.accessories.trim() !== '' 
      ? `- Styling: The model should be styled with the following accessories: ${options.accessories.trim()}. These should complement the main clothing item and the overall aesthetic.` 
      : '';
      
    const faceReferenceInstruction = faceReferenceImage
      ? `\n- Face Reference: It is absolutely crucial to use the face from the provided 'Face Reference' image for the model. Replicate the facial features, hair, and overall likeness of this specific person to ensure model consistency across all photos.`
      : '';


    let newPrompt = '';
    if (options.shotType === 'Product Gallery') {
        const { style, background } = options.gallery;
        newPrompt = `Generate a high-resolution, professional product photograph for an e-commerce gallery. The product is the clothing item in the provided image.
${crucialInstruction}
- Style: Feature the clothing in a "${style}" presentation.
${showOnModelShot ? modelInstruction : ''}
${showOnModelShot ? faceReferenceInstruction : ''}
- Camera Angle: The camera must capture a "${options.cameraAngle}".
${showOnModelShot ? accessoriesInstruction : ''}
- Background: Use a "${background}" background. The background should be clean, non-distracting, and complementary to the clothing.
- Lighting: The scene must be illuminated with "${options.lighting}".
- Focus: The image must be sharp, detailed, and perfectly centered.`;

    } else { // Creative Ad
        const { style, background, aspectRatio } = options.ad;
        newPrompt = `Generate a visually stunning and creative advertisement image for a social media campaign (e.g., Facebook, Instagram). The product is the clothing item in the provided image.
${crucialInstruction}
- Ad Style: The aesthetic should be "${style}".
${modelInstruction}
${faceReferenceInstruction}
- Camera Angle: The camera must capture a "${options.cameraAngle}".
${accessoriesInstruction}
- Scene: Place the product in a "${background}" setting that matches the ad style.
- Atmosphere: The scene's atmosphere should be "${options.atmosphere}".
- Lighting: The scene must be illuminated with "${options.lighting}".
- Aspect Ratio: The final image must have a strict aspect ratio of ${aspectRatio.split(' ')[0]}.
- Mood & Composition: The overall mood should be eye-catching and engaging. Use dynamic composition to create a viral-worthy image.`;
    }

    if (styleImage) {
        if (isAnalyzingStyle) {
            newPrompt += `\n\n- Style Reference: Analyzing the provided style reference image...`;
        } else if (styleDescription) {
            newPrompt += `\n\n- Style Reference: Strictly adhere to the aesthetic of the provided style reference image, which has a ${styleDescription}. The goal is to make the product look as if it belongs in the same visual world.`;
        } else {
             newPrompt += `\n\n- Style Reference: Strictly adhere to the aesthetic, color palette, texture, and overall mood of the provided style reference image. The goal is to make the product look as if it belongs in the same visual world as the style reference.`;
        }
    }

    setPrompt(newPrompt.replace(/\n\n+/g, '\n').replace(/- /g, '\n- ').trim());
  }, [options, productImage, styleImage, faceReferenceImage, styleDescription, isAnalyzingStyle]);
  
  const handleGenerate = useCallback(async () => {
    if (!productImage || !prompt) {
      setError('Please upload a clothing image and ensure the prompt is not empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage(productImage, prompt, styleImage, faceReferenceImage);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [productImage, prompt, styleImage, faceReferenceImage]);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<ImageFile | null>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setter({
          base64: base64String.split(',')[1],
          mimeType: file.type,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 pb-2">
          AI Clothing Studio
        </h1>
        <p className="text-gray-400 mt-2">Create stunning product galleries & viral social media ads for your clothing brand.</p>
      </header>
      
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <ImageWorkspace 
                productImage={productImage} 
                onProductImageUpload={handleFileChange(setProductImage)}
                generatedImage={generatedImage}
                isLoading={isLoading}
            />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-8">
            <CustomizationPanel 
                options={options}
                setOptions={setOptions}
                styleImage={styleImage}
                onStyleImageUpload={handleFileChange(setStyleImage)}
                isAnalyzingStyle={isAnalyzingStyle}
                faceReferenceImage={faceReferenceImage}
                onFaceReferenceImageUpload={handleFileChange(setFaceReferenceImage)}
            />
            <PromptEditor 
                prompt={prompt}
                setPrompt={setPrompt}
            />
            {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">{error}</div>}
             <button 
                onClick={handleGenerate}
                disabled={isLoading || !productImage || isAnalyzingStyle}
                className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-600 hover:to-fuchsia-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:shadow-fuchsia-500/20 disabled:shadow-none transform hover:-translate-y-1 disabled:transform-none"
            >
                {isAnalyzingStyle ? 'Analyzing Style...' : isLoading ? 'Generating...' : 'Generate Image'}
            </button>
        </div>
      </main>
    </div>
  );
}

export default App;