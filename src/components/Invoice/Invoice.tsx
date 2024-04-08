'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

import { debounce } from '@/utils/debounce';
import { uuid } from '@/utils/uuid';

import { ActionButton } from '../ActionButton';
import type { Currency } from '../CurrencySelect';

import type { PartialLineItemModel } from './LineItem/types';
import { MemoHeader } from './Header';
import { LineItem } from './LineItem';
import type {
  InvoiceProps,
  InvoiceProps as Props,
  InvoiceState as State,
} from './types';
import { calculateLineTotals, updateLineItems } from './utils';

import { convertCurrencies } from '@/actions/convertCurrency';
import { MIN_PRINTABLE_AMOUNT, TODAY } from '@/constants';

export const Invoice = ({ id, onTotalChange }: InvoiceProps) => {
  console.log('Invoice rendered', id);
  const [baseCurrency, setBaseCurrency] = useState<State['currency']>({
    code: 'NZD',
    name: 'New Zealand Dollar',
  });
  const [invoiceDate, setInvoiceDate] = useState<State['date']>(TODAY);
  const [lineItems, setLineItems] = useState<State['items']>([]);
  const [total, setTotal] = useState<number>(0);

  const onBaseCurrencyChange = useCallback((currency: Currency) => {
    setBaseCurrency(currency);
  }, []);

  const onSetInvoiceDate = useCallback((newDate: Props['date'] | null) => {
    if (!newDate) return;
    setInvoiceDate(newDate);
  }, []);

  const onAddLineItem = useCallback(() => {
    setLineItems(prevItems => {
      return [
        ...prevItems,
        {
          amount: '',
          currency: {
            code: '',
            name: '',
          },
          description: '',
          error: '',
          id: uuid(),
        },
      ];
    });
  }, [setLineItems]);

  const updateTotal = useCallback(async () => {
    const lineTotals = calculateLineTotals(lineItems);
    const total = await convertCurrencies(lineTotals, {
      date: invoiceDate,
      to: baseCurrency.code,
    });
    setTotal(total);
    onTotalChange(id, {
      currency: baseCurrency,
      date: invoiceDate,
      lineItems,
      lineTotals,
      total,
    });
  }, [baseCurrency, id, invoiceDate, lineItems, onTotalChange]);

  const handleRemoveLineItem = useCallback((id: string) => {
    setLineItems(prevItems => {
      return prevItems.filter(item => item.id !== id);
    });
  }, []);

  const isValid = useMemo(
    () =>
      lineItems.length > 0 &&
      baseCurrency &&
      lineItems.every(
        item =>
          item.error === '' &&
          item.description &&
          item.amount !== MIN_PRINTABLE_AMOUNT &&
          item.currency.code,
      ),
    [lineItems, baseCurrency],
  );

  const debouncedUpdateTotal = useMemo(
    () => debounce(updateTotal, 200),
    [updateTotal],
  );

  const handleLineItemUpdate = useCallback(
    (updateValue: PartialLineItemModel) => {
      setLineItems(previous => {
        return updateLineItems(previous, updateValue);
      });
    },
    [],
  );

  useEffect(() => {
    if (isValid || lineItems.length === 0) {
      debouncedUpdateTotal();
    }
  }, [
    debouncedUpdateTotal,
    lineItems.length,
    baseCurrency,
    invoiceDate,
    isValid,
  ]);

  return (
    <Box
      sx={{
        border: '1px solid black',
        marginBottom: 2,
        width: '100%',
      }}
    >
      <Container sx={{ pt: 4 }}>
        <MemoHeader
          baseCurrency={baseCurrency}
          id={id}
          invoiceDate={invoiceDate}
          onCurrencyChange={onBaseCurrencyChange}
          onSetInvoiceDate={onSetInvoiceDate}
          total={total}
        />
        {lineItems.length ? (
          <Typography sx={{ marginBottom: 1, marginTop: 1 }} variant="body1">
            Line items
          </Typography>
        ) : null}
        {lineItems?.map((item, index) => {
          return (
            <LineItem
              key={item.id}
              amount={item.amount}
              currency={item.currency}
              description={item.description}
              error={item.error}
              id={item.id}
              onRemove={handleRemoveLineItem}
              onUpdate={handleLineItemUpdate}
              sx={{ mb: index === lineItems.length - 1 ? 0 : 2 }}
            />
          );
        })}
      </Container>
      <ActionButton onClick={onAddLineItem}>Add Line Item</ActionButton>
    </Box>
  );
};
