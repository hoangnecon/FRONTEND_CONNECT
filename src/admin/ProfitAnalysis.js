// src/admin/ProfitAnalysis.js
import React, { useMemo } from 'react';

const ProfitAnalysis = ({ ordersByDate, menuItems }) => {
  const profitData = useMemo(() => {
    const itemsMap = new Map(menuItems.map(item => [item.name, { price: item.price, costPrice: item.costPrice || 0 }]));
    
    let totalRevenue = 0;
    let totalCost = 0;
    const itemProfits = {};

    Object.values(ordersByDate).flat().forEach(order => {
      totalRevenue += order.total;
      order.items.forEach(orderItem => {
        const itemInfo = itemsMap.get(orderItem.name);
        if (itemInfo) {
          const itemCost = itemInfo.costPrice * orderItem.quantity;
          const itemRevenue = orderItem.price * orderItem.quantity;
          totalCost += itemCost;
          if (!itemProfits[orderItem.name]) {
            itemProfits[orderItem.name] = { profit: 0, quantity: 0, image: itemInfo.image };
          }
          itemProfits[orderItem.name].profit += (itemRevenue - itemCost);
          itemProfits[orderItem.name].quantity += orderItem.quantity;
        }
      });
    });

    const totalProfit = totalRevenue - totalCost;

    const topProfitableItems = Object.entries(itemProfits)
      .sort(([, a], [, b]) => b.profit - a.profit)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));

    return { totalRevenue, totalCost, totalProfit, topProfitableItems };
  }, [ordersByDate, menuItems]);

  return (
    <div className="bg-primary-main rounded-3xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-primary-headline mb-4">Phân tích Lợi nhuận</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
            <p className="text-primary-paragraph">Tổng Doanh thu</p>
            <p className="text-2xl font-bold text-green-500">{profitData.totalRevenue.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="text-center">
            <p className="text-primary-paragraph">Tổng Giá vốn</p>
            <p className="text-2xl font-bold text-red-500">{profitData.totalCost.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="text-center">
            <p className="text-primary-paragraph">Lợi nhuận</p>
            <p className="text-2xl font-bold text-blue-500">{profitData.totalProfit.toLocaleString('vi-VN')}đ</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-primary-headline mb-3">Top 5 Món Lời Nhất</h4>
        <div className="space-y-3">
          {profitData.topProfitableItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-primary-secondary rounded-xl">
              <div className="flex items-center gap-3">
                <span className="font-bold">{index + 1}. {item.name}</span>
              </div>
              <span className="font-bold text-green-600">+{item.profit.toLocaleString('vi-VN')}đ</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfitAnalysis;