// src/hooks/useDashboardData.js
import { useState, useMemo } from 'react';
import { MOCK_ORDERS_BY_DATE, MOCK_EXPENSES_BY_DATE } from '../data/mockData';

// Helper function to get dates within a range (YYYY-MM-DD format)
const getDatesInDateRange = (startDateStr, rangeType) => {
    const dates = [];
    let currentDate = new Date(startDateStr);

    if (rangeType === 'day') {
        dates.push(startDateStr);
    } else if (rangeType === 'week') {
        const dayOfWeek = (currentDate.getDay() + 6) % 7; // Adjust to make Monday=0, Sunday=6
        currentDate.setDate(currentDate.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else if (rangeType === 'month') {
        currentDate.setDate(1); // Set to the first day of the month
        const month = currentDate.getMonth();
        while (currentDate.getMonth() === month) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    return dates;
};

const useDashboardData = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState('day');
  const [expenses, setExpenses] = useState(MOCK_EXPENSES_BY_DATE);

  const addExpense = (expense) => {
    const { date } = expense;
    setExpenses(prev => {
      const updatedExpenses = { ...prev };
      if (!updatedExpenses[date]) {
        updatedExpenses[date] = [];
      }
      updatedExpenses[date].push(expense);
      return updatedExpenses;
    });
  };

  // Memoize aggregated orders based on selectedDate and dateRange
  const aggregatedOrdersForDisplay = useMemo(() => {
    const datesToConsider = getDatesInDateRange(selectedDate, dateRange);
    let aggregated = [];
    datesToConsider.forEach(date => {
        // Đảm bảo MOCK_ORDERS_BY_DATE[date] luôn là một mảng (hoặc rỗng nếu không có dữ liệu)
        const ordersOnDate = MOCK_ORDERS_BY_DATE[date] || [];
        aggregated = [...aggregated, ...ordersOnDate];
    });
    return aggregated;
  }, [selectedDate, dateRange, MOCK_ORDERS_BY_DATE]);

  return {
    selectedDate,
    setSelectedDate,
    paymentFilter,
    setPaymentFilter,
    MOCK_ORDERS_BY_DATE,
    dateRange,
    setDateRange,
    aggregatedOrdersForDisplay,
    expenses,
    addExpense,
  };
};

export default useDashboardData;