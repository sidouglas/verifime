import { useCallback } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

import { TextFieldError } from '../TextFieldError';

import type { CurrencySelectProps } from './types';

import { CURRENCIES } from '@/constants';

export const CurrencySelect = (props: CurrencySelectProps) => {
  const {
    id,
    hasError = false,
    errorText = '',
    label = 'Base Currency',
    labelId = `${id}-label`,
    onChange,
    ...rest
  } = props;

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      const code = event.target.value as keyof typeof CURRENCIES;
      onChange({
        code,
        name: CURRENCIES[code],
      });
    },
    [onChange],
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
          {...rest}
        >
          {Object.entries(CURRENCIES).map(([code, countryText]) => (
            <MenuItem key={code} value={code}>
              {countryText}
            </MenuItem>
          ))}
        </Select>
        <TextFieldError error={errorText} />
      </FormControl>
    </>
  );
};
