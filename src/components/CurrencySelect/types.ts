import type { SelectProps } from '@mui/material';

export type Currency = {
  code: string;
  name: string;
};

export type CurrencySelectProps = Omit<SelectProps, 'onChange'> & {
  errorText?: string;
  hasError?: boolean;
  id: string;
  onChange: (data: Currency) => void;
};
