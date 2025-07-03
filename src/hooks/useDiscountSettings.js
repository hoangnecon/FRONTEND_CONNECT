// src/hooks/useDiscountSettings.js
import { useState, useEffect } from 'react';

const defaultDiscounts = [
  { id: 1, type: 'percent', value: 10, label: '10%' },
  { id: 2, type: 'percent', value: 20, label: '20%' },
  { id: 3, type: 'amount', value: 50000, label: '50k' },
  { id: 4, type: 'amount', value: 100000, label: '100k' },
];

const useDiscountSettings = () => {
  const [quickDiscountOptions, setQuickDiscountOptions] = useState(() => {
    try {
      const savedOptions = localStorage.getItem('quickDiscountOptions');
      return savedOptions ? JSON.parse(savedOptions) : defaultDiscounts;
    } catch {
      return defaultDiscounts;
    }
  });

  useEffect(() => {
    localStorage.setItem('quickDiscountOptions', JSON.stringify(quickDiscountOptions));
  }, [quickDiscountOptions]);

  const addDiscountOption = (option) => {
    if (quickDiscountOptions.length < 4) {
      const newOption = { ...option, id: Date.now() };
      setQuickDiscountOptions([...quickDiscountOptions, newOption]);
    } else {
      alert('Chỉ có thể có tối đa 4 gợi ý giảm giá.');
    }
  };

  const updateDiscountOption = (id, updatedOption) => {
    setQuickDiscountOptions(
      quickDiscountOptions.map((opt) => (opt.id === id ? { ...opt, ...updatedOption } : opt))
    );
  };

  const deleteDiscountOption = (id) => {
    setQuickDiscountOptions(quickDiscountOptions.filter((opt) => opt.id !== id));
  };

  return {
    quickDiscountOptions,
    addDiscountOption,
    updateDiscountOption,
    deleteDiscountOption,
  };
};

export default useDiscountSettings;