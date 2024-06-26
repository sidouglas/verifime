import type { Currency } from '../CurrencySelect';

import type { InvoiceTotal, PartialLineItemModel } from './LineItem/types';
import type { LineItemModel } from './LineItem';

export const updateLineItems = (
  items: LineItemModel[],
  partialLineItem: PartialLineItemModel,
): LineItemModel[] => {
  const newItem = {
    ...findItemById(partialLineItem.id, items),
    ...partialLineItem,
  } as LineItemModel | undefined;
  if (!newItem) return items;
  const isLineItemUnique = checkLineItemModelUnique();
  const hasDuplicate = isLineItemUnique(newItem);
  newItem.error = hasDuplicate ? 'Line item must be unique' : '';

  // now update the model with the new item
  return items.map(item => {
    if (item.id === newItem.id) {
      return newItem;
    }
    if (!hasDuplicate) {
      item.error = '';
    }
    return item;
  });
};

const findItemById = (id: string, items: LineItemModel[]) =>
  items.find(item => item.id === id);

export const calculateLineTotals = (items: LineItemModel[]): InvoiceTotal[] => {
  return items
    .reduce(
      (
        totalAmounts: { amount: number; currency: Currency }[],
        item: LineItemModel,
      ) => {
        const { amount, currency } = item;
        const existingItem = totalAmounts.find(
          item => item.currency.code === currency.code,
        );
        if (existingItem) {
          existingItem.amount += Number(amount);
        } else {
          totalAmounts.push({ amount: Number(amount), currency });
        }
        return totalAmounts;
      },
      [],
    )
    .map(item => ({
      amount: Number(item.amount.toFixed(4)),
      currency: item.currency,
    }));
};

const checkLineItemModelUnique = () => {
  const set = new Set();

  return function isLineItemUnique(lineItem: LineItemModel) {
    const serializedLineItem = JSON.stringify(lineItem);
    if (set.has(serializedLineItem)) {
      return true;
    }
    set.add(serializedLineItem);
    return false;
  };
};
