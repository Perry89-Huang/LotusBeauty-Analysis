import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, cart, totalPrice, tableNumber, dishOptions, dishOptionItems, onCheckout }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePayment = async () => {
    try {
      await onCheckout(paymentMethod);
      setStep(1); // 重置步驟
      onClose();
    } catch (error) {
      console.error('結帳時發生錯誤：', error);
      alert('結帳過程中發生錯誤，請稍後再試。');
    }
  };

  const handleClose = () => {
    setStep(1); // 重置步驟
    onClose();
  }

  if (!isOpen) return null;

  const renderStep1 = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">確認訂單</h2>
      <div className="mb-4">
        <p className="font-bold">桌號：{tableNumber}</p>
      </div>
      <div className="max-h-60 overflow-y-auto mb-4">
        {cart.map((item, index) => (
          <div key={index} className="mb-2 pb-2 border-b">
            <p className="font-bold">{item.name} x {item.quantity}</p>
            <p className="text-sm text-gray-600">${item.price * item.quantity}</p>
            {Object.entries(item.options).map(([optionId, selectedItems]) => {
              const option = dishOptions.find(o => o.id === parseInt(optionId));
              if (Array.isArray(selectedItems)) {
                return selectedItems.map(itemId => {
                  const optionItem = dishOptionItems.find(oi => oi.id === itemId);
                  return (
                    <p key={itemId} className="text-sm text-gray-500">
                      {option?.name}: {optionItem?.name} (+${optionItem?.price})
                    </p>
                  );
                });
              } else {
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
        ))}
      </div>
      <p className="font-bold text-lg mb-4">總計: ${totalPrice}</p>
      <button
        onClick={() => setStep(2)}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center"
      >
        下一步 <ChevronRight size={20} className="ml-2" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-xl font-bold mb-4">選擇支付方式</h2>
      <div className="space-y-2 mb-4">
        {['信用卡', 'Line Pay', '現金'].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`w-full p-2 border rounded ${paymentMethod === method ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {method}
          </button>
        ))}
      </div>
      <button
        onClick={handlePayment}
        className="w-full bg-green-500 text-white px-4 py-2 rounded"
        disabled={!paymentMethod}
      >
        確認付款並提交訂單
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">結帳 {step === 1 ? '- 確認訂單' : '- 選擇支付方式'}</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        {step === 1 ? renderStep1() : renderStep2()}
      </div>
    </div>
  );
};

export default CheckoutModal;