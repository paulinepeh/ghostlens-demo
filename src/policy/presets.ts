import type { Policy } from '../types';

export const POLICIES: Record<string, Policy> = {
  'Public Post': { email: 'mask', phone: 'bleep', face: 'blur' },
  'Share with Class': { email: 'mask', phone: 'mask', face: 'blur' },
  'Client Demo': { email: 'mask', phone: 'mask', face: 'blur' },
};
