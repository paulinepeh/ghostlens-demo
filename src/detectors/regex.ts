import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import type { Detection } from '../types';

export function detectEmails(input: string, atSec = 0): Detection[] {
  const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  const dets: Detection[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    dets.push({
      id: `email-${m.index}-${Date.now()}`,
      type: 'email',
      startSec: atSec,
      endSec: atSec + 2,
      text: m[0],
      confidence: 0.95,
    });
  }
  return dets;
}

export function detectPhones(input: string, region: CountryCode = 'SG', atSec = 0): Detection[] {
  // naive digit grab, then validate/format with libphonenumber
  const candidates = input.match(/(?<!\d)(\+?\d[\d\s-]{6,}\d)(?!\d)/g) ?? [];
  return candidates.flatMap((cand, i) => {
    const parsed = parsePhoneNumberFromString(cand, { defaultCountry: region });
    if (!parsed || !parsed.isValid()) return [];
    return [{
      id: `phone-${i}-${Date.now()}`,
      type: 'phone',
      startSec: atSec,
      endSec: atSec + 2,
      text: parsed.formatInternational(),
      confidence: 0.9,
    }];
  });
}
