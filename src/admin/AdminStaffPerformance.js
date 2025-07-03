// src/admin/AdminStaffPerformance.js
import React, { useMemo } from 'react';

const AdminStaffPerformance = ({ staffList, ordersByDate }) => {
  const performanceData = useMemo(() => {
    const allOrders = Object.values(ordersByDate).flat();
    
    return staffList.map(staff => {
      const staffOrders = allOrders.filter(order => order.cashier === staff.name);
      const totalRevenue = staffOrders.reduce((sum, order) => sum + order.total, 0);
      const orderCount = staffOrders.length;
      const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

      return {
        ...staff,
        totalRevenue,
        orderCount,
        averageOrderValue,
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [staffList, ordersByDate]);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-primary-bg">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-headline mb-3">Hiệu suất Nhân viên</h1>
        <p className="text-primary-paragraph text-lg">Theo dõi hiệu suất bán hàng của từng nhân viên.</p>
      </div>
      <div className="bg-primary-main rounded-3xl p-4 md:p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="border-b-2 border-primary-stroke">
              <tr>
                <th className="p-4">Nhân viên</th>
                <th className="p-4 text-right">Tổng Doanh thu</th>
                <th className="p-4 text-right">Số lượng Đơn</th>
                <th className="p-4 text-right">Giá trị Đơn Trung bình</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map(staff => (
                <tr key={staff.id} className="border-b border-primary-secondary">
                  <td className="p-4">
                    <p className="font-bold text-primary-headline">{staff.name}</p>
                    <p className="text-sm text-primary-paragraph">{staff.email}</p>
                  </td>
                  <td className="p-4 text-right font-bold text-green-600">{staff.totalRevenue.toLocaleString('vi-VN')}đ</td>
                  <td className="p-4 text-right font-medium">{staff.orderCount}</td>
                  <td className="p-4 text-right font-medium">{staff.averageOrderValue.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffPerformance;