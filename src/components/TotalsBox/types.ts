import type { InvoiceTotal } from '../Invoice/LineItem';

export type TotalsBoxProps = {
  invoiceTotals: InvoiceTotal[];
  lineTotals: InvoiceTotal[];
};
