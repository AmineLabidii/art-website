import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";

export interface CartItem {
  key: string; // unique per product+frame+size
  productId: string;
  slug: string;
  name: string;
  artist: string;
  image: string;
  frameId: string;
  frameName: string;
  sizeId: string;
  sizeLabel: string;
  unitPrice: number; // base + modifiers
  quantity: number;
}

interface CartState {
  items: CartItem[];
  saved: CartItem[]; // saved for later
}

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; key: string }
  | { type: "SET_QTY"; key: string; quantity: number }
  | { type: "SAVE_LATER"; key: string }
  | { type: "MOVE_TO_CART"; key: string }
  | { type: "REMOVE_SAVED"; key: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

const STORAGE_KEY = "atelier-cart-v1";

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "ADD": {
      const existing = state.items.find((i) => i.key === action.item.key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === action.item.key
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.key !== action.key) };
    case "SET_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.key
            ? { ...i, quantity: Math.max(1, action.quantity) }
            : i
        ),
      };
    case "SAVE_LATER": {
      const item = state.items.find((i) => i.key === action.key);
      if (!item) return state;
      return {
        items: state.items.filter((i) => i.key !== action.key),
        saved: [...state.saved.filter((i) => i.key !== action.key), item],
      };
    }
    case "MOVE_TO_CART": {
      const item = state.saved.find((i) => i.key === action.key);
      if (!item) return state;
      return {
        saved: state.saved.filter((i) => i.key !== action.key),
        items: [...state.items.filter((i) => i.key !== action.key), item],
      };
    }
    case "REMOVE_SAVED":
      return { ...state, saved: state.saved.filter((i) => i.key !== action.key) };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  saveForLater: (key: string) => void;
  moveToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const initial: CartState = { items: [], saved: [] };

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  // drawer open handled via a tiny separate reducer-less state
  const openRef = useReducer(
    (o: boolean, next: boolean) => next,
    false
  );
  const [isOpen, setOpen] = openRef;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const count = useMemo(
    () => state.items.reduce((n, i) => n + i.quantity, 0),
    [state.items]
  );
  const subtotal = useMemo(
    () => state.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [state.items]
  );

  const value: CartContextValue = {
    ...state,
    count,
    subtotal,
    isOpen,
    setOpen,
    addItem: (item) => {
      dispatch({ type: "ADD", item });
      setOpen(true);
    },
    removeItem: (key) => dispatch({ type: "REMOVE", key }),
    setQuantity: (key, quantity) => dispatch({ type: "SET_QTY", key, quantity }),
    saveForLater: (key) => dispatch({ type: "SAVE_LATER", key }),
    moveToCart: (key) => dispatch({ type: "MOVE_TO_CART", key }),
    removeSaved: (key) => dispatch({ type: "REMOVE_SAVED", key }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
