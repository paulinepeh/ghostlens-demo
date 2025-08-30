// src/types.ts
export type DetectionType = 'email' | 'phone' | 'face';
export type ActionType = 'blur' | 'mask' | 'bleep' | 'none';

export interface Detection {
  id: string;
  type: DetectionType;
  startSec: number;
  endSec: number;
  text?: string;
  bbox?: { x: number; y: number; w: number; h: number };
  confidence?: number;
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
