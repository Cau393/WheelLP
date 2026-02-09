const TYPES = {
  RARE: { label: '40% OFF', type: 'rare' },
  MEDIUM: { label: '35% OFF', type: 'medium' },
  COMMON: { label: '30% + eBook', type: 'common' },
} as const;

export interface Prize {
  id: string;
  label: string;
  type: string;
  color: string; 
  textColor: string;
}

export const WHEEL_SEGMENTS: Prize[] = [
  { ...TYPES.COMMON, id: '1', color: '#0066cc', textColor: '#ffffff' },
  { ...TYPES.MEDIUM, id: '2', color: '#f0f0f0', textColor: '#0066cc' },
  { ...TYPES.COMMON, id: '3', color: '#0066cc', textColor: '#ffffff' },
  { ...TYPES.MEDIUM, id: '4', color: '#f0f0f0', textColor: '#0066cc' },
  { ...TYPES.COMMON, id: '5', color: '#0066cc', textColor: '#ffffff' },
  { ...TYPES.COMMON, id: '6', color: '#f0f0f0', textColor: '#0066cc' },
  { ...TYPES.RARE,   id: '7', color: '#0066cc', textColor: '#ffffff' },
  { ...TYPES.COMMON, id: '8', color: '#f0f0f0', textColor: '#0066cc' },
  { ...TYPES.MEDIUM, id: '9', color: '#0066cc', textColor: '#ffffff' },
  { ...TYPES.COMMON, id: '10', color: '#f0f0f0', textColor: '#0066cc' },
  { ...TYPES.MEDIUM, id: '11', color: '#0066cc', textColor: '#ffffff' },
  { ...TYPES.COMMON, id: '12', color: '#f0f0f0', textColor: '#0066cc' },
];