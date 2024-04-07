import type { SxProps, Theme } from '@mui/material';

import type { Currency } from '@/components/CurrencySelect';

export type LineItemProps = {
  amount: string;
  currency: Currency;
  description: string;
  error?: string;
  id: string;
  onRemove: (id: string) => void;
  onUpdate: (data: PartialLineItemModel) => void;
  sx?: SxProps<Theme>;
};

export type PartialLineItemModel = Partial<LineItemModel> & { id: string };

export type LineItemModel = Pick<
  LineItemProps,
  'amount' | 'currency' | 'description' | 'error' | 'id'
>;

export type InvoiceTotal = {
  amount: number;
  currency: Currency;
};
