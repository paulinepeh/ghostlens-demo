import type { Detection, Policy } from '../types';

export function computePrivacyScore(
  detections: Detection[],
  policy: Policy
): { score: number; issues: Record<string, number>; badge: string } {
  // base 100, subtract per unprotected sensitive item
  let score = 100;
  const issues: Record<string, number> = { email: 0, phone: 0, face: 0 };

  for (const d of detections) {
    issues[d.type] = (issues[d.type] ?? 0) + 1;
    const action = policy[d.type];
    // harsher penalty if action is 'none'
    score -= action === 'none' ? 8 : 2;
  }

  score = Math.max(0, Math.min(100, score));

  let badge = 'Bronze';
  if (score >= 90) badge = 'Platinum';
  else if (score >= 80) badge = 'Gold';
  else if (score >= 65) badge = 'Silver';

  return { score, issues, badge };
}
