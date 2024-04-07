import { useCallback, useEffect, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

import type { CurrencySelectProps } from './types';

import { type CurrencyData, fetchCurrencies } from '@/actions/fetchCurrencies';

export const CurrencySelect = (props: CurrencySelectProps) => {
  const {
    id,
    hasError = false,
    errorText = '',
    label = 'Base Currency',
    labelId = `${id}-label`,
    value = '',
    onChange,
    ...rest
  } = props;
  const [currencies, setCurrencies] = useState<CurrencyData | null>(null);

  useEffect(() => {
    const fetchCurrenciesData = async () => {
      const currenciesData = await fetchCurrencies();
      setCurrencies(currenciesData);
    };

    fetchCurrenciesData();
  }, []);

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      onChange({
        code: event.target.value as string,
        name: currencies ? currencies[event.target.value as string] : '',
      });
    },
    [currencies, onChange],
  );
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          error={hasError}
          id={id}
          label={label}
          labelId={labelId}
          onChange={handleOnChange}
          value={currencies ? value : ''}
          {...rest}
        >
          {currencies &&
            Object.entries(currencies).map(([code, countryText]) => (
              <MenuItem key={code} value={code}>
                {countryText}
              </MenuItem>
            ))}
        </Select>
        {hasError ? <FormHelperText error>{errorText}</FormHelperText> : null}
      </FormControl>
    </>
  );
};
