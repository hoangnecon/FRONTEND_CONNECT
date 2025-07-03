// src/data/initialPrintSettings.js
export const initialPrintSettings = {
  fontFamily: 'Courier New',
  lineSpacing: 2,
  useSeparatorLine: true,

  // Provisional Receipt Settings
  restaurantName: 'Nhà hàng ABC',
  address: '123 Đường XYZ, Q.1, TP.HCM',
  phone: '0909 123 456',
  showStoreName: true,
  headerStyle: { fontSize: 14, fontWeight: 'bold', fontStyle: 'normal' },
  subHeaderStyle: { fontSize: 8, fontWeight: 'normal', fontStyle: 'normal' },
  showDateTime: true,
  showCashier: false,
  orderInfoStyle: { fontSize: 9, fontWeight: 'normal', fontStyle: 'normal' },
  itemsHeaderStyle: { fontSize: 9, fontWeight: 'bold', fontStyle: 'normal' },
  itemsBodyStyle: { fontSize: 9, fontWeight: 'normal', fontStyle: 'normal' },
  totalLabel: 'TỔNG CỘNG:',
  thankYouMessage: 'Cảm ơn quý khách!',
  showQrCode: true,
  totalStyle: { fontSize: 10, fontWeight: 'bold', fontStyle: 'normal' },
  footerStyle: { fontSize: 8, fontWeight: 'normal', fontStyle: 'italic' },
  showWifi: true,
  wifiPassword: 'your_wifi_password',
  wifiStyle: { fontSize: 9, fontWeight: 'bold', fontStyle: 'normal' },

  // Kitchen Order Settings (new)
  kitchenOrderHeader: 'PHIẾU GỌI MÓN',
  showKitchenStoreName: false, // Usually hidden for kitchen
  kitchenRestaurantName: 'Nhà hàng ABC', // Keep for consistency if needed
  kitchenAddress: '123 Đường XYZ, Q.1, TP.HCM',
  kitchenPhone: '0909 123 456',
  kitchenHeaderStyle: { fontSize: 12, fontWeight: 'bold', fontStyle: 'normal' },
  kitchenOrderInfoStyle: { fontSize: 9, fontWeight: 'normal', fontStyle: 'normal' },
  kitchenItemsHeaderStyle: { fontSize: 9, fontWeight: 'bold', fontStyle: 'normal' },
  kitchenItemsBodyStyle: { fontSize: 9, fontWeight: 'normal', fontStyle: 'normal' },
  kitchenFooterMessage: '--- YÊU CẦU BẾP CHUẨN BỊ ---',
  showKitchenCashier: true, // Often shown for kitchen
};