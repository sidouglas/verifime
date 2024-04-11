'use client';
import type dayjs from 'dayjs';

import type { Currency } from '@/components/CurrencySelect';
import type { LineItemModel } from '@/components/Invoice';
import type { InvoiceTotal } from '@/components/Invoice/LineItem';

export type Invoice = {
  currency: Currency;
  date: dayjs.Dayjs;
  id: string;
  lineTotals?: InvoiceTotal[];
  lines: LineItemModel[];
  total: number;
};

export type InvoiceActions = 'close' | 'export' | 'import' | 'open';
