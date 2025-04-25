import React from 'react';
import { useSelector } from 'react-redux';
import InvoiceCard from './InvoiceCard';

export default function Sidebar({ selectedMenu, onMenuSelect }) {
    const menus = [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'invoices',   label: 'Invoices' },
      { key: 'payments',   label: 'Payments' },
    ]
  
    return (
      <aside className="w-48 bg-white dark:bg-[#1E2139] h-screen shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-6 dark:text-white">Menu</h2>
        <ul className="space-y-4">
          {menus.map(m => (
            <li
              key={m.key}
              onClick={() => onMenuSelect(m.key)}
              className={`cursor-pointer p-2 rounded ${
                selectedMenu === m.key
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2b2c37]'
              }`}
            >
              {m.label}
            </li>
          ))}
        </ul>
      </aside>
    )
  }
