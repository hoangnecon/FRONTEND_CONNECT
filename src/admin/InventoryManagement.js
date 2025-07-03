import React from 'react';

const InventoryManagement = ({ menuItems, updateItemInventory, orders }) => {
  const handleToggle = (itemId, isEnabled) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      updateItemInventory(itemId, { ...item, inventoryEnabled: isEnabled });
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      const quantity = Math.max(0, parseInt(newQuantity, 10) || 0);
      updateItemInventory(itemId, { ...item, inventoryCount: quantity });
    }
  };
  
  const handleCostChange = (itemId, newCost) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        const cost = parseFloat(newCost) || 0;
        updateItemInventory(itemId, { ...item, costPrice: Math.max(0, cost) });
    }
  };

  const getQuantityInOrders = (itemId) => {
    return Object.values(orders)
      .flat()
      .reduce((total, orderItem) => {
        if (orderItem.id === itemId) {
          return total + orderItem.quantity;
        }
        return total;
      }, 0);
  };

  return (
    <div className="bg-primary-main rounded-3xl p-4 md:p-6 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="border-b-2 border-primary-stroke">
            <tr>
              <th className="p-4">Món ăn</th>
              <th className="p-4 text-center">Giá vốn</th>
              <th className="p-4 text-center">Bật/Tắt Tồn Kho</th>
              <th className="p-4 text-center">Số lượng tồn</th>
              <th className="p-4 text-center">Còn lại</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => {
              const inOrders = getQuantityInOrders(item.id);
              const remaining = item.inventoryCount - inOrders;

              return (
                <tr
                  key={item.id}
                  className="border-b border-primary-secondary hover:bg-primary-secondary transition-colors"
                >
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div>
                      <p className="font-bold text-primary-headline">{item.name}</p>
                      <p className="text-sm text-primary-paragraph">{item.category}</p>
                    </div>
                  </td>
                  <td className="p-4">
                     <input
                        type="number"
                        value={item.costPrice || 0}
                        onChange={(e) => handleCostChange(item.id, e.target.value)}
                        className="w-28 p-2 text-center bg-white border border-primary-stroke rounded-lg"
                        />
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggle(item.id, !item.inventoryEnabled)}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none ${
                        item.inventoryEnabled ? 'bg-primary-button' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
                          item.inventoryEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      value={item.inventoryCount || 0}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      disabled={!item.inventoryEnabled}
                      className="w-24 p-2 text-center bg-primary-secondary border border-transparent rounded-lg focus:ring-2 focus:ring-primary-button focus:border-transparent disabled:bg-gray-200 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="p-4 text-center font-bold text-xl">
                    {item.inventoryEnabled ? (
                      <span className={remaining > 0 ? 'text-green-600' : 'text-red-600'}>
                        {remaining}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;