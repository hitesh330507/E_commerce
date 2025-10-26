import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

interface Cart {
  id: number;
  items: CartItem[];
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
    if (!token) throw new Error("NO_TOKEN");
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return fetch(input, { ...init, headers });
  };

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch('http://localhost:8080/cart');
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to load cart');
      const data: Cart = await res.json();
      setCart(data);
    } catch (e: any) {
      if (e.message === 'NO_TOKEN') {
        navigate('/login');
        return;
      }
      setError(e.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadCart();
  }, []);

  const updateQty = async (itemId: number, qty: number) => {
    try {
      const res = await authFetch(`http://localhost:8080/cart/item/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ qty })
      });
      if (res.ok) loadCart();
    } catch {}
  };

  const removeItem = async (itemId: number) => {
    try {
      const res = await authFetch(`http://localhost:8080/cart/item/${itemId}`, { method: 'DELETE' });
      if (res.ok) loadCart();
    } catch {}
  };

  const clearCart = async () => {
    try {
      const res = await authFetch('http://localhost:8080/cart/clear', { method: 'DELETE' });
      if (res.ok) loadCart();
    } catch {}
  };

  if (loading) return <div style={{ padding: 24 }}>Loading cart...</div>;
  if (error) return <div style={{ padding: 24, color: '#b00020' }}>{error}</div>;
  if (!cart) return null;

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: 16 }}>
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.items.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #eee', padding: '12px 0' }}>
              {item.thumbnail && (
                <img src={item.thumbnail} alt={item.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div>${item.price.toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ marginLeft: 12 }}>Remove</button>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
            <button onClick={clearCart}>Clear Cart</button>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Total: ${total.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
