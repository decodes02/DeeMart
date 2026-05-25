import { useMemo, useReducer } from 'react';
import { CartContext } from './cartContext.js';

const STORAGE_KEY = 'deemart-cart';

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

const writeCart = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const cartReducer = (state, action) => {
  let nextState = state;

  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.product;
      const stockLimit = Number(product.quantity) || 0;
      const existingItem = state.find((item) => item.id === product.id);
      if (existingItem) {
        nextState = state.map((item) =>
          item.id === product.id ? { ...item, cartQuantity: Math.min(stockLimit, item.cartQuantity + 1) } : item,
        );
      } else {
        nextState = [...state, { ...product, cartQuantity: 1 }];
      }
      break;
    }
    case 'REMOVE_ITEM':
      nextState = state.filter((item) => item.id !== action.id);
      break;
    case 'UPDATE_QUANTITY':
      nextState = state
        .map((item) => {
          if (item.id !== action.id) {
            return item;
          }

          const stockLimit = Number(item.quantity) || 0;
          return { ...item, cartQuantity: Math.min(stockLimit, Math.max(1, action.quantity)) };
        })
        .filter((item) => item.cartQuantity > 0);
      break;
    case 'CLEAR_CART':
      nextState = [];
      break;
    default:
      nextState = state;
  }

  writeCart(nextState);
  return nextState;
};

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, readCart);

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.cartQuantity, 0);
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.cartQuantity, 0);
    const getItemQuantity = (id) => items.find((item) => item.id === id)?.cartQuantity ?? 0;

    return {
      items,
      totalItems,
      subtotal,
      getItemQuantity,
      addToCart: (product) => {
        const stockLimit = Number(product.quantity) || 0;
        if (!product.available || stockLimit <= 0 || getItemQuantity(product.id) >= stockLimit) {
          return false;
        }

        dispatch({ type: 'ADD_ITEM', product });
        return true;
      },
      removeFromCart: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
      updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
