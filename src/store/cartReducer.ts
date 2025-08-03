// import { CartItem } from '@/types/cart';

// export type CartAction =
//   | { type: 'SET_ITEMS'; payload: CartItem[] }
//   | { type: 'TOGGLE_SELECT_ALL'; checked: boolean }
//   | { type: 'TOGGLE_SELECT'; id: number; checked: boolean }
//   | { type: 'REMOVE_ITEM'; id: number }
//   | { type: 'REMOVE_SELECTED' }
//   | { type: 'UPDATE_QUANTITY'; id: number; quantity: number };

// export interface CartState {
//   items: CartItem[];
// }

// export function cartReducer(state: CartState, action: CartAction): CartState {
//   switch (action.type) {
//     case 'SET_ITEMS':
//       return { items: action.payload };
//     case 'TOGGLE_SELECT_ALL':
//       return {
//         items: state.items.map(item => ({
//           ...item,
//           isChecked: action.checked,
//         })),
//       };
//     case 'TOGGLE_SELECT':
//       return {
//         items: state.items.map(item =>
//           item.product._id === action.id
//             ? { ...item, isChecked: action.checked }
//             : item,
//         ),
//       };
//     case 'REMOVE_ITEM':
//       return {
//         items: state.items.filter(item => item._id !== action.id),
//       };
//     case 'REMOVE_SELECTED':
//       return {
//         items: state.items.filter(item => !item.isChecked),
//       };
//     case 'UPDATE_QUANTITY':
//       return {
//         items: state.items.map(item =>
//           item.product._id === action.id
//             ? { ...item, quantity: action.quantity }
//             : item,
//         ),
//       };
//     default:
//       return state;
//   }
// }
