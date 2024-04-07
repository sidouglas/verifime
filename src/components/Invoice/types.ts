import type dayjs from 'dayjs';

import type { Currency } from '../CurrencySelect';

import type { LineItemModel } from './LineItem';

import type { Invoice } from '@/app/page';

export type InvoiceProps = {
  currency?: Currency;
  date?: dayjs.Dayjs;
  id: string;
  items?: LineItemModel[];
  onTotalChange: (id: string, invoice: Invoice) => void;
};

export type InvoiceState = {
  currency: NotUndefined<InvoiceProps['currency']>;
  date: NotUndefined<InvoiceProps['date']>;
  items: NotUndefined<InvoiceProps['items']>;
};
