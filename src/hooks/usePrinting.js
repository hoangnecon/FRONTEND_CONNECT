// src/hooks/usePrinting.js
import { initialPrintSettings } from '../data/initialPrintSettings';
import { generateReceiptHtml } from '../utils/generateReceiptHtml'; // Import hàm helper mới

const usePrinting = (orders, selectedTable, tables, bankSettings, banks) => {
  const getReceiptData = (type, currentPrintSettings) => {
    const currentOrders = orders[selectedTable] || [];
    if (currentOrders.length === 0) {
      return null;
    }

    const printSettings = currentPrintSettings || initialPrintSettings;
    const orderData = {
        items: currentOrders,
        total: currentOrders.reduce((sum, item) => sum + item.price * item.quantity, 0),
        table: tables.find(t => t.id === selectedTable)?.name || 'Không xác định',
       
    };

    const htmlContent = generateReceiptHtml(orderData, printSettings, bankSettings, banks, type);

    return { html: htmlContent, type: type, total: orderData.total, table: orderData.table, items: orderData.items };
  };

  return {
    getReceiptData,
    initialSettings: initialPrintSettings, 
  };
};

export default usePrinting;