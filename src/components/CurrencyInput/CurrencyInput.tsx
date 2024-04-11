import React, { useCallback, useMemo, useState } from 'react';
import { FormControl, TextField } from '@mui/material';

import { roundNumber } from '@/utils/uuid';

import { TextFieldError } from '../TextFieldError';

import type { CurrencyInputProps } from './types';

import { MIN_PRINTABLE_AMOUNT } from '@/constants';
import { useDebounce } from '@/hooks/useDebounce';

export const CurrencyInput = ({
  errorText = '',
  hasError = false,
  id,
  onAmountUpdate,
  value = '',
}: CurrencyInputProps) => {
  const [hasInternalError, setInternalError] = useState(false);
  const [currency, setCurrency] = useState<string>(value);

  const debouncedAmountUpdate = useDebounce(() => validate(), 1000);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrency(event.target.value);
      debouncedAmountUpdate();
    },
    [debouncedAmountUpdate],
  );

  const validate = useCallback(() => {
    const value = roundNumber(currency, 2);
    const formattedValue = value ? value.toFixed(2) : MIN_PRINTABLE_AMOUNT;
    setInternalError(formattedValue === MIN_PRINTABLE_AMOUNT);
    setCurrency(formattedValue);
    onAmountUpdate(id, formattedValue);
  }, [currency, id, onAmountUpdate]);

  const internalErrorText = useMemo(
    () => (hasInternalError ? 'Amount must be greater than 0' : ''),
    [hasInternalError],
  );

  return (
    <FormControl fullWidth>
      <TextField
        error={hasError || hasInternalError}
        id={`amount-${id}`}
        label="Amount"
        onChange={handleChange}
        value={currency}
      />
      <TextFieldError error={errorText || internalErrorText} />
    </FormControl>
  );
};
