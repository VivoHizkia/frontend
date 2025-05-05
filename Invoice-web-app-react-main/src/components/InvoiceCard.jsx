import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import invoiceSlice from '../redux/invoiceSlice';
import PaidStatus from './PaidStatus';
import { formatCurrency } from '../functions/formatCurrency';
import { FiEye, FiDownload, FiTrash2 } from 'react-icons/fi';
import VoidModal from './VoidModal';
import DeleteModal from './DeleteModal';

function InvoiceCard({ invoice, onDelete, from }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidStatus, setVoidStatus] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleView = () => {
    navigate(`/invoice?id=${invoice.id}`, { state: { from } });
  };

  const handleDownload = () => {
    navigate(`/invoice?id=${invoice.id}&download=true`, { state: { from } });
  };

  const onVoidButtonClick = () => {
    const newStatus = invoice.status === 'void' ? 'pending' : 'void';
    dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoice.id, status: newStatus }));
    setIsVoidModalOpen(false);
  };

  const handleDelete = (invoiceId) => {
    setDeleteInvoiceId(invoiceId);
    setIsDeleteModalOpen(true);
  };

  if (!invoice) return null;

  // Perhitungan Subtotal, Tax, dan Total
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.usage || 0) * (item.price || 0), 0);
  const taxAmount = (subtotal * (invoice.tax || 0)) / 100;
  const total = subtotal + taxAmount;

  return (
    <>
      <td className="w-1/6 py-4 px-4 font-semibold text-indigo-600 dark:text-white hover:underline cursor-pointer">
        <button onClick={handleView}>{invoice.id}</button>
      </td>

      <td className="w-1/6 py-4 px-4 text-sm text-gray-500 dark:text-gray-300">
        {invoice.paymentDue}
      </td>

      <td className="w-1/6 py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
        {invoice.clientName}
      </td>

      <td className="w-1/6 py-4 px-4 font-medium text-black dark:text-white text-right">
        {formatCurrency(total, invoice.currency || 'USD')}
      </td>

      <td className="w-1/6 py-4 px-4 text-center">
        <PaidStatus type={invoice.status} />
      </td>

      <td className="w-1/6 py-4 px-4 text-center">
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={handleView}
            className="p-2 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
            title="View"
          >
            <FiEye size={16} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900"
            title="Download PDF"
          >
            <FiDownload size={16} />
          </button>

          {/* Delete Button */}
          {user?.role === "admin" && (
            <button
              onClick={() => handleDelete(invoice.id)}
              className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      </td>

      <td className="py-5 px-6 text-center">
        <button
          onClick={() => {
            setVoidStatus(invoice.status === 'void' ? 'unvoid' : 'void');
            setIsVoidModalOpen(true);
          }}
          className={`px-4 py-1 text-sm rounded-full shadow-md text-white transition-all duration-150 ${
            invoice.status === 'void'
              ? 'bg-gray-500 hover:bg-gray-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {invoice.status === 'void' ? 'Unvoid' : 'Void'}
        </button>
      </td>

      {isVoidModalOpen && (
        <VoidModal
          invoice={invoice}
          status={voidStatus}
          onVoidButtonClick={onVoidButtonClick}
          setIsVoidModalOpen={setIsVoidModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          invoiceId={deleteInvoiceId}
          onDeleteButtonClick={() => {
            onDelete(deleteInvoiceId);
          }}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      )}
    </>
  );
}

export default InvoiceCard;
