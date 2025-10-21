
export type ShotType = 'Product Gallery' | 'Creative Ad';

export type CameraAngle = 'Full Body Shot' | 'Medium Shot (Waist Up)' | 'Close-up Detail' | 'Low Angle Shot' | 'High Angle Shot';

export type GalleryStyle = 'On-Model Shot' | 'Flat Lay' | 'Ghost Mannequin';
export type GalleryBackground = 'Plain White/Gray' | 'Minimalist Studio' | 'Subtle Lifestyle';

export type AdStyle = 'Urban Streetwear' | 'Luxury Editorial' | 'Vibrant & Poppy' | 'Earthy & Natural' | 'Vintage Film Look';
export type AdBackground = 'Busy City Street' | 'Abstract Shapes & Colors' | 'Lush Nature Scene' | 'Elegant Interior' | 'Neon-lit Alley';
export type AspectRatio = '1:1 (Square)' | '9:16 (Story/Reel)' | '4:5 (Portrait Feed)' | '16:9 (Landscape)';

export type LightingStyle = 'Soft Studio Light' | 'Dramatic Hard Light' | 'Natural Golden Hour' | 'Backlit / Rim Lighting';
export type Atmosphere = 'Bright Sunny Day' | 'Overcast & Moody' | 'Golden Hour Sunset' | 'Misty & Foggy Morning' | 'Rainy Night (Neon Reflections)';
export type ModelBodyType = 'Slim' | 'Athletic' | 'Average' | 'Curvy' | 'Plus-size';


export interface CustomizationOptions {
  shotType: ShotType;
  cameraAngle: CameraAngle;
  lighting: LightingStyle;
  modelDescription: string;
  modelBodyType: ModelBodyType;
  accessories: string;
  atmosphere: Atmosphere;
  gallery: {
    style: GalleryStyle;
    background: GalleryBackground;
  };
  ad: {
    style: AdStyle;
    background: AdBackground;
    aspectRatio: AspectRatio;
  };
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}