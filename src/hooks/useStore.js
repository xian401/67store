import { useState, useEffect, useCallback } from 'react';
import { products as initialProducts } from '../data/products';

const STORAGE_KEY_PRODUCTS = '6seven_inventory';
const STORAGE_KEY_SALES = '6seven_sales';

export function useStore() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SALES);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(sales));
  }, [sales]);

  const recordSale = useCallback((order) => {
    // 1. Record the sale
    setSales(prev => [order, ...prev]);

    // 2. Update inventory
    setProducts(prev => {
      return prev.map(p => {
        const soldItem = order.items.find(item => item.id === p.id);
        if (soldItem) {
          return { ...p, stock: Math.max(0, p.stock - soldItem.qty) };
        }
        return p;
      });
    });
  }, []);

  const resetInventory = useCallback(() => {
    setProducts(initialProducts);
  }, []);

  const clearSales = useCallback(() => {
    setSales([]);
  }, []);

  const updateUtangStatus = useCallback((orderId, status) => {
    setSales(prev => prev.map(s => s.id === orderId ? { ...s, paymentStatus: status } : s));
  }, []);

  const addProduct = useCallback((newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  }, []);

  const deleteProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(p => p.id != productId));
  }, []);

  const deleteAllProducts = useCallback(() => {
    setProducts([]);
  }, []);

  return { 
    products, sales, recordSale, resetInventory, clearSales, 
    updateUtangStatus, addProduct, deleteProduct, deleteAllProducts 
  };
}
