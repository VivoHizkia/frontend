import React, { useState } from 'react';
import { formatCurrency } from '../functions/formatCurrency';
import { FaFileInvoice, FaCalendarAlt, FaMoneyBillWave, FaLink, FaUser } from 'react-icons/fa';
import VoidModal from './VoidModal'; 
import { useDispatch } from 'react-redux';
import { updatePaymentStatus } from '../redux/paymentSlice';

function PaymentCard({ payment, onVoid }) {
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false); 
  const [isVoid, setIsVoid] = useState(payment.isVoid); 
  const dispatch = useDispatch();

  const handleVoidClick = () => {
    setIsVoidModalOpen(true); 
  };

  const onVoidButtonClick = () => {
    if (typeof onVoid === 'function') {
      onVoid(payment.id, !isVoid); 
      setIsVoid(!isVoid); 
    } else {
      console.error('onVoid is not a function');
      dispatch(updatePaymentStatus({ id: payment.id, isVoid: !isVoid }));
      setIsVoid(!isVoid);
    }
    setIsVoidModalOpen(false); 
  };

  return (
    <div
      className={`relative bg-white dark:bg-[#1E2139] rounded-lg shadow-md p-6 flex flex-col space-y-6 ${
        isVoid ? 'opacity-50 bg-gray-200 dark:bg-gray-700 border-red-500' : ''
      }`}
    >
      {/* Void Badge */}
      {isVoid && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          VOID
        </div>
      )}

      {/* Client Name */}
      <div className="flex items-center space-x-2">
        <FaUser className="text-gray-500 dark:text-gray-400" />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Client Name</p>
          <p className="font-semibold text-gray-800 dark:text-white">{payment.clientName}</p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <FaFileInvoice className="text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Number</p>
            <p className="font-semibold text-gray-800 dark:text-white">{payment.invoiceNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendarAlt className="text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
            <p className="font-semibold text-gray-800 dark:text-white">{payment.paymentDate}</p>
          </div>
        </div>
      </div>

      {/* Amount Paid */}
      <div className="flex items-center space-x-2">
        <FaMoneyBillWave className="text-green-500" />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
          <p className="font-bold text-lg text-green-600 dark:text-green-400">
            {formatCurrency(payment.amountPaid, payment.currency)}
          </p>
        </div>
      </div>

      {/* Proof of Transfer */}
      <div className="flex items-center space-x-2">
        <FaLink className="text-blue-500" />
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Proof of Transfer</p>
          <a
            href={payment.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            title="Click to view proof of transfer"
          >
            View Proof
          </a>
        </div>
      </div>

      {/* Void/Unvoid Button */}
      <button
        onClick={handleVoidClick}
        className={`mt-4 px-4 py-2 rounded ${
          isVoid ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-red-500 text-white hover:bg-red-600'
        }`}
      >
        {isVoid ? 'Unvoid Payment' : 'Void Payment'}
      </button>

      {/* Void Modal */}
      {isVoidModalOpen && (
        <VoidModal
          invoice={payment} 
          status={isVoid ? 'unvoid' : 'void'} 
          onVoidButtonClick={onVoidButtonClick}
          setIsVoidModalOpen={setIsVoidModalOpen}
        />
      )}
    </div>
  );
}

export default PaymentCard;