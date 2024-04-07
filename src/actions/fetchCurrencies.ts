import { z } from 'zod';

const currencySchema = z.record(z.string());

export type CurrencyData = z.infer<typeof currencySchema>;
let deferredPromise: Promise<CurrencyData> | null = null;

export async function fetchCurrencies(): Promise<CurrencyData> {
  if (!deferredPromise) {
    deferredPromise = new Promise<CurrencyData>(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CURRENCY_CONVERSION_URL}/currencies`,
        );
        if (!response.ok) {
          throw new Error(`Error fetching currencies: ${response.status}`);
        }
        const data = await response.json();
        resolve(currencySchema.parse(data));
      } catch (error) {
        reject(error);
      }
    });
  }
  return deferredPromise.then(currencyData => currencyData ?? false);
}
