import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, ChevronDown, X } from 'lucide-react';

const IMAGE_PATH = "https://filedn.eu/lE2WQb0mJLWm2j9bgAiUXBf/pic/";

const categories = ['主食', '小吃', '飲料', '甜點', '鍋物'];
const menuItems = [
  { id: 1, name: '韓式泡菜鍋', price: 170, category: '鍋物', description: '小辣', image: `${IMAGE_PATH}5.JPG` },
  { id: 2, name: '滷肉飯', price: 60, category: '主食', description: '香濃入味', image: `${IMAGE_PATH}6.JPG` },
  { id: 3, name: '蔥油餅', price: 35, category: '小吃', description: '外酥內軟', image: `${IMAGE_PATH}7.JPG` },
  { id: 4, name: '珍珠奶茶', price: 50, category: '飲料', description: '香濃滑順', image: `${IMAGE_PATH}8.JPG` },
  { id: 5, name: '芒果冰', price: 80, category: '甜點', description: '清涼爽口', image: `${IMAGE_PATH}9.JPG` },
];

const FoodOrderApp = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null); // 用於儲存被選擇的菜品
  const [meatOption, setMeatOption] = useState('豬肉'); // 用於儲存肉品選擇
  const [extraMeat, setExtraMeat] = useState(false); // 用於儲存加量選擇
  const [notes, setNotes] = useState(''); // 用於儲存備註
  const [quantity, setQuantity] = useState(1); // 用於儲存數量
  const [showDishDetails, setShowDishDetails] = useState(false);

  const categoryRefs = useRef(categories.map(() => React.createRef()));
  const menuRef = useRef(null);

  const scrollToCategory = (category) => {
    const index = categories.indexOf(category);
    if (index !== -1 && categoryRefs.current[index].current) {
      const categoryElement = categoryRefs.current[index].current;
      const menuElement = menuRef.current;
      const headerOffset = 80; // 調整這個值以匹配您的頁頭高度
      const elementPosition = categoryElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToCategory(selectedCategory);
  }, [selectedCategory]);

  const closeCart = () => {
    setShowCart(false);
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id && cartItem.meatOption === item.meatOption && cartItem.extraMeat === item.extraMeat && cartItem.notes === item.notes);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item }]);
    }
    setSelectedDish(null); // 關閉彈出視窗
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleDishClick = (dish) => {
    setSelectedDish(dish);
    setMeatOption('豬肉'); // 重置肉品選擇
    setExtraMeat(false); // 重置加量選擇
    setNotes(''); // 重置備註
    setQuantity(1); // 重置數量
    setShowDishDetails(true);
  };

  const handleAddToCart = () => {
    if (selectedDish) {
      const finalPrice = selectedDish.price + (meatOption !== '豬肉' ? 10 : 0) + (extraMeat ? 30 : 0);
      const item = {
        ...selectedDish,
        price: finalPrice,
        meatOption,
        extraMeat,
        notes,
        quantity,
      };
      addToCart(item);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change;
      return newQuantity < 1 ? 1 : newQuantity; // 確保數量至少為 1
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <header className="flex justify-between items-center mb-8 sticky top-0 bg-white z-20 py-4">
        <h1 className="text-2xl font-bold">鷗一喜餐飲</h1>
        <div className="flex items-center">
          <span className="mr-4">桌號: 17</span>
          <button 
            className="relative p-2 rounded-full bg-yellow-400 hover:bg-yellow-500"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="mb-6 flex space-x-4 overflow-x-auto py-2 sticky top-20 bg-white z-10">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category ? 'bg-yellow-400 text-gray-800' : 'bg-gray-200 text-gray-600'
            } whitespace-nowrap`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-8" ref={menuRef}>
        {categories.map((category, categoryIndex) => (
          <div key={category} ref={categoryRefs.current[categoryIndex]}>
            <h2 className="text-xl font-bold mb-4 sticky top-36 bg-white z-5 py-2">{category}</h2>
            <div className="space-y-4">
              {menuItems.filter(item => item.category === category).map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => handleDishClick(item)} // 當點擊菜品時，顯示子視窗
                >
                  <div className="flex items-center flex-grow">
                    <span className="text-gray-500 mr-2">{index + 1}.</span>
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-yellow-500 font-bold mr-4">${item.price}</p>
                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDish && (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg transition-transform duration-300 transform translate-y-0 z-50 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{selectedDish.name}</h2>
            <button onClick={() => setShowDishDetails(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-48 object-cover mb-4 rounded-md" />
          <p className="text-gray-600 mb-4">{selectedDish.description}</p>
          <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">肉品選擇</h3>
            <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="豬肉"
                    checked={meatOption === '豬肉'}
                    onChange={(e) => setMeatOption(e.target.value)}
                    className="mr-2"
                  />
                  豬肉
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="牛肉"
                    checked={meatOption === '牛肉'}
                    onChange={(e) => setMeatOption(e.target.value)}
                    className="mr-2"
                  />
                  牛肉 +$10
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="羊肉"
                    checked={meatOption === '羊肉'}
                    onChange={(e) => setMeatOption(e.target.value)}
                    className="mr-2"
                  />
                  羊肉 +$10
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={extraMeat}
                  onChange={(e) => setExtraMeat(e.target.checked)}
                  className="mr-2"
                />
                加量 +$30
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-md font-semibold mb-2">數量</label>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                >
                  -
                </button>
                <span className="w-12 text-center border-t border-b py-2">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-md font-semibold mb-2">備註</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="請輸入備註"
                className="w-full border rounded-md px-4 py-2"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-md"
            >
              加入購物車 ${selectedDish.price + (meatOption !== '豬肉' ? 10 : 0) + (extraMeat ? 30 : 0)} x {quantity}
            </button>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="w-96 bg-white h-full p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">購物車</h2>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.meatOption} {item.extraMeat && '(加量)'} {item.notes && `- 備註: ${item.notes}`}
                    </p>
                    <p className="text-yellow-500 font-bold">${item.price} x {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    刪除
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200 ">
              <h3 className="text-xl font-bold">總價: ${totalPrice}</h3>
              <button className="my-8 px-8 bg-yellow-500 " onClick={closeCart}>關閉</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodOrderApp;
