import React, { type FocusEvent, useCallback, useMemo, useState } from 'react';
import { FormControl, FormHelperText, TextField } from '@mui/material';

import type { CurrencyInputProps } from './types';

import { MIN_PRINTABLE_AMOUNT } from '@/constants';

const { abs, ceil } = Math;

export const CurrencyInput = ({
  errorText = '',
  hasError = false,
  id,
  onAmountUpdate,
  value = '',
}: CurrencyInputProps) => {
  const [hasInternalError, setInternalError] = useState(false);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      // get around locale issues with commas
      let value: number | string = event.target.value.replace(',', '.');
      // round the value to 2 decimal places and ensure its unsigned
      value = Number(value)
        ? (ceil(abs(Number(value)) * 100) / 100).toFixed(2)
        : MIN_PRINTABLE_AMOUNT;
      setInternalError(value === MIN_PRINTABLE_AMOUNT);
      onAmountUpdate(id, value);
    },
    [id, onAmountUpdate],
  );

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
        onBlur={handleBlur}
        onChange={event => {
          // allow everything through, validate it on blur - fiddly to validate
          // while user is typing.
          onAmountUpdate(id, event.target.value);
        }}
        value={value}
      />
      {hasError || hasInternalError ? (
        <FormHelperText error>{errorText || internalErrorText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};
