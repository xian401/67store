import { useState, useCallback, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import Receipt from './components/Receipt';
import Dashboard from './components/Dashboard';
import HistorySidebar from './components/HistorySidebar';
import LoadingScreen from './components/LoadingScreen';
import ConfirmModal from './components/ConfirmModal';
import AboutModal from './components/AboutModal';
import { categories } from './data/products';
import { useCart } from './hooks/useCart';
import { useStore } from './hooks/useStore';
import { FiShoppingCart, FiBarChart2 } from 'react-icons/fi';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('store'); // store or dashboard
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [receiptData, setReceiptData] = useState(null);
  const [toast, setToast] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const [confirmData, setConfirmData] = useState(null); // { message, onConfirm, type }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const { 
    products, sales, recordSale, resetInventory, clearSales, 
    updateUtangStatus, addProduct, deleteProduct, deleteAllProducts 
  } = useStore();
  const cart = useCart();

  const filtered = products
    .map(p => {
      const inCart = cart.items.find(item => item.id === p.id);
      const displayStock = p.stock - (inCart ? inCart.qty : 0);
      return { ...p, stock: displayStock };
    })
    .filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

  const handleAdd = useCallback((product) => {
    if (product.stock <= 0) {
      setToast({ text: `Out of stock: ${product.name}`, key: Date.now() });
      return;
    }
    const success = cart.addItem(product);
    if (success) {
      setToast({ text: `${product.emoji} ${product.name} added`, key: Date.now() });
    }
  }, [cart]);

  const handleCheckout = useCallback(({ customerName, paymentMethod }) => {
    const num = `RSB-${Date.now().toString(36).toUpperCase()}`;
    const date = new Date().toLocaleString('en-PH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const order = {
      id: Date.now(),
      orderNumber: num,
      date: date,
      items: [...cart.items],
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      discountType: cart.discountType,
      tax: cart.tax,
      total: cart.total,
      customerName,
      paymentMethod,
      paymentStatus: paymentMethod === 'utang' ? 'unpaid' : 'paid'
    };

    recordSale(order);
    setOrderNumber(num);
    setOrderDate(date);
    setReceiptData(order);
    setCartOpen(false);
    setShowReceipt(true);
  }, [cart, recordSale]);

  const handleNewOrder = useCallback(() => {
    cart.clearCart();
    setShowReceipt(false);
    setReceiptData(null);
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="kiosk-app">
      {isLoading && <LoadingScreen />}
      
      <ConfirmModal 
        isOpen={!!confirmData}
        message={confirmData?.message}
        onConfirm={() => {
          confirmData.onConfirm();
          setConfirmData(null);
        }}
        onCancel={() => setConfirmData(null)}
        type={confirmData?.type}
      />

      <AboutModal 
        isOpen={aboutOpen} 
        onClose={() => setAboutOpen(false)} 
      />

      {toast && <div className="toast" key={toast.key}>{toast.text}</div>}

      {view === 'dashboard' ? (
        <Dashboard 
          sales={sales} 
          products={products} 
          onBack={() => setView('store')}
          onUpdateUtang={updateUtangStatus}
          onClearSales={() => setConfirmData({
            message: "This will permanently delete ALL recorded sales and transaction history. This action cannot be undone.",
            onConfirm: clearSales,
            type: 'danger'
          })}
          onResetInventory={() => setConfirmData({
            message: "This will reset all product stocks to their default values. Are you sure you want to proceed?",
            onConfirm: resetInventory,
            type: 'warning'
          })}
          onAddProduct={addProduct}
          onDeleteProduct={(id) => {
            if (id === 'all') {
              setConfirmData({
                message: "Are you sure you want to delete ALL products? This will completely clear your store menu.",
                onConfirm: () => deleteAllProducts(),
                type: 'danger'
              });
            } else {
              setConfirmData({
                message: "Are you sure you want to delete this product? This will remove it from the store menu.",
                onConfirm: () => deleteProduct(id),
                type: 'danger'
              });
            }
          }}
        />
      ) : (
        <>
          <Header 
            totalItems={cart.totalItems} 
            onCartClick={() => {
              setCartOpen(true);
              setHistoryOpen(false);
            }} 
            onHistoryClick={() => {
              setHistoryOpen(true);
              setCartOpen(false);
            }}
            onAboutClick={() => setAboutOpen(true)}
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />

          <main className="kiosk-main">
            <div className="menu-header">
              <h2 className="menu-title">Menu</h2>
              <div className="menu-actions">
                <button className="dash-toggle-btn" onClick={() => setView('dashboard')}>
                  <FiBarChart2 /> Dashboard
                </button>
                <span className="menu-count">{filtered.length} items</span>
              </div>
            </div>

            <CategoryBar categories={categories} active={activeCategory} onSelect={setActiveCategory} />

            {filtered.length > 0 ? (
              <ProductGrid products={filtered} onAdd={handleAdd} />
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>No items found</p>
              </div>
            )}
          </main>

          {cart.totalItems > 0 && (
            <div className="floating-cart">
              <button className="floating-cart-btn" onClick={() => setCartOpen(true)}>
                <div className="floating-cart-info">
                  <span className="floating-cart-count">{cart.totalItems}</span>
                  <span className="floating-cart-total">₱{cart.total.toFixed(2)}</span>
                </div>
                <span>View Cart & Checkout</span>
              </button>
            </div>
          )}

          <CartPanel
            items={cart.items}
            subtotal={cart.subtotal}
            discountAmount={cart.discountAmount}
            discountType={cart.discountType}
            setDiscountType={cart.setDiscountType}
            customDiscount={cart.customDiscount}
            setCustomDiscount={cart.setCustomDiscount}
            tax={cart.tax}
            total={cart.total}
            updateQty={cart.updateQty}
            removeItem={cart.removeItem}
            clearCart={cart.clearCart}
            onCheckout={(data) => setConfirmData({
              message: `Confirm transaction for ₱${cart.total.toFixed(2)}? This will record the sale and update inventory.`,
              onConfirm: () => handleCheckout(data),
              type: 'warning'
            })}
            open={cartOpen}
            onClose={() => setCartOpen(false)}
          />

          <HistorySidebar
            sales={sales}
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
            onViewReceipt={(sale) => {
              setReceiptData(sale);
              setOrderNumber(sale.orderNumber);
              setOrderDate(sale.date);
              setShowReceipt(true);
            }}
          />

          {showReceipt && receiptData && (
            <Receipt
              items={receiptData.items}
              subtotal={receiptData.subtotal}
              discountAmount={receiptData.discountAmount}
              tax={receiptData.tax}
              total={receiptData.total}
              customerName={receiptData.customerName}
              paymentMethod={receiptData.paymentMethod}
              orderNumber={orderNumber}
              date={orderDate}
              onClose={() => setShowReceipt(false)}
              onNewOrder={handleNewOrder}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
