export const calcSum = (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);
