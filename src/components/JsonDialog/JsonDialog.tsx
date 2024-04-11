import React, { useCallback, useMemo, useRef, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  Input,
} from '@mui/material';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import dayjs from 'dayjs';

import { uuid } from '@/utils/uuid';

import { ActionButton } from '../ActionButton';
import { calculateLineTotals } from '../Invoice/utils';

import {
  type JsonDialogProps,
  type JsonImportExport,
  zodJsonImportExport,
} from './types';

import type { Invoice } from '@/app/Invoice';
import { CURRENCIES } from '@/constants';

export const JsonDialog = ({
  modalOpenType,
  onImport,
  setModalOpenType,
  state,
}: JsonDialogProps) => {
  const [errorText, setErrorText] = useState<string>('');
  const importJsonRef = useRef<HTMLInputElement | null>(null);
  const stateToExportJson: JsonImportExport | null = useMemo(() => {
    const invoices = Object.values(state).filter(Boolean);
    if (invoices.length === 0) return null;
    const invoiceExport: JsonImportExport = { invoices: [] };
    for (const invoice of invoices) {
      if (!invoice) return null;
      invoiceExport.invoices.push({
        currency: invoice.currency.code,
        date: dayjs(invoice.date).format('YYYY-MM-DD'),
        lines: invoice.lines.map(line => ({
          amount: Number(line.amount),
          currency: line.currency.code,
          description: line.description,
        })),
      });
    }
    return invoiceExport;
  }, [state]);

  const isExport = modalOpenType === 'export';

  const exportJSON = useMemo(() => {
    return isExport ? JSON.stringify(stateToExportJson, null, 2) : '';
  }, [isExport, stateToExportJson]);

  const hasError = errorText !== '';

  const handleClose = useCallback(() => {
    if (modalOpenType === 'import') {
      const newState: Record<string, Invoice> = {};
      if (!importJsonRef?.current?.value) {
        setErrorText('No JSON to import');
        return;
      }
      try {
        const parsedData: JsonImportExport = zodJsonImportExport.parse(
          JSON.parse(importJsonRef.current.value),
        );
        parsedData.invoices.forEach(invoice => {
          const id = uuid();
          const code = invoice.currency as keyof typeof CURRENCIES;
          const lines = invoice.lines.map(line => {
            const code = line.currency as keyof typeof CURRENCIES;
            return {
              amount: line.amount.toFixed(4),
              currency: { code, name: CURRENCIES[code] },
              description: line.description,
              error: '',
              id: uuid(),
            };
          });
          newState[id] = {
            currency: {
              code,
              name: CURRENCIES[code],
            },
            date: dayjs(invoice.date),
            id,
            lineTotals: calculateLineTotals(lines),
            lines,
            total: invoice.lines.reduce((acc, line) => acc + line.amount, 0),
          };
        });
        onImport(newState);
        setModalOpenType('close');
      } catch (e) {
        setErrorText('Invalid JSON');
      }
    } else {
      setModalOpenType('close');
    }
  }, [modalOpenType, onImport, setModalOpenType]);

  const handleCancel = useCallback(() => {
    setErrorText('');
    setModalOpenType('close');
  }, [setModalOpenType]);

  return (
    <FocusTrap open={modalOpenType !== 'close'}>
      <Dialog fullWidth onClose={console.log} open={modalOpenType !== 'close'}>
        <DialogTitle>Import / Export</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <Input
              aria-label="Demo input"
              error={hasError}
              fullWidth
              inputRef={importJsonRef}
              maxRows={24}
              minRows={8}
              multiline
              placeholder={
                modalOpenType === 'export' ? 'Export JSON' : 'Import JSON'
              }
              {...(modalOpenType === 'export' ? { value: exportJSON } : {})}
            />
            {hasError ? (
              <FormHelperText error>{errorText}</FormHelperText>
            ) : null}
          </Box>
        </DialogContent>
        <Grid container padding={2} paddingTop={0} spacing={0}>
          {hasError ? (
            <Grid item justifyContent="flex-start" xs={6}>
              <ActionButton onClick={handleCancel} startIcon={<CancelIcon />}>
                Cancel
              </ActionButton>
            </Grid>
          ) : null}
          <Grid item xs={hasError ? 6 : 12}>
            <ActionButton
              disabled={isExport && !exportJSON}
              onClick={handleClose}
              startIcon={<DoneIcon />}
              sx={{ marginLeft: 'auto' }}
            >
              Done
            </ActionButton>
          </Grid>
        </Grid>
      </Dialog>
    </FocusTrap>
  );
};
