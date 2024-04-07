import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { TotalsBoxProps } from './types';

export const TotalsBox = ({ invoiceTotals, lineTotals }: TotalsBoxProps) => {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Box
        border="1px solid black"
        marginBottom="1rem"
        marginTop="1rem"
        padding="1rem"
      >
        <TableContainer>
          <Typography gutterBottom variant="h6">
            Invoice Totals
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row">
                  Currency
                </TableCell>
                <TableCell component="th" scope="row">
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoiceTotals?.map((total, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{total.currency.name}</TableCell>
                    <TableCell>{total.amount.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box border="1px solid black" padding="1rem">
        <TableContainer>
          <Typography gutterBottom variant="h6">
            Invoice Line Totals
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row">
                  Currency
                </TableCell>
                <TableCell component="th" scope="row">
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineTotals?.map(total => {
                return (
                  <TableRow key={total.currency.code}>
                    <TableCell>{total.currency.name}</TableCell>
                    <TableCell>{total.amount.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
