export type DetectionType = 'email' | 'phone' | 'face';
export type ActionType = 'blur' | 'mask' | 'bleep' | 'none';

export interface Detection {
  id: string;
  type: DetectionType;
  startSec: number;      // when it applies (for video)
  endSec: number;
  text?: string;         // matched text if any
  bbox?: { x: number; y: number; w: number; h: number }; // video-frame coords (0..1)
  confidence?: number;   // 0..1
}

export interface Policy {
  email: ActionType;
  phone: ActionType;
  face: ActionType;
}

export interface PrivacyReport {
  createdAt: string;
  policyName: string;
  items: Array<{
    type: DetectionType;
    at: number;
    text?: string;
    bbox?: { x:number; y:number; w:number; h:number };
    action: ActionType;
  }>;
}
