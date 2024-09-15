import React, { useState, useEffect, useRef } from 'react';
import {  useMutation, useQuery, gql } from '@apollo/client';
import { Loader2, ChevronLeft, ChevronRight, X, ShoppingCart } from 'lucide-react';
import CheckoutModal from './CheckoutModal';  

const PCLOUD_IMAGE_PATH = process.env.REACT_APP_PCLOUD_IMAGE_PATH;

// GraphQL 查詢（保持不變）
const GET_RESTAURANT_DATA = gql`
  query GetRestaurantData($restaurantId: Int!) {
    restaurants_by_pk(id: $restaurantId) {
      id
      name
    }
    categories(where: {restaurant_id: {_eq: $restaurantId}}) {
      id
      name
    }
    dishes(where: {restaurant_id: {_eq: $restaurantId}, is_available: {_eq: true}}) {
      id
      name
      description
      price
      image_url
      category_id
    }
    dish_options {
      id
      name
      type
      dish_id
    }
    dish_option_items {
      id
      name
      price
      dish_option_id
    }
    tables(where: {restaurant_id: {_eq: $restaurantId}}) {
      id
      table_number
      status
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($table_id: Int!, $status: String!, $total_amount: numeric!) {
    insert_orders_one(object: {
      table_id: $table_id,
      status: $status,
      total_amount: $total_amount
    }) {
      id
      table_id
      status
      total_amount
      created_at
    }
  }
`;


const CREATE_ORDER_ITEMS_MUTATION = gql`
  mutation CreateOrderItems($order_items: [order_items_insert_input!]!) {
    insert_order_items(objects: $order_items) {
      affected_rows
      returning {
        id
        order_id
        dish_id
        quantity
        unit_price
        subtotal
        dish_items_text
      }
    }
  }
`;

const RestaurantOrderApp = ({ restaurantId }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [note, setNote] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  
  const categoriesRef = useRef(null);

  const { loading, error, data } = useQuery(GET_RESTAURANT_DATA, {
    variables: { restaurantId },
  });

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);
  const [createOrderItems] = useMutation(CREATE_ORDER_ITEMS_MUTATION);
  
  const handleCheckout = async (paymentMethod) => {
    if (cart.length === 0 || !selectedTable) {
      alert('購物車為空或未選擇桌號');
      return;
    }
  
    const totalAmount = getTotalPrice();
  
    try {
      // 首先創建訂單
      const { data: orderData } = await createOrder({
        variables: {
          table_id: selectedTable,
          status: 'pending',
          total_amount: totalAmount
        }
      });
  
      if (orderData && orderData.insert_orders_one) {
        const orderId = orderData.insert_orders_one.id;
  
        // 然後創建訂單項目
        const orderItems = cart.map(item => ({
          order_id: orderId,
          dish_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
          dish_items_text: JSON.stringify({
            options: item.options,
            note: item.note
          })
        }));
  
        const { data: orderItemsData } = await createOrderItems({
          variables: {
            order_items: orderItems
          }
        });
  
        if (orderItemsData && orderItemsData.insert_order_items) {
          alert('訂單已成功提交！訂單編號：' + orderId);
          setCart([]);
          setShowCheckoutModal(false);
        }
      }
    } catch (error) {
      console.error('提交訂單時發生錯誤：', error);
      alert('提交訂單時發生錯誤，請稍後再試。錯誤詳情：' + error.message);
    }
  };  
  




  useEffect(() => {
    if (data && data.categories.length > 0) {
      setSelectedCategory(data.categories[0].id);
    }
  }, [data]);

  if (loading) return <Loader2 className="animate-spin" />;
  if (error) return <p className="text-red-500">錯誤: {error.message}</p>;

  const restaurant = data.restaurants_by_pk;
  const categories = data.categories;
  const dishes = data.dishes;
  const dishOptions = data.dish_options;
  const dishOptionItems = data.dish_option_items;

  const addToCart = (dish, options = {}, note = '') => {
    const cartItem = {
      ...dish,
      options: Object.fromEntries(
        Object.entries(options).map(([optionId, selectedItems]) => [
          optionId,
          Array.isArray(selectedItems) ? selectedItems : [selectedItems]
        ])
      ),
      note: note,
      quantity: 1,
    };
    setCart([...cart, cartItem]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getDishesForCategory = (categoryId) => {
    return dishes.filter(dish => dish.category_id === categoryId);
  };

  const getDishOptions = (dishId) => {
    return dishOptions.filter(option => option.dish_id === dishId);
  };

  const getDishOptionItems = (optionId) => {
    return dishOptionItems.filter(item => item.dish_option_id === optionId);
  };

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openOptionModal = (dish) => {
    setSelectedDish(dish);
    setSelectedOptions({});
    setNote('');
    setShowOptionModal(true);
  };

  const closeOptionModal = () => {
    setShowOptionModal(false);
    setSelectedDish(null);
    setSelectedOptions({});
    setNote('');
  };

  const handleOptionChange = (optionId, itemId) => {
    setSelectedOptions(prev => {
      const option = dishOptions.find(o => o.id === optionId);
      if (option.type === 'checkbox') {
        // 如果是多選，則切換選中狀態
        const prevSelected = prev[optionId] || [];
        if (prevSelected.includes(itemId)) {
          return { ...prev, [optionId]: prevSelected.filter(id => id !== itemId) };
        } else {
          return { ...prev, [optionId]: [...prevSelected, itemId] };
        }
      } else {
        // 如果是單選，則直接替換
        return { ...prev, [optionId]: itemId };
      }
    });
  };

  const addToCartWithOptions = () => {
    addToCart(selectedDish, selectedOptions, note);
    closeOptionModal();
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      Object.entries(item.options).forEach(([optionId, selectedItems]) => {
        if (Array.isArray(selectedItems)) {
          // 多選選項
          selectedItems.forEach(itemId => {
            const optionItem = dishOptionItems.find(oi => oi.id === itemId);
            if (optionItem) {
              itemTotal += optionItem.price;
            }
          });
        } else {
          // 單選選項
          const optionItem = dishOptionItems.find(oi => oi.id === selectedItems);
          if (optionItem) {
            itemTotal += optionItem.price;
          }
        }
      });
      return total + itemTotal;
    }, 0);
  };

  const tables = data?.tables || [];

  const selectTable = (tableId) => {
    setSelectedTable(tableId);
    // 這裡可以添加其他邏輯，比如更新桌子狀態等
  };

  // 渲染桌號選擇界面
  const renderTableSelection = () => {
    if (!selectedTable) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">請選擇桌號</h2>
            <div className="grid grid-cols-3 gap-4">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => selectTable(table.id)}
                  className={`p-4 rounded-lg ${
                    table.status === 'available' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                  disabled={table.status !== 'available'}
                >
                  {table.table_number}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };



  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col h-screen">
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{restaurant.name}</h1>
            {selectedTable && (
              <span className="text-sm">桌號: {tables.find(t => t.id === selectedTable)?.table_number}</span>
            )}
          </div>
          <button onClick={() => setShowCartModal(true)} className="flex items-center">
            <ShoppingCart size={24} className="mr-2" />
            <span>{cart.length}</span>
          </button>
        </header>

        <main className="flex-grow overflow-auto">
          <div className="relative">
            <button onClick={() => scrollCategories('left')} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
              <ChevronLeft size={24} />
            </button>
            <div ref={categoriesRef} className="flex overflow-x-auto p-2 bg-gray-100 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 mr-2 rounded-full ${
                    selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <button onClick={() => scrollCategories('right')} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="p-4">
            {selectedCategory && getDishesForCategory(selectedCategory).map(dish => (
              <div key={dish.id} className="flex items-center mb-4 bg-white p-2 rounded shadow">
                <img src={PCLOUD_IMAGE_PATH+dish.image_url || "/api/placeholder/100/100"} alt={dish.name} className="w-20 h-20 object-cover rounded mr-4" />
                <div className="flex-grow">
                  <h3 className="font-bold">{dish.name}</h3>
                  <p className="text-sm text-gray-600">{dish.description}</p>
                  <p className="text-red-500 font-bold">${dish.price}</p>
                  {getDishOptions(dish.id).length > 0 && (
                    <button 
                      onClick={() => openOptionModal(dish)}
                      className="text-sm text-blue-500 underline"
                    >
                      自定義選項
                    </button>
                  )}
                </div>
                <button
                  onClick={() => openOptionModal(dish)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  加入
                </button>
              </div>
            ))}
          </div>
        </main>


        <button 
          className="bg-green-500 text-white px-6 py-2 rounded"
          onClick={() => {
            if (selectedTable) {
              setShowCheckoutModal(true);
            } else {
              alert('請先選擇桌號');
            }
          }}
        >
          結帳 (${getTotalPrice().toFixed(2)})
        </button>

        {showOptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedDish.name} - 自定義選項</h2>
                <button onClick={closeOptionModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto flex-grow">
                {getDishOptions(selectedDish.id).map(option => (
                  <div key={option.id} className="mb-4">
                    <h3 className="font-bold mb-2">{option.name}</h3>
                    {getDishOptionItems(option.id).map(item => (
                      <label key={item.id} className="flex items-center mb-2">
                        <input
                          type={option.type === 'radio' ? 'radio' : 'checkbox'}
                          name={`option-${option.id}`}
                          value={item.id}
                          checked={
                            option.type === 'checkbox'
                              ? (selectedOptions[option.id] || []).includes(item.id)
                              : selectedOptions[option.id] === item.id
                          }
                          onChange={() => handleOptionChange(option.id, item.id)}
                          className="mr-2"
                        />
                        <span>{item.name} (+${item.price})</span>
                      </label>
                    ))}
                  </div>
                ))}
                <div className="mb-4">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="請輸入特殊要求或備註"
                    rows="3"
                  />
                </div>
              </div>
              <button
                onClick={addToCartWithOptions}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                加入購物車
              </button>
            </div>
          </div>
        )}

        {showCartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">購物車內容</h2>
                <button onClick={() => setShowCartModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto flex-grow">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between mb-4 border-b pb-2">
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        ${item.price} x {item.quantity}
                      </p>
                      {Object.entries(item.options).map(([optionId, selectedItems]) => {
                        const option = dishOptions.find(o => o.id === parseInt(optionId));
                        if (Array.isArray(selectedItems)) {
                          // 多選選項
                          return selectedItems.map(itemId => {
                            const optionItem = dishOptionItems.find(oi => oi.id === itemId);
                            return (
                              <p key={itemId} className="text-sm text-gray-500">
                                {option?.name}: {optionItem?.name} (+${optionItem?.price})
                              </p>
                            );
                          });
                        } else {
                          // 單選選項
                          const optionItem = dishOptionItems.find(oi => oi.id === selectedItems);
                          return (
                            <p key={optionId} className="text-sm text-gray-500">
                              {option?.name}: {optionItem?.name} (+${optionItem?.price})
                            </p>
                          );
                        }
                      })}
                      {item.note && (
                        <p className="text-sm text-gray-500">備註: {item.note}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      移除
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="font-bold text-lg">總計: ${getTotalPrice().toFixed(2)}</p>
              </div>
              <button
                onClick={() => setShowCartModal(false)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-4"
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </div>
      {renderTableSelection()}

      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
        cart={cart} 
        totalPrice={getTotalPrice()} 
        tableNumber={tables.find(t => t.id === selectedTable)?.table_number}
        dishOptions={dishOptions}
        dishOptionItems={dishOptionItems}
        onCheckout={handleCheckout}  // 確保這裡正確傳遞了函數
      />

    </div>
  );
};


export default RestaurantOrderApp;
