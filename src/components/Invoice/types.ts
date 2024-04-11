export type { Currency } from '../CurrencySelect';
export type { LineItemModel } from './LineItem';
export type { Dayjs } from 'dayjs';

import type { Invoice } from '@/app/Invoice';

export type InvoiceProps = {
  invoice: Partial<Invoice> & { id: string };
  onTotalChange: (invoice: Invoice) => void;
};
