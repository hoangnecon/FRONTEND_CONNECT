// src/App.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// Import hooks
import useAuth from './hooks/useAuth';
import useTableManagement from './hooks/useTableManagement';
import useOrderManagement from './hooks/useOrderManagement';
import useMenuData from './hooks/useMenuData';
import useDashboardData from './hooks/useDashboardData';
import usePrinting from './hooks/usePrinting';
import useTheme from './hooks/useTheme';
import useDiscountSettings from './hooks/useDiscountSettings';
import useBankSettings from './hooks/useBankSettings';
import useBankList from './hooks/useBankList';
import useStaffManagement from './hooks/useStaffManagement';

// Import components
import LoginPage from './components/auth/LoginPage';
import StaffPinLoginPage from './components/auth/StaffPinLoginPage';
import AdminPage from './admin/AdminPage';
import Sidebar from './components/common/Sidebar';
import MobileHeader from './components/common/MobileHeader';
import TableGrid from './components/tables/TableGrid';
import MenuSection from './components/menu/MenuSection';
import Dashboard from './components/dashboard/Dashboard';
import CashierExpenses from './cashier/CashierExpenses';
import OrderPanel from './components/order/OrderPanel';
import ChangeTableDialog from './components/order/ChangeTableDialog';
import PrintReceipt from './components/order/PrintReceipt';
import { X, AlertCircle } from 'lucide-react';

// Import data
import { MOCK_ORDERS_BY_DATE } from './data/mockData';
import { initialPrintSettings } from './data/initialPrintSettings';
import { generateReceiptHtml } from './utils/generateReceiptHtml';

function App() {
  const [activeSection, setActiveSection] = useState('tables');
  const [adminSection, setAdminSection] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [receiptToPrint, setReceiptToPrint] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileOrderPanelOpen, setIsMobileOrderPanelOpen] = useState(false);
  // Loại bỏ isDemoModeActive và isDemoAdminView
  // const [isDemoModeActive, setIsDemoModeActive] = useState(true);
  // const [isDemoAdminView, setIsDemoAdminView] = useState(false);

  const { theme, setTheme } = useTheme();
  const { quickDiscountOptions, addDiscountOption, updateDiscountOption, deleteDiscountOption } = useDiscountSettings();
  const { bankSettings, setBankSettings } = useBankSettings();
  const { banks, loading: bankListLoading } = useBankList();
  const { staffList, addStaff, updateStaff, deleteStaff } = useStaffManagement();
  const { tables, setTables, addTable, updateTable, deleteTable } = useTableManagement();
  const {
    menuItems, setMenuItems, menuTypes, setMenuTypes, categories,
    addMenuType, deleteMenuType, addMenuItem, updateMenuItem, deleteMenuItem,
    updateItemInventory, addCategory, updateCategory, deleteCategory,
    searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, selectedMenuType, setSelectedMenuType,
  } = useMenuData();
  const {
    selectedDate, setSelectedDate, paymentFilter, setPaymentFilter,
    dateRange, setDateRange, aggregatedOrdersForDisplay,
    expenses, addExpense,
  } = useDashboardData();

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i));
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== notification.id)), 5000);
  }, []);

  const {
    selectedTable, setSelectedTable, orders, setOrders,
    recentItems, setRecentItems, tableNotes, setTableNotes, itemNotes, setItemNotes,
    tableFilter, setTableFilter, showNoteDialog, setShowNoteDialog,
    currentNoteType, setCurrentNoteType, currentNoteTarget, setCurrentNoteTarget,
    noteInput, setNoteInput, showChangeTableDialog, setShowChangeTableDialog,
    autoOpenMenu, handleAutoOpenMenuToggle,
    addToOrder, updateQuantity, clearTable,
    handleNoteSubmit, openTableNoteDialog, openItemNoteDialog, handleChangeTable,
  }= useOrderManagement(tables, menuItems, addNotification);

  const { getReceiptData } = usePrinting(orders, selectedTable, tables, bankSettings, banks);

  const {
    authLevel, loggedInStaff, loginEmail, setLoginEmail, loginPassword, setLoginPassword,
    handleLogin, handleAdminLogin, handleStaffLogin, handleStaffLogout, handleBusinessLogout,
  } = useAuth(staffList, (isAdminFlag) => {
    setActiveSection('tables');
    if (isAdminFlag) setAdminSection('dashboard');
  }, () => {
    setActiveSection('tables');
    setAdminSection('dashboard');
    setSelectedTable(null);
    setOrders({});
    setTableNotes({});
    setItemNotes({});
  });

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (selectedTable && autoOpenMenu) setActiveSection('menu');
  }, [selectedTable, autoOpenMenu]);

  const componentRef = useRef();

  // Logic này vẫn để in ra trình duyệt nếu cần xem trước hoặc là fallback
  useEffect(() => {
    console.log("App.js useEffect for printing: receiptToPrint changed", receiptToPrint);
    if (receiptToPrint && componentRef.current) {
      console.log("App.js useEffect: componentRef.current is available, attempting print.");
      const timer = setTimeout(() => {
        setReceiptToPrint(null);
      }, 500);
      return () => clearTimeout(timer);
    } else if (receiptToPrint) {
        console.warn("App.js useEffect: receiptToPrint is set, but componentRef.current is not available yet.");
    }
  }, [receiptToPrint]);


  const processPaymentAndOrders = useCallback((paymentData, printType) => {
    console.log('processPaymentAndOrders: Bắt đầu xử lý.');

    const currentOrderItems = orders[selectedTable] || [];
    const orderTotalAmount = currentOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderTable = tables.find(t => t.id === selectedTable)?.name || 'Không xác định';

    const orderDataForHtml = {
      items: currentOrderItems,
      total: orderTotalAmount,
      table: orderTable,
      cashier: loggedInStaff?.name || 'N/A',
    };

    const savedSettings = localStorage.getItem('printSettings');
    const currentPrintSettings = savedSettings ? { ...initialPrintSettings, ...JSON.parse(savedSettings) } : initialPrintSettings;

    const htmlContent = generateReceiptHtml(orderDataForHtml, currentPrintSettings, bankSettings, banks, printType);

    console.log("processPaymentAndOrders: Generated HTML Content length:", htmlContent ? htmlContent.length : 0);

    if (htmlContent) {
      // Gửi tới API in hóa đơn của agent Node.js (Puppeteer + SumatraPDF)
      fetch("http://localhost:41995/print", { // CẬP NHẬT CỔNG VÀ ĐƯỜNG DẪN AGENT!
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: htmlContent,
          type: printType, // Gửi type để agent có thể log hoặc xử lý nếu cần
        }),
      })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => { throw new Error(text || res.statusText); });
          }
          return res.json();
        })
        .then(result => {
          if (!result.success) throw new Error(result.error || 'Lỗi in hóa đơn');
          console.log("🖨️ Đã gửi lệnh in thành công đến agent.");
          addNotification({
            id: `print-success-${Date.now()}`,
            type: 'success',
            message: result.message || `Đã gửi lệnh in ${printType === 'provisional' ? 'phiếu tạm tính' : 'phiếu bếp'} thành công.`,
          });
          // Kích hoạt hiển thị hóa đơn trên trình duyệt sau khi gửi lệnh in đến agent
          setReceiptToPrint({ html: htmlContent });
        })
        .catch(err => {
          console.error("❌ In thất bại:", err);
          addNotification({
            id: `print-error-${Date.now()}`,
            type: 'error',
            message: 'Không thể in: ' + err.message,
          });
        });

    } else {
      addNotification({
        id: `print-error-${Date.now()}`,
        type: 'error',
        message: 'Không có dữ liệu để in hóa đơn.',
      });
    }

    if (printType === 'full') { // Only clear table for full payment
      clearTable();
    } else if (printType === 'partial') {
      const currentOrder = [...(orders[selectedTable] || [])];
      const updatedOrder = currentOrder.map((orderItem) => {
        const paidItem = paymentData.paidItems.find((p) => p.id === orderItem.id);
        if (paidItem) return { ...orderItem, quantity: orderItem.quantity - paidItem.quantity };
        return orderItem;
      }).filter((item) => item.quantity > 0);
      setOrders({ ...orders, [selectedTable]: updatedOrder });
    }
  }, [addNotification, orders, selectedTable, tables, loggedInStaff, bankSettings, banks, clearTable, setOrders]);

  // Loại bỏ handleToggleView vì không còn chế độ demo
  // const handleToggleView = useCallback(() => {
  //   setIsDemoAdminView(prev => !prev);
  //   setActiveSection('tables');
  //   setAdminSection('dashboard');
  // }, []);

  return (
    <>
      {(() => {
        // Loại bỏ điều kiện isDemoModeActive
        // if (isDemoModeActive) {
        //   if (isDemoAdminView) {
        //     return (
        //       <AdminPage
        //         adminSection={adminSection}
        //         setAdminSection={setAdminSection}
        //         handleLogout={handleBusinessLogout}
        //         staffList={staffList}
        //         addStaff={addStaff}
        //         updateStaff={updateStaff}
        //         deleteStaff={deleteStaff}
        //         MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}
        //         menuTypes={menuTypes}
        //         setMenuTypes={setMenuTypes}
        //         addMenuType={addMenuType}
        //         deleteMenuType={deleteMenuType}
        //         menuItems={menuItems}
        //         addMenuItem={addMenuItem}
        //         updateMenuItem={updateMenuItem}
        //         deleteMenuItem={deleteMenuItem}
        //         updateItemInventory={updateItemInventory}
        //         categories={categories}
        //         addCategory={addCategory}
        //         updateCategory={updateCategory}
        //         deleteCategory={deleteCategory}
        //         orders={orders}
        //         selectedDate={selectedDate}
        //         setSelectedDate={setSelectedDate}
        //         paymentFilter={paymentFilter}
        //         setPaymentFilter={setPaymentFilter}
        //         dateRange={dateRange}
        //         setDateRange={setDateRange}
        //         aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
        //         tables={tables}
        //         setTables={setTables}
        //         addTable={addTable}
        //         updateTable={updateTable}
        //         deleteTable={deleteTable}
        //         initialSettings={initialPrintSettings}
        //         expenses={expenses}
        //         addExpense={addExpense}
        //         currentTheme={theme}
        //         onThemeChange={setTheme}
        //         quickDiscountOptions={quickDiscountOptions}
        //         addDiscountOption={addDiscountOption}
        //         updateDiscountOption={updateDiscountOption}
        //         deleteDiscountOption={deleteDiscountOption}
        //         bankSettings={bankSettings}
        //         setBankSettings={setBankSettings}
        //         bankList={banks}
        //         bankListLoading={bankListLoading}
        //         isDemoModeActive={isDemoModeActive}
        //         handleToggleView={handleToggleView}
        //       />
        //     );
        //   } else {
        //     const currentOrderItems = orders[selectedTable] || [];
        //     const orderItemCount = currentOrderItems.reduce((sum, item) => sum + item.quantity, 0);

        //     return (
        //       <div className="h-screen bg-primary-bg flex flex-col md:flex-row md:overflow-hidden">
        //         <MobileHeader
        //           onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        //           onToggleOrderPanel={() => setIsMobileOrderPanelOpen(true)}
        //           orderItemCount={orderItemCount}
        //           activeSection={activeSection}
        //           setActiveSection={setActiveSection}
        //         />
        //         {isMobileSidebarOpen && <div onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
        //         <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        //           <Sidebar
        //             activeSection={activeSection}
        //             setActiveSection={(section) => {
        //               setActiveSection(section);
        //               setIsMobileSidebarOpen(false);
        //             }}
        //             handleStaffLogout={handleStaffLogout}
        //             handleBusinessLogout={handleBusinessLogout}
        //             loggedInStaff={loggedInStaff}
        //             isDemoModeActive={isDemoModeActive}
        //             handleToggleView={handleToggleView}
        //           />
        //         </div>
        //         <div className="flex-1 flex overflow-hidden">
        //           <div className="flex-1 overflow-y-auto">
        //             {activeSection === 'tables' && (
        //               <TableGrid
        //                 tables={tables}
        //                 selectedTable={selectedTable}
        //                 setSelectedTable={setSelectedTable}
        //                 orders={orders}
        //                 tableFilter={tableFilter}
        //                 setTableFilter={setTableFilter}
        //                 recentItems={recentItems}
        //                 menuItems={menuItems}
        //                 addToOrder={addToOrder}
        //                 autoOpenMenu={autoOpenMenu}
        //                 handleAutoOpenMenuToggle={handleAutoOpenMenuToggle}
        //               />
        //             )}
        //             {activeSection === 'menu' && (
        //               <MenuSection
        //                 selectedTable={selectedTable}
        //                 searchTerm={searchTerm}
        //                 setSearchTerm={setSearchTerm}
        //                 selectedCategory={selectedCategory}
        //                 setSelectedCategory={setSelectedCategory}
        //                 selectedMenuType={selectedMenuType}
        //                 setSelectedMenuType={setSelectedMenuType}
        //                 menuItems={menuItems}
        //                 menuTypes={menuTypes}
        //                 categories={categories}
        //                 addToOrder={addToOrder}
        //                 orders={orders}
        //               />
        //             )}
        //             {activeSection === 'dashboard' && (
        //               <Dashboard
        //                 selectedDate={selectedDate}
        //                 setSelectedDate={setSelectedDate}
        //                 paymentFilter={paymentFilter}
        //                 setPaymentFilter={setPaymentFilter}
        //                 dateRange={dateRange}
        //                 setDateRange={setDateRange}
        //                 aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
        //               />
        //             )}
        //             {activeSection === 'expenses' && (
        //               <CashierExpenses expenses={expenses} addExpense={addExpense} />
        //             )}
        //           </div>
        //           <div className="hidden md:flex">
        //             <OrderPanel
        //               selectedTable={selectedTable}
        //               orders={orders}
        //               itemNotes={itemNotes}
        //               tableNotes={tableNotes}
        //               updateQuantity={updateQuantity}
        //               clearTable={clearTable}
        //               processPayment={processPaymentAndOrders}
        //               openTableNoteDialog={openTableNoteDialog}
        //               openItemNoteDialog={openItemNoteDialog}
        //               openChangeTableDialog={() => setShowChangeTableDialog(true)}
        //               handlePrint={(type) => processPaymentAndOrders({}, type)}
        //               quickDiscountOptions={quickDiscountOptions}
        //               bankSettings={bankSettings}
        //               banks={banks}
        //             />
        //           </div>
        //         </div>
        //         {isMobileOrderPanelOpen && <div onClick={() => setIsMobileOrderPanelOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
        //         <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out md:hidden ${isMobileOrderPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        //           <OrderPanel
        //             selectedTable={selectedTable}
        //             orders={orders}
        //             itemNotes={itemNotes}
        //             tableNotes={tableNotes}
        //             updateQuantity={updateQuantity}
        //             clearTable={clearTable}
        //             processPayment={processPaymentAndOrders}
        //             openTableNoteDialog={openTableNoteDialog}
        //             openItemNoteDialog={openItemNoteDialog}
        //             openChangeTableDialog={() => setShowChangeTableDialog(true)}
        //             handlePrint={(type) => processPaymentAndOrders({}, type)}
        //             quickDiscountOptions={quickDiscountOptions}
        //             bankSettings={bankSettings}
        //             banks={banks}
        //           />
        //         </div>
        //       </div>
        //     );
        //   }
        // } else { // Đây là phần else của isDemoModeActive, giờ sẽ là logic chính
          switch (authLevel) {
            case 'admin_auth':
              return (
                <AdminPage
                  adminSection={adminSection}
                  setAdminSection={setAdminSection}
                  handleLogout={handleBusinessLogout}
                  staffList={staffList}
                  addStaff={addStaff}
                  updateStaff={updateStaff}
                  deleteStaff={deleteStaff}
                  MOCK_ORDERS_BY_DATE={MOCK_ORDERS_BY_DATE}
                  menuTypes={menuTypes}
                  setMenuTypes={setMenuTypes}
                  addMenuType={addMenuType}
                  deleteMenuType={deleteMenuType}
                  menuItems={menuItems}
                  addMenuItem={addMenuItem}
                  updateMenuItem={updateMenuItem}
                  deleteMenuItem={deleteMenuItem}
                  updateItemInventory={updateItemInventory}
                  categories={categories}
                  addCategory={addCategory}
                  updateCategory={updateCategory}
                  deleteCategory={deleteCategory}
                  orders={orders}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  paymentFilter={paymentFilter}
                  setPaymentFilter={setPaymentFilter}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
                  tables={tables}
                  setTables={setTables}
                  addTable={addTable}
                  updateTable={updateTable}
                  deleteTable={deleteTable}
                  initialSettings={initialPrintSettings}
                  expenses={expenses}
                  addExpense={addExpense}
                  currentTheme={theme}
                  onThemeChange={setTheme}
                  quickDiscountOptions={quickDiscountOptions}
                  addDiscountOption={addDiscountOption}
                  updateDiscountOption={updateDiscountOption}
                  deleteDiscountOption={deleteDiscountOption}
                  bankSettings={bankSettings}
                  setBankSettings={setBankSettings}
                  bankList={banks}
                  bankListLoading={bankListLoading}
                  // isDemoModeActive={false} // Loại bỏ prop này
                  // handleToggleView={handleToggleView} // Loại bỏ prop này
                />
              );
            case 'staff_auth':
              const currentOrderItems = orders[selectedTable] || [];
              const orderItemCount = currentOrderItems.reduce((sum, item) => sum + item.quantity, 0);

              return (
                <div className="h-screen bg-primary-bg flex flex-col md:flex-row md:overflow-hidden">
                  <MobileHeader
                    onToggleSidebar={() => setIsMobileSidebarOpen(true)}
                    onToggleOrderPanel={() => setIsMobileOrderPanelOpen(true)}
                    orderItemCount={orderItemCount}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                  />
                  {isMobileSidebarOpen && <div onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
                  <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Sidebar
                      activeSection={activeSection}
                      setActiveSection={(section) => {
                        setActiveSection(section);
                        setIsMobileSidebarOpen(false);
                      }}
                      handleStaffLogout={handleStaffLogout}
                      handleBusinessLogout={handleBusinessLogout}
                      loggedInStaff={loggedInStaff}
                      // isDemoModeActive={false} // Loại bỏ prop này
                      // handleToggleView={handleToggleView} // Loại bỏ prop này
                    />
                  </div>
                  <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                      {activeSection === 'tables' && (
                        <TableGrid
                          tables={tables}
                          selectedTable={selectedTable}
                          setSelectedTable={setSelectedTable}
                          orders={orders}
                          tableFilter={tableFilter}
                          setTableFilter={setTableFilter}
                          recentItems={recentItems}
                          menuItems={menuItems}
                          addToOrder={addToOrder}
                          autoOpenMenu={autoOpenMenu}
                          handleAutoOpenMenuToggle={handleAutoOpenMenuToggle}
                        />
                      )}
                      {activeSection === 'menu' && (
                        <MenuSection
                          selectedTable={selectedTable}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          selectedMenuType={selectedMenuType}
                          setSelectedMenuType={setSelectedMenuType}
                          menuItems={menuItems}
                          menuTypes={menuTypes}
                          categories={categories}
                          addToOrder={addToOrder}
                          orders={orders}
                        />
                      )}
                      {activeSection === 'dashboard' && (
                        <Dashboard
                          selectedDate={selectedDate}
                          setSelectedDate={setSelectedDate}
                          paymentFilter={paymentFilter}
                          setPaymentFilter={setPaymentFilter}
                          dateRange={dateRange}
                          setDateRange={setDateRange}
                          aggregatedOrdersForDisplay={aggregatedOrdersForDisplay}
                        />
                      )}
                      {activeSection === 'expenses' && (
                        <CashierExpenses expenses={expenses} addExpense={addExpense} />
                      )}
                    </div>
                    <div className="hidden md:flex">
                      <OrderPanel
                        selectedTable={selectedTable}
                        orders={orders}
                        itemNotes={itemNotes}
                        tableNotes={tableNotes}
                        updateQuantity={updateQuantity}
                        clearTable={clearTable}
                        processPayment={processPaymentAndOrders}
                        openTableNoteDialog={openTableNoteDialog}
                        openItemNoteDialog={openItemNoteDialog}
                        openChangeTableDialog={() => setShowChangeTableDialog(true)}
                        handlePrint={(type) => processPaymentAndOrders({}, type)}
                        quickDiscountOptions={quickDiscountOptions}
                        bankSettings={bankSettings}
                        banks={banks}
                      />
                    </div>
                  </div>
                  {isMobileOrderPanelOpen && <div onClick={() => setIsMobileOrderPanelOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>}
                  <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-transform duration-300 ease-in-out md:hidden ${isMobileOrderPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <OrderPanel
                      selectedTable={selectedTable}
                      orders={orders}
                      itemNotes={itemNotes}
                      tableNotes={tableNotes}
                      updateQuantity={updateQuantity}
                      clearTable={clearTable}
                      processPayment={processPaymentAndOrders}
                      openTableNoteDialog={openTableNoteDialog}
                      openItemNoteDialog={openItemNoteDialog}
                      openChangeTableDialog={() => setShowChangeTableDialog(true)}
                      handlePrint={(type) => processPaymentAndOrders({}, type)}
                      quickDiscountOptions={quickDiscountOptions}
                      bankSettings={bankSettings}
                      banks={banks}
                    />
                  </div>
                </div>
              );
            case 'business_auth':
              return (
                <StaffPinLoginPage
                  staffList={staffList}
                  handleStaffLogin={handleStaffLogin}
                  handleBusinessLogout={handleBusinessLogout}
                />
              );
            case 'logged_out':
            default:
              return (
                <LoginPage
                  loginEmail={loginEmail}
                  setLoginEmail={setLoginEmail}
                  loginPassword={loginPassword}
                  setLoginPassword={setLoginPassword}
                  handleLogin={handleLogin}
                  handleAdminLogin={handleAdminLogin}
                />
              );
          }
        // })()} // Đóng khối IIFE
      })()}

      <div className="absolute top-4 right-4 space-y-3 z-50">
        {notifications.map(n => (
          <div key={n.id} className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-lg shadow-lg flex items-center gap-3">
            <AlertCircle />
            <p>{n.message}</p>
            <button onClick={() => removeNotification(n.id)} className="ml-auto"><X size={18} /></button>
          </div>
        ))}
      </div>

      {/* This is the hidden component that will be printed */}
      <div className="print-container-wrapper" style={{ display: receiptToPrint ? 'block' : 'none' }}>
        <PrintReceipt ref={componentRef} receiptData={receiptToPrint} />
      </div>

      {showNoteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-main rounded-2xl p-6 m-4 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-primary-headline mb-4">
              {currentNoteType === 'table' ? 'Ghi chú đơn hàng' : 'Ghi chú món ăn'}
            </h3>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Nhập ghi chú..."
              className="w-full h-24 p-3 rounded-xl bg-primary-secondary text-primary-headline resize-none focus:ring-2 focus:ring-primary-highlight shadow-md"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleNoteSubmit}
                className="flex-1 bg-primary-button text-primary-main py-2 rounded-xl font-bold shadow-md"
              >
                Lưu
              </button>
              <button
                onClick={() => { setShowNoteDialog(false); setNoteInput(''); }}
                className="flex-1 bg-primary-secondary text-primary-button py-2 rounded-xl font-bold shadow-md"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {showChangeTableDialog && selectedTable && (
        <ChangeTableDialog
          tables={tables}
          orders={orders}
          currentTable={selectedTable}
          onClose={() => setShowChangeTableDialog(false)}
          onTableSelect={handleChangeTable}
        />
      )}
    </>
  );
}

export default App;