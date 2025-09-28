import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShoppingCart, Home, Menu as MenuIcon } from 'lucide-react';

// 主應用組件
const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  return (
    <Router>
      <div className="app flex flex-col min-h-screen bg-gray-100">
        <Header cart={cart} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Menu addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </Router>
  );
};

// 頭部組件
const Header = ({ cart }) => {
  const navigate = useNavigate();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-green-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="p-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">樂檸漢堡</h1>
        <Link to="/cart" className="p-2 relative">
          <ShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

// 底部導航組件
const BottomNav = () => {
  return (
    <nav className="bg-white shadow-lg fixed bottom-0 w-full">
      <div className="flex justify-around">
        <Link to="/" className="flex flex-col items-center p-2 text-green-500">
          <MenuIcon size={24} />
          <span className="text-xs mt-1">菜單</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center p-2 text-green-500">
          <ShoppingCart size={24} />
          <span className="text-xs mt-1">購物車</span>
        </Link>
      </div>
    </nav>
  );
};

// 菜單組件
const Menu = ({ addToCart }) => {
  const categories = [
    { 
      name: '蛋堡', 
      items: [
        { id: 1, name: '薯餅起司蛋堡', price: 95, image: '/api/placeholder/150/150' },
        { id: 2, name: '紅醬起司蛋堡', price: 85, image: '/api/placeholder/150/150' },
      ]
    },
    { 
      name: '飲料', 
      items: [
        { id: 3, name: '青檸鮮果微泡', price: 65, image: '/api/placeholder/150/150' },
        { id: 4, name: '鳳梨鮮果微泡', price: 80, image: '/api/placeholder/150/150' },
      ]
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto pb-16 pt-4"
    >
      {categories.map(category => (
        <div key={category.name} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 px-4">{category.name}</h2>
          <div className="grid grid-cols-2 gap-4 px-4">
            {category.items.map(item => (
              <motion.div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                whileTap={{ scale: 0.95 }}
              >
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-2">${item.price}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    加入購物車
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

// 購物車組件
const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id, change) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto pb-24 pt-4 px-4"
    >
      <h2 className="text-2xl font-bold mb-4">購物車</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-8">你的購物車是空的</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="flex items-center bg-white rounded-lg shadow-md p-4 mb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => updateQuantity(item.id, -1)}
                  className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full"
                >-</button>
                <span className="mx-2">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1)}
                  className="bg-green-500 text-white w-8 h-8 rounded-full"
                >+</button>
              </div>
            </div>
          ))}
          <div className="fixed bottom-16 left-0 right-0 bg-white shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">總計:</h3>
              <span className="text-xl">${total}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300"
            >
              結賬
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

// 結賬組件
const Checkout = ({ cart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto pb-16 pt-4 px-4"
    >
      <h2 className="text-2xl font-bold mb-4">結賬</h2>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-semibold mb-2">訂單摘要</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-b-0">
            <span>{item.name} x {item.quantity}</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold">
          <span>總計：</span>
          <span>${total}</span>
        </div>
      </div>
      <form className="space-y-4">
        <input type="text" placeholder="姓名" required className="w-full p-3 border rounded-lg" />
        <input type="tel" placeholder="電話" required className="w-full p-3 border rounded-lg" />
        <input type="email" placeholder="電子郵件" required className="w-full p-3 border rounded-lg" />
        <textarea placeholder="備註（可選）" className="w-full p-3 border rounded-lg h-24"></textarea>
        <button 
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300"
        >
          確認訂單
        </button>
      </form>
    </motion.div>
  );
};

export default App;