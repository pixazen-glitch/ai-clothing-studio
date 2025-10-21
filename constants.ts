import { ShotType, CameraAngle, GalleryStyle, GalleryBackground, AdStyle, AdBackground, AspectRatio, LightingStyle, Atmosphere, ModelBodyType } from './types';

export const SHOT_TYPES: { value: ShotType; label: string }[] = [
  { value: 'Product Gallery', label: 'Product Gallery' },
  { value: 'Creative Ad', label: 'Creative Ad' },
];

export const CAMERA_ANGLES: { value: CameraAngle; label: string }[] = [
  { value: 'Full Body Shot', label: 'Full Body' },
  { value: 'Medium Shot (Waist Up)', label: 'Medium Shot' },
  { value: 'Close-up Detail', label: 'Close-up Detail' },
  { value: 'Low Angle Shot', label: 'Low Angle' },
  { value: 'High Angle Shot', label: 'High Angle' },
];

export const GALLERY_STYLES: { value: GalleryStyle; label: string }[] = [
  { value: 'On-Model Shot', label: 'On-Model' },
  { value: 'Flat Lay', label: 'Flat Lay' },
  { value: 'Ghost Mannequin', label: 'Ghost Mannequin' },
];

export const GALLERY_BACKGROUNDS: { value: GalleryBackground; label: string }[] = [
    { value: 'Plain White/Gray', label: 'Plain White/Gray' },
    { value: 'Minimalist Studio', label: 'Minimalist Studio' },
    { value: 'Subtle Lifestyle', label: 'Subtle Lifestyle' },
];

export const AD_STYLES: { value: AdStyle; label: string }[] = [
  { value: 'Urban Streetwear', label: 'Urban Streetwear' },
  { value: 'Luxury Editorial', label: 'Luxury Editorial' },
  { value: 'Vibrant & Poppy', label: 'Vibrant & Poppy' },
  { value: 'Earthy & Natural', label: 'Earthy & Natural' },
  { value: 'Vintage Film Look', label: 'Vintage Film' },
];

export const AD_BACKGROUNDS: { value: AdBackground; label: string }[] = [
    { value: 'Busy City Street', label: 'City Street' },
    { value: 'Abstract Shapes & Colors', label: 'Abstract & Colorful' },
    { value: 'Lush Nature Scene', label: 'Nature Scene' },
    { value: 'Elegant Interior', label: 'Elegant Interior' },
    { value: 'Neon-lit Alley', label: 'Neon Alley' },
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: '1:1 (Square)', label: '1:1 (Square)' },
  { value: '9:16 (Story/Reel)', label: '9:16 (Story)' },
  { value: '4:5 (Portrait Feed)', label: '4:5 (Portrait)' },
  { value: '16:9 (Landscape)', label: '16:9 (Landscape)' },
];

export const LIGHTING_STYLES: { value: LightingStyle; label: string }[] = [
    { value: 'Soft Studio Light', label: 'Soft Studio' },
    { value: 'Dramatic Hard Light', label: 'Dramatic Hard' },
    { value: 'Natural Golden Hour', label: 'Golden Hour' },
    { value: 'Backlit / Rim Lighting', label: 'Backlit' },
];

export const ATMOSPHERES: { value: Atmosphere; label: string }[] = [
    { value: 'Bright Sunny Day', label: 'Sunny Day' },
    { value: 'Overcast & Moody', label: 'Overcast & Moody' },
    { value: 'Golden Hour Sunset', label: 'Golden Hour Sunset' },
    { value: 'Misty & Foggy Morning', label: 'Misty Morning' },
    { value: 'Rainy Night (Neon Reflections)', label: 'Rainy Night' },
];

export const MODEL_BODY_TYPES: { value: ModelBodyType; label: string }[] = [
    { value: 'Slim', label: 'Slim / Slender' },
    { value: 'Athletic', label: 'Athletic / Toned' },
    { value: 'Average', label: 'Average / Standard' },
    { value: 'Curvy', label: 'Curvy / Hourglass' },
    { value: 'Plus-size', label: 'Plus-size / Oversize' },
];