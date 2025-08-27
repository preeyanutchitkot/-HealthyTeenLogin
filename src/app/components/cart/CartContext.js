'use client';
import { createContext, useContext, useMemo, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action;
      const name = item.name ?? 'unknown';
      const cal = Number(item.calories ?? 0);
      const qty = Number(item.qty ?? 1);
      const key = `${name}|${cal}`;
      const existing = state.items[key];
      const newQty = (existing?.qty ?? 0) + qty;
      const newItems = {
        ...state.items,
        [key]: { ...item, name, calories: cal, qty: newQty }
      };
      console.log('[CartContext] ADD_ITEM:', { key, newQty, all: newItems });
      return { ...state, items: newItems };
    }
    case 'REMOVE_ITEM': {
      const newItems = { ...state.items };
      delete newItems[action.key];
      return { ...state, items: newItems };
    }
    case 'CLEAR':
      return { items: {} };
    case 'HYDRATE':
      return action.state ?? state;
    default:
      return state;
  }
}

const initialState = { items: {} };

export function CartProvider({ children, persist = true, storageKey = 'ht_cart_v1' }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (!persist) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) dispatch({ type: 'HYDRATE', state: JSON.parse(raw) });
    } catch {}
  }, []);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [state, persist, storageKey]);

  const value = useMemo(() => {
    const list = Object.values(state.items);
    const count = list.reduce((sum, it) => sum + (it.qty ?? 0), 0);
    return {
      items: list,
      count,
      addItem: (item) => {
        console.log('[CartContext] addItem', item);
        dispatch({ type: 'ADD_ITEM', item });
      },
      removeItemByKey: (key) => dispatch({ type: 'REMOVE_ITEM', key }),
      clear: () => dispatch({ type: 'CLEAR' })
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
