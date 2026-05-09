import { useState, useCallback, useMemo } from 'react';

export function useCart() {
  const [items, setItems] = useState([]);
  const [discountType, setDiscountType] = useState('none'); // none, senior, pwd, suki
  const [customDiscount, setCustomDiscount] = useState(0);

  const addItem = useCallback((product) => {
    if (product.stock <= 0) return false;
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    return true;
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.id !== productId));
  }, []);

  const updateQty = useCallback((productId, delta, currentStock) => {
    setItems(prev => {
      return prev.map(i => {
        if (i.id !== productId) return i;
        const newQty = i.qty + delta;
        if (newQty > currentStock) return i; // Limit by stock
        return newQty <= 0 ? null : { ...i, qty: newQty };
      }).filter(Boolean);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscountType('none');
    setCustomDiscount(0);
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    
    let discountAmount = 0;
    if (discountType === 'senior' || discountType === 'pwd') {
      // 20% discount on VAT-exempt sales
      // In Ph, Senior/PWD are VAT exempt (12%) + 20% discount
      // For simplicity here, we'll just apply 20% to total
      discountAmount = subtotal * 0.20;
    } else if (discountType === 'suki') {
      discountAmount = customDiscount;
    }

    const netAmount = subtotal - discountAmount;
    const tax = Math.round(netAmount * 0.12);
    const total = netAmount + tax;
    const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

    return { subtotal, discountAmount, netAmount, tax, total, totalItems };
  }, [items, discountType, customDiscount]);

  return { 
    items, addItem, removeItem, updateQty, clearCart, 
    discountType, setDiscountType, customDiscount, setCustomDiscount,
    ...totals 
  };
}
