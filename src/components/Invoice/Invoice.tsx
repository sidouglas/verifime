'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

import { debounce } from '@/utils/debounce';
import { uuid } from '@/utils/uuid';

import { MemoHeader } from './Header';
import type { PartialLineItemModel } from './LineItem';
import { LineItem } from './LineItem';
import type { Currency, Dayjs, InvoiceProps, LineItemModel } from './types';
import { calculateLineTotals, updateLineItems } from './utils';

import { convertCurrencies } from '@/actions/convertCurrency';
import { ActionButton } from '@/components/ActionButton';
import { DEFAULT_CURRENCY, MIN_PRINTABLE_AMOUNT, TODAY } from '@/constants';

export const Invoice = ({ invoice, onTotalChange }: InvoiceProps) => {
  const id = invoice.id;
  const [baseCurrency, setBaseCurrency] = useState<Currency>(
    invoice?.currency ?? DEFAULT_CURRENCY,
  );
  const [invoiceDate, setInvoiceDate] = useState<Dayjs>(invoice?.date ?? TODAY);
  const [lines, setLines] = useState<LineItemModel[]>(invoice?.lines ?? []);
  const [total, setTotal] = useState<number>(invoice?.total ?? 0);

  const onBaseCurrencyChange = useCallback((currency: Currency) => {
    setBaseCurrency(currency);
  }, []);

  const onSetInvoiceDate = useCallback((newDate: Dayjs | null) => {
    if (!newDate) return;
    setInvoiceDate(newDate);
  }, []);

  const onAddLineItem = useCallback(() => {
    setLines(prevItems => {
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
  }, [setLines]);

  const updateTotal = useCallback(async () => {
    const lineTotals = calculateLineTotals(lines);
    const total = await convertCurrencies(lineTotals, {
      date: invoiceDate,
      to: baseCurrency.code,
    });
    setTotal(total);
    onTotalChange({
      currency: baseCurrency,
      date: invoiceDate,
      id,
      lineTotals,
      lines,
      total,
    });
  }, [baseCurrency, id, invoiceDate, lines, onTotalChange]);

  const handleRemoveLineItem = useCallback((id: string) => {
    setLines(prevItems => {
      return prevItems.filter(item => item.id !== id);
    });
  }, []);

  const isValid = useMemo(
    () =>
      lines.length > 0 &&
      baseCurrency &&
      lines.every(
        item =>
          item.error === '' &&
          item.description &&
          item.amount !== MIN_PRINTABLE_AMOUNT &&
          item.currency.code,
      ),
    [lines, baseCurrency],
  );

  const debouncedUpdateTotal = useMemo(
    () => debounce(updateTotal, 200),
    [updateTotal],
  );

  const handleLineItemUpdate = useCallback(
    (updateValue: PartialLineItemModel) => {
      setLines(previous => {
        return updateLineItems(previous, updateValue);
      });
    },
    [],
  );

  useEffect(() => {
    if (isValid || lines.length === 0) {
      debouncedUpdateTotal();
    }
  }, [debouncedUpdateTotal, lines.length, baseCurrency, invoiceDate, isValid]);

  return (
    <Box
      sx={{
        border: '1px solid black',
        marginBottom: 2,
        width: '100%',
      }}
    >
      <Container sx={{ padding: 4 }}>
        <MemoHeader
          baseCurrency={baseCurrency}
          id={id}
          invoiceDate={invoiceDate}
          onCurrencyChange={onBaseCurrencyChange}
          onSetInvoiceDate={onSetInvoiceDate}
          total={total}
        />
        {lines.length ? (
          <Typography sx={{ marginBottom: 1, marginTop: 1 }} variant="body1">
            Line items
          </Typography>
        ) : null}
        {lines?.map(item => {
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
            />
          );
        })}
        <ActionButton onClick={onAddLineItem} sx={{ marginLeft: 'auto' }}>
          Add Line Item
        </ActionButton>
      </Container>
    </Box>
  );
};
