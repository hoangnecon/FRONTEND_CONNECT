// src/hooks/useOrderManagement.js
import { useState, useEffect } from 'react';

const useOrderManagement = (tables, menuItems, addNotification) => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState({});
  const [recentItems, setRecentItems] = useState([1, 3, 4, 7, 8]); // Initial recent items
  const [tableNotes, setTableNotes] = useState({});
  const [itemNotes, setItemNotes] = useState({});
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [currentNoteType, setCurrentNoteType] = useState('table');
  const [currentNoteTarget, setCurrentNoteTarget] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [showChangeTableDialog, setShowChangeTableDialog] = useState(false);
  const [autoOpenMenu, setAutoOpenMenu] = useState(false);
  const [tableFilter, setTableFilter] = useState('all');

  const getRemainingStock = (itemId, currentOrders) => {
    const menuItem = menuItems.find(mi => mi.id === itemId);
    if (!menuItem || !menuItem.inventoryEnabled) return Infinity;
    
    const inOrderCount = Object.values(currentOrders)
      .flat()
      .reduce((acc, orderItem) => (orderItem.id === itemId ? acc + orderItem.quantity : acc), 0);
      
    return menuItem.inventoryCount - inOrderCount;
  };

  const addToOrder = (item) => {
    if (!selectedTable) return;

    const remainingStock = getRemainingStock(item.id, orders);
    if (remainingStock <= 0) {
      alert(`Món "${item.name}" đã hết hàng.`);
      return;
    }

    const tableOrders = orders[selectedTable] || [];
    const existingItem = tableOrders.find((orderItem) => orderItem.id === item.id);
    const newQuantity = (existingItem ? existingItem.quantity : 0) + 1;

    if (newQuantity > remainingStock) {
      alert(`Không đủ số lượng "${item.name}" trong kho.`);
      return;
    }
    
    if (existingItem) {
      setOrders({
        ...orders,
        [selectedTable]: tableOrders.map((orderItem) =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        ),
      });
    } else {
      setOrders({
        ...orders,
        [selectedTable]: [...tableOrders, { ...item, quantity: 1 }],
      });
    }
    
    if (addNotification && remainingStock - 1 <= 5 && remainingStock - 1 > 0) {
      addNotification({
        id: `low-stock-${item.id}-${Date.now()}`,
        type: 'warning',
        message: `Món "${item.name}" sắp hết hàng, chỉ còn ${remainingStock - 1} phần.`
      });
    }

    setRecentItems((prev) => {
      const filtered = prev.filter((id) => id !== item.id);
      return [item.id, ...filtered].slice(0, 8);
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (!selectedTable) return;
  
    const menuItem = menuItems.find(mi => mi.id === itemId);
  
    // Inventory Check
    if (menuItem && menuItem.inventoryEnabled && newQuantity > menuItem.inventoryCount) {
      alert(`Chỉ còn ${menuItem.inventoryCount} sản phẩm "${menuItem.name}" trong kho.`);
      newQuantity = menuItem.inventoryCount;
    }
  
    if (newQuantity <= 0) {
      setOrders({ ...orders, [selectedTable]: (orders[selectedTable] || []).filter((item) => item.id !== itemId), });
      const itemKey = `${selectedTable}-${itemId}`;
      const newItemNotes = { ...itemNotes };
      delete newItemNotes[itemKey];
      setItemNotes(newItemNotes);
    } else {
      setOrders({ ...orders, [selectedTable]: (orders[selectedTable] || []).map((item) => item.id === itemId ? { ...item, quantity: newQuantity } : item), });
    }
  };

  const clearTable = () => {
    if (!selectedTable) return;
    setOrders({ ...orders, [selectedTable]: [] });
    const newTableNotes = { ...tableNotes };
    delete newTableNotes[selectedTable];
    setTableNotes(newTableNotes);
    const newItemNotes = { ...itemNotes };
    Object.keys(newItemNotes).forEach((key) => { if (key.startsWith(`${selectedTable}-`)) { delete newItemNotes[key]; } });
    setItemNotes(newItemNotes);
  };

  const handleNoteSubmit = () => {
    if (currentNoteType === 'table') { setTableNotes({ ...tableNotes, [selectedTable]: noteInput }); }
    else if (currentNoteType === 'item') { const itemKey = `${selectedTable}-${currentNoteTarget}`; setItemNotes({ ...itemNotes, [itemKey]: noteInput }); }
    setNoteInput('');
    setShowNoteDialog(false);
  };

  const openTableNoteDialog = () => { setCurrentNoteType('table'); setNoteInput(tableNotes[selectedTable] || ''); setShowNoteDialog(true); };
  const openItemNoteDialog = (itemId) => { setCurrentNoteType('item'); setCurrentNoteTarget(itemId); const itemKey = `${selectedTable}-${itemId}`; setNoteInput(itemNotes[itemKey] || ''); setShowNoteDialog(true); };

  const handleChangeTable = (targetTableId) => {
    if (!selectedTable || !orders[selectedTable]) return;
    const sourceOrder = orders[selectedTable] || [];
    const targetOrder = orders[targetTableId] || [];
    const mergedOrder = [...targetOrder];
    sourceOrder.forEach((sourceItem) => {
      const existingItemIndex = mergedOrder.findIndex((item) => item.id === sourceItem.id);
      if (existingItemIndex > -1) { mergedOrder[existingItemIndex].quantity += sourceItem.quantity; }
      else { mergedOrder.push(sourceItem); }
    });
    setOrders({ ...orders, [targetTableId]: mergedOrder, [selectedTable]: [], });
    const newTableNotes = { ...tableNotes };
    if (tableNotes[selectedTable]) { newTableNotes[targetTableId] = (newTableNotes[targetTableId] || '') + ' | ' + tableNotes[selectedTable]; delete newTableNotes[selectedTable]; setTableNotes(newTableNotes); }
    setShowChangeTableDialog(false);
    setSelectedTable(targetTableId);
  };

  const handleAutoOpenMenuToggle = () => setAutoOpenMenu((prev) => !prev);

  // Return values and functions for App.js to use
  return {
    selectedTable,
    setSelectedTable,
    orders,
    setOrders, // Exposed if App.js needs to modify orders directly (e.g., after payment)
    recentItems,
    setRecentItems,
    tableNotes,
    setTableNotes,
    itemNotes,
    setItemNotes,
    tableFilter,
    setTableFilter,
    showNoteDialog,
    setShowNoteDialog,
    currentNoteType,
    setCurrentNoteType,
    currentNoteTarget,
    setCurrentNoteTarget,
    noteInput,
    setNoteInput,
    showChangeTableDialog,
    setShowChangeTableDialog,
    autoOpenMenu,
    handleAutoOpenMenuToggle,
    addToOrder,
    updateQuantity,
    clearTable,
    handleNoteSubmit,
    openTableNoteDialog,
    openItemNoteDialog,
    handleChangeTable,
  };
};

export default useOrderManagement;