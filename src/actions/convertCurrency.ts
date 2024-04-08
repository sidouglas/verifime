import type dayjs from 'dayjs';
import { z } from 'zod';

import type { InvoiceTotal } from '@/components/Invoice/LineItem';

const responseSchema = z.object({
  amount: z.number(),
  base: z.string(),
  date: z.string(),
  rates: z.record(z.number()),
});

const baseUrl = process.env.NEXT_PUBLIC_CURRENCY_CONVERSION_URL!;

type CurrencyConversionResult = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

type CurrencyConversionParams = {
  amount: string;
  date: dayjs.Dayjs;
  from: string;
  signal?: AbortSignal;
  to: string;
};

export async function convertCurrency({
  amount,
  date,
  from,
  signal,
  to,
}: CurrencyConversionParams): Promise<CurrencyConversionResult> {
  try {
    const url = new URL(`${baseUrl}/${date.format('YYYY-MM-DD')}`);
    const searchParams = new URLSearchParams();
    searchParams.append('from', from);
    searchParams.append('amount', amount);
    searchParams.append('to', to);

    url.search = searchParams.toString();

    const response = await fetch(url, { signal });
    const data = await response.json();

    return responseSchema.parse(data);
  } catch (error) {
    throw new Error('Error fetching exchange rates');
  }
}

export async function convertCurrencies(
  lineTotals: InvoiceTotal[],
  params: {
    date: dayjs.Dayjs;
    to: string;
  },
) {
  const conversionPromises = lineTotals.map(async lineTotal => {
    if (lineTotal.currency.code !== params.to) {
      const conversionResult = await convertCurrency({
        amount: lineTotal.amount.toString(),
        date: params.date,
        from: lineTotal.currency.code,
        to: params.to,
      });
      return Number(conversionResult.rates[params.to]);
    }
    return lineTotal.amount;
  });
  const conversionResults = await Promise.all(conversionPromises);
  return conversionResults.reduce((acc, amount) => acc + amount, 0);
}
