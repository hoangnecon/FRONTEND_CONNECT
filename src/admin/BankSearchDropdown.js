// src/admin/BankSearchDropdown.js
import React, { useState, useMemo } from 'react';

const BankSearchDropdown = ({ banks, selectedBin, onSelect, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredBanks = useMemo(() => {
    return banks.filter(
      (bank) =>
        bank.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [banks, searchTerm]);

  const selectedBank = banks.find(b => b.bin === selectedBin);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-primary-secondary rounded-xl cursor-pointer flex justify-between items-center"
      >
        <span>{selectedBank ? `${selectedBank.shortName} (${selectedBank.name})` : 'Chọn ngân hàng'}</span>
        <span>▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-primary-main rounded-xl shadow-lg border">
          <div className="p-2">
            <input
              type="text"
              placeholder="Tìm kiếm ngân hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-primary-secondary rounded-lg"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {loading ? (
              <li className="p-2 text-center text-primary-paragraph">Đang tải...</li>
            ) : (
              filteredBanks.map((bank) => (
                <li
                  key={bank.bin}
                  onClick={() => {
                    onSelect(bank.bin);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="p-3 hover:bg-primary-highlight cursor-pointer"
                >
                  {bank.shortName} - {bank.name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BankSearchDropdown;