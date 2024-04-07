export type CurrencyInputProps = {
  error?: string;
  errorText?: string;
  hasError?: boolean;
  id: string;
  onAmountUpdate: (id: string, currency: string) => void;
  value?: string;
};
