// src/hooks/useBankSettings.js
import { useState, useEffect } from 'react';

const useBankSettings = () => {
  const [bankSettings, setBankSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('bankSettings');
      return savedSettings
        ? JSON.parse(savedSettings)
        : { bin: '', accountNumber: '', accountName: '' };
    } catch {
      return { bin: '', accountNumber: '', accountName: '' };
    }
  });

  useEffect(() => {
    localStorage.setItem('bankSettings', JSON.stringify(bankSettings));
  }, [bankSettings]);

  return {
    bankSettings,
    setBankSettings,
  };
};

export default useBankSettings;