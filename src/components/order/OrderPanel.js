import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Trash2,
  X,
  Plus,
  Minus,
  MessageSquare,
  Edit3,
  ArrowLeft,
  Check,
  Percent,
  DollarSign,
  Banknote,
  CreditCard,
  Split,
  Printer,
  QrCode,
  Combine,
} from 'lucide-react';
import QRCodeDialog from './QRCodeDialog';

const PartialPaymentDialog = ({
    setShowPartialPaymentDialog,
    orderItems,
    onProcessPartialPayment,
    quickDiscountOptions,
    bankSettings, // Thêm prop
    banks, // Thêm prop
  }) => {
    const [selectedItems, setSelectedItems] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discountType, setDiscountType] = useState('none');
    const [discountValue, setDiscountValue] = useState(0);
    const [showQRCodeDialog, setShowQRCodeDialog] = useState(false); // Thêm state

    const handleQuantityChange = (item, change) => {
      const currentSelectedQuantity = selectedItems[item.id]?.quantity || 0;
      const originalQuantity = item.quantity;
      let newQuantity = currentSelectedQuantity + change;
  
      if (newQuantity > originalQuantity) newQuantity = originalQuantity;
      if (newQuantity < 0) newQuantity = 0;
  
      setSelectedItems((prev) => {
        const newSelected = { ...prev };
        if (newQuantity === 0) {
          delete newSelected[item.id];
        } else {
          newSelected[item.id] = { ...item, quantity: newQuantity };
        }
        return newSelected;
      });
    };
  
    const subtotal = useMemo(() => {
      return Object.values(selectedItems).reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }, [selectedItems]);
  
    const getDiscountAmount = () => {
      if (discountType === 'percent') {
        return (subtotal * discountValue) / 100;
      } else if (discountType === 'amount') {
        return Math.min(subtotal, discountValue);
      }
      return 0;
    };
  
    const discountAmount = getDiscountAmount();
    const finalAmount = subtotal - discountAmount;
  
    const handleProcessPayment = () => {
      if (Object.keys(selectedItems).length === 0) return;
      const paymentData = {
        paymentMethod,
        discountType,
        discountValue,
        discountAmount,
        subtotal,
        total: finalAmount,
        paidItems: Object.values(selectedItems),
      };
      onProcessPartialPayment(paymentData);
    };
    
    return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-primary-main rounded-2xl w-full max-w-lg max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-primary-headline">Thanh toán một phần</h2>
              <button onClick={() => setShowPartialPaymentDialog(false)} className="p-2 rounded-full hover:bg-gray-200">
                  <X size={24} />
              </button>
          </div>
  
          <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
            <div>
              <h3 className="text-lg font-bold text-primary-headline mb-4">Chọn món thanh toán</h3>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-primary-secondary">
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-sm">{item.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleQuantityChange(item, -1)} className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400">-</button>
                      <span className="font-bold text-lg w-8 text-center">{selectedItems[item.id]?.quantity || 0}</span>
                      <button onClick={() => handleQuantityChange(item, 1)} className="w-8 h-8 rounded-full bg-primary-button text-white hover:bg-primary-highlight">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="mt-4 md:mt-0">
              <h3 className="text-lg font-bold text-primary-headline mb-4">Tổng kết</h3>
              <div className="mb-4">
                <h4 className="font-medium text-primary-paragraph mb-2">Phương thức</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setPaymentMethod('cash')} className={`p-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${paymentMethod === 'cash' ? 'bg-primary-button text-white' : 'bg-gray-200'}`}><Banknote size={18} /> Tiền mặt</button>
                  <button onClick={() => { setPaymentMethod('transfer'); setShowQRCodeDialog(true); }} className={`p-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${paymentMethod === 'transfer' ? 'bg-primary-button text-white' : 'bg-gray-200'}`}><QrCode size={18} /> Chuyển khoản</button>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-primary-paragraph mb-2">Giảm giá nhanh</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {quickDiscountOptions.map(opt => (
                    <button key={opt.id} onClick={() => { setDiscountType(opt.type); setDiscountValue(opt.value); }} className={`p-2 rounded-lg font-semibold ${discountType === opt.type && discountValue === opt.value ? 'bg-primary-button text-white' : 'bg-gray-200'}`}>{opt.label}</button>
                  ))}
                </div>
              </div>
              <div className="bg-primary-secondary rounded-xl p-4 space-y-2">
                <div className="flex justify-between"><span>Tạm tính:</span> <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-red-600"><span>Giảm giá:</span> <span className="font-medium">-{discountAmount.toLocaleString('vi-VN')}đ</span></div>}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold"><span>Tổng cộng:</span> <span className="text-primary-button">{finalAmount.toLocaleString('vi-VN')}đ</span></div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="p-4 md:p-6 border-t flex flex-col md:flex-row justify-end gap-3">
            <button onClick={() => setShowPartialPaymentDialog(false)} className="px-6 py-3 rounded-xl font-bold bg-gray-200 text-gray-800 hover:bg-gray-300">Hủy</button>
            <button onClick={handleProcessPayment} disabled={finalAmount <= 0} className="px-6 py-3 rounded-xl font-bold bg-primary-button text-white hover:bg-primary-highlight disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"><Check size={20} /> Thanh toán</button>
          </div>
        </div>
      </div>
       {showQRCodeDialog && (
          <QRCodeDialog
            bankSettings={bankSettings}
            amount={finalAmount}
            description={`Thanh toan mot phan`}
            onClose={() => setShowQRCodeDialog(false)}
            banks={banks}
          />
        )}
    </>
    );
};
  
const PaymentDialog = ({
    setShowPaymentDialog,
    setShowPartialPaymentDialog,
    selectedTable,
    getCurrentOrders,
    getTotalAmount,
    processPayment,
    handlePrint,
    quickDiscountOptions,
    bankSettings,
    banks,
  }) => {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [discountType, setDiscountType] = useState('none');
    const [discountValue, setDiscountValue] = useState(0);
    const [showQRCodeDialog, setShowQRCodeDialog] = useState(false);
  
    const subtotal = getTotalAmount();
  
    const getDiscountAmount = () => {
      if (discountType === 'percent') return (subtotal * discountValue) / 100;
      if (discountType === 'amount') return Math.min(subtotal, discountValue);
      return 0;
    };
  
    const discountAmount = getDiscountAmount();
    const finalAmount = subtotal - discountAmount;
  
    const handleProcessPayment = () => {
      const paymentData = {
        paymentMethod,
        discountType,
        discountValue,
        discountAmount,
        subtotal,
        total: finalAmount,
      };
      processPayment(paymentData, 'full');
    };
  
    return (
      <>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-primary-main rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col md:flex-row overflow-hidden">
            <div className="hidden md:flex flex-1 p-8 flex-col overflow-y-auto">
              <h1 className="text-2xl font-bold text-primary-headline mb-2">Chi tiết đơn hàng</h1>
              <p className="text-primary-paragraph mb-6">{selectedTable === 'takeaway' ? 'Đơn mang về' : `Bàn ${selectedTable}`}</p>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {getCurrentOrders().map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-primary-secondary rounded-xl shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-bg rounded-xl overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary-headline">{item.name}</h4>
                        <p className="text-sm text-primary-paragraph">SL: {item.quantity}</p>
                        <p className="text-sm text-primary-button font-medium">{item.price.toLocaleString('vi-VN')}đ x {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-button">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    
            <div className="w-full md:w-96 bg-primary-secondary p-4 md:p-6 flex flex-col">
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold text-primary-headline mb-6">Tùy chọn thanh toán</h2>
                <div className="mb-4">
                  <h3 className="text-base md:text-lg font-medium text-primary-paragraph mb-3">Giảm giá nhanh</h3>
                  <div className="grid grid-cols-4 gap-2">
                      {quickDiscountOptions.map(opt => (
                          <button key={opt.id} onClick={() => { setDiscountType(opt.type); setDiscountValue(opt.value); }} className={`p-2 rounded-lg font-semibold ${discountType === opt.type && discountValue === opt.value ? 'bg-primary-button text-white' : 'bg-white'}`}>{opt.label}</button>
                      ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-base md:text-lg font-medium text-primary-paragraph mb-3">Giảm giá thủ công</h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <button onClick={() => setDiscountType('none')} className={`p-2 rounded-lg ${discountType === 'none' ? 'bg-primary-button text-white' : 'bg-white'}`}>Không</button>
                    <button onClick={() => setDiscountType('percent')} className={`p-2 rounded-lg ${discountType === 'percent' ? 'bg-primary-button text-white' : 'bg-white'}`}>%</button>
                    <button onClick={() => setDiscountType('amount')} className={`p-2 rounded-lg ${discountType === 'amount' ? 'bg-primary-button text-white' : 'bg-white'}`}>VND</button>
                  </div>
                  {discountType !== 'none' && (
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      placeholder={discountType === 'percent' ? 'Nhập %' : 'Nhập số tiền'}
                      className="w-full p-3 bg-white rounded-xl focus:ring-2 focus:ring-primary-highlight"
                    />
                  )}
                </div>
                <div className="mb-6">
                  <h3 className="text-base md:text-lg font-medium text-primary-paragraph mb-3">Phương thức</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setPaymentMethod('cash')} className={`p-3 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'cash' ? 'bg-primary-button text-white' : 'bg-white'}`}><Banknote size={20}/>Tiền mặt</button>
                    <button onClick={() => { setPaymentMethod('transfer'); setShowQRCodeDialog(true); }} className={`p-3 rounded-lg flex items-center justify-center gap-2 ${paymentMethod === 'transfer' ? 'bg-primary-button text-white' : 'bg-white'}`}><QrCode size={20}/>Chuyển khoản</button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 space-y-2">
                  <div className="flex justify-between"><span>Tạm tính:</span> <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span></div>
                  {discountAmount > 0 && <div className="flex justify-between text-red-600"><span>Giảm giá:</span> <span className="font-medium">-{discountAmount.toLocaleString('vi-VN')}đ</span></div>}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-xl md:text-2xl font-bold"><span>Tổng cộng:</span> <span className="text-primary-button">{finalAmount.toLocaleString('vi-VN')}đ</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setShowPaymentDialog(false); setShowPartialPaymentDialog(true); }} className="w-full bg-blue-100 text-blue-800 hover:bg-blue-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Split size={20} />Một phần</button>
                  <button onClick={handleProcessPayment} className="w-full bg-primary-button hover:bg-primary-highlight text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Check size={20}/>Hoàn tất</button>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <button onClick={() => handlePrint('provisional')} className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Printer size={20}/>In tạm tính
                    </button>
                    <button onClick={() => setShowPaymentDialog(false)} className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <ArrowLeft size={20}/>Quay lại
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showQRCodeDialog && (
          <QRCodeDialog
            bankSettings={bankSettings}
            amount={finalAmount}
            description={`Thanh toan don hang ban ${selectedTable}`}
            onClose={() => setShowQRCodeDialog(false)}
            banks={banks}
          />
        )}
      </>
    );
  };

const OrderPanel = ({
    selectedTable,
    orders,
    itemNotes,
    tableNotes,
    updateQuantity,
    clearTable,
    processPayment,
    openItemNoteDialog,
    openTableNoteDialog,
    openChangeTableDialog,
    handlePrint,
    quickDiscountOptions,
    bankSettings,
    banks,
  }) => {
    const [showClearDialog, setShowClearDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showPartialPaymentDialog, setShowPartialPaymentDialog] = useState(false);
  
    const getCurrentOrders = () =>
      selectedTable ? orders[selectedTable] || [] : [];
    const getTotalAmount = () => {
      return getCurrentOrders().reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    };
  
    const handleProcessPartialPayment = (paymentData) => {
      processPayment(paymentData, 'partial');
      setShowPartialPaymentDialog(false);
    };
  
    const currentOrders = getCurrentOrders();
    const totalAmount = getTotalAmount();
  
    return (
      <div className="w-full md:w-96 bg-primary-main flex flex-col h-screen shadow-2xl">
        <div className="p-6 bg-primary-main shadow-md">
          <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-button rounded-xl flex items-center justify-center">
                  <span className="text-primary-main font-bold text-lg">
                      {selectedTable === 'takeaway' ? '📦' : selectedTable || '?'}
                  </span>
                  </div>
                  <div>
                  <h2 className="text-xl font-bold text-primary-headline">
                      {selectedTable === 'takeaway'
                      ? 'MANG VỀ'
                      : `BÀN ${selectedTable || '?'}`}
                  </h2>
                  <p className="text-xs text-primary-paragraph">
                      {selectedTable === 'takeaway'
                      ? 'Đơn hàng mang về'
                      : 'Đơn hàng tại bàn'}
                  </p>
                  </div>
              </div>
  
            {currentOrders.length > 0 && (
              <button
                onClick={() => setShowClearDialog(true)}
                className="text-primary-paragraph hover:text-primary-tertiary transition-colors p-2"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
  
        <div className="flex-1 overflow-y-auto p-4">
          {currentOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={24} className="text-primary-button" />
              </div>
              <h3 className="text-lg font-bold text-primary-headline mb-1">
                Chưa có món nào
              </h3>
              <p className="text-primary-paragraph text-sm">
                {selectedTable ? 'Thêm món từ thực đơn' : 'Chọn bàn để bắt đầu'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentOrders.map((item) => {
                const itemKey = `${selectedTable}-${item.id}`;
                const itemNote = itemNotes[itemKey];
                return (
                  <div
                    key={item.id}
                    className="bg-primary-secondary rounded-2xl p-4 shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary-bg rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-primary-headline text-sm truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => updateQuantity(item.id, 0)}
                            className="text-primary-paragraph hover:text-primary-tertiary transition-colors ml-2 p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
  
                        {itemNote ? (
                          <div className="rounded-lg p-2 mb-2 shadow-sm">
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-primary-headline">
                                {itemNote}
                              </p>
                              <button
                                onClick={() => openItemNoteDialog(item.id)}
                                className="text-primary-button hover:text-primary-highlight"
                              >
                                <Edit3 size={12} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => openItemNoteDialog(item.id)}
                            className="flex items-center gap-1 text-xs text-primary-paragraph hover:text-primary-highlight mb-2"
                          >
                            <MessageSquare size={12} />
                            Thêm ghi chú
                          </button>
                        )}
  
                        <div className="flex items-center justify-between">
                          <span className="text-primary-headline font-bold text-lg">
                            {item.price.toLocaleString('vi-VN')}đ
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-xl bg-primary-bg hover:bg-primary-stroke flex items-center justify-center transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-bold text-primary-headline">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-xl bg-primary-button hover:bg-primary-highlight text-primary-main flex items-center justify-center transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
  
        {currentOrders.length > 0 && (
          <div className="bg-primary-secondary p-6 shadow-inner">
            <div className="bg-primary-main rounded-2xl p-4 mb-4 shadow-lg">
              <h3 className="text-lg font-bold text-center text-primary-headline mb-4">
                PHIẾU THANH TOÁN
              </h3>
  
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary-paragraph">
                    {selectedTable === 'takeaway' ? 'Mang về:' : 'Bàn số:'}
                  </span>
                  <span className="font-bold text-primary-button">
                    {selectedTable === 'takeaway'
                      ? 'Mang về'
                      : `#${String(selectedTable).padStart(2, '0')}`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-paragraph">Thời gian:</span>
                  <span className="font-bold text-primary-headline">
                    {new Date().toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-paragraph">Số món:</span>
                  <span className="font-bold text-primary-headline">
                    {currentOrders.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
  
                <div className="flex justify-between items-center">
                  <span className="text-primary-paragraph">Ghi chú:</span>
                  <button
                    onClick={openTableNoteDialog}
                    className="text-primary-button hover:text-primary-highlight flex items-center gap-1"
                  >
                    {tableNotes[selectedTable] ? (
                      <span className="font-medium text-xs max-w-32 truncate">
                        {tableNotes[selectedTable]}
                      </span>
                    ) : (
                      <>
                        <Edit3 size={12} />
                        <span className="text-xs">Thêm ghi chú</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
  
              <div className="border-t border-primary-stroke pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-headline">
                    TỔNG CỘNG:
                  </span>
                  <span className="text-xl font-bold text-primary-button">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
  
            <div className="space-y-3">
              <button
                onClick={openChangeTableDialog}
                className="w-full bg-primary-secondary text-primary-headline py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <Combine size={20}/>
                Chuyển/Gộp Bàn
              </button>
              <button
                className="w-full bg-primary-button hover:bg-primary-highlight text-primary-main py-3 rounded-xl font-bold text-lg transition-all shadow-lg"
                onClick={() => setShowPaymentDialog(true)}
              >
                THANH TOÁN
              </button>
            </div>
          </div>
        )}
  
        {showClearDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-bold text-primary-headline mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-primary-paragraph mb-6">
                Bạn có chắc chắn muốn xóa tất cả món ăn trong{' '}
                {selectedTable === 'takeaway'
                  ? 'đơn mang về'
                  : `bàn ${selectedTable}`}
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    clearTable();
                    setShowClearDialog(false);
                  }}
                  className="flex-1 bg-primary-tertiary text-primary-main py-2 rounded-xl font-bold shadow-md"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setShowClearDialog(false)}
                  className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold shadow-md"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
  
        {showPaymentDialog && (
          <PaymentDialog
            setShowPaymentDialog={setShowPaymentDialog}
            setShowPartialPaymentDialog={setShowPartialPaymentDialog}
            selectedTable={selectedTable}
            getCurrentOrders={getCurrentOrders}
            getTotalAmount={getTotalAmount}
            processPayment={processPayment}
            handlePrint={handlePrint}
            quickDiscountOptions={quickDiscountOptions}
            bankSettings={bankSettings}
            banks={banks}
          />
        )}
  
        {showPartialPaymentDialog && (
          <PartialPaymentDialog
            setShowPartialPaymentDialog={setShowPartialPaymentDialog}
            orderItems={currentOrders}
            onProcessPartialPayment={handleProcessPartialPayment}
            quickDiscountOptions={quickDiscountOptions}
            bankSettings={bankSettings}
            banks={banks}
          />
        )}
      </div>
    );
  };
  
  export default OrderPanel;