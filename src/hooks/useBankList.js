// src/hooks/useBankList.js
import { useState, useEffect } from 'react';

const useBankList = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('https://api.vietqr.io/v2/banks');
        const result = await response.json();
        if (result.code === '00' && Array.isArray(result.data)) {
          setBanks(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch bank list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  return { banks, loading };
};

export default useBankList;