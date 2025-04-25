import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AddItem from './AddItem';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import invoiceSlice from '../redux/invoiceSlice';
import { clients } from '../data/clients'; 
import {
  validateSenderStreetAddress,
  validateSenderPostCode,
  validateSenderCity,
  validateClientEmail,
  validateClientName,
  validateClientCity,
  validateClientPostCode,
  validateClientStreetAddress,
  validateItemCount,
  validateItemName,
  validateItemPrice,
  validateSenderCountry,
  validateClientCountry
} from '../functions/createInvoiceValidator';


function CreateInvoice({ openCreateInvoice, setOpenCreateInvoice, invoice, type }) {
  const dispatch = useDispatch();
  const [currency, setCurrency] = useState('USD');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValidatorActive, setIsValidatorActive] = useState(false);
  const [filterValue, setFilterValue] = useState('');

  const deliveryTimes = [
    { text: 'Next 1 day', value: 1 },
    { text: 'Next 7 day', value: 7 },
    { text: 'Next 14 day', value: 14 },
    { text: 'Next 30 day', value: 30 },
  ];

  const [senderStreet, setSenderStreet] = useState('');
  const [senderCity, setSenderCity] = useState('');
  const [senderPostCode, setSenderPostCode] = useState('');
  const [senderCountry, setSenderCountry] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientPostCode, setClientPostCode] = useState('');
  const [clientCountry, setClientCountry] = useState('');
  const [description, setDescription] = useState('');
  const [selectDeliveryDate, setSelectDeliveryDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState(deliveryTimes[0].value);
  const [item, setItem] = useState([{ name: "", quantity: 1, price: 0, usage: 0, total: 0, id: uuidv4(), currency: currency }]);
  const [invoiceNumber, setInvoiceNumber] = useState('');




  const onDelete = (id) => {
    setItem(prev => prev.filter(el => el.id !== id));
  };

  const handleOnChange = (id, e) => {
    const { name, value } = e.target;
  
    const updatedItems = item.map((i) =>
      i.id === id
        ? {
            ...i,
            [name]: ['quantity', 'price', 'usage'].includes(name)
              ? parseFloat(value)
              : value,
            total: (
              (name === 'usage' ? parseFloat(value) : i.usage || 0) *
              (name === 'price' ? parseFloat(value) : i.price || 0)
            ).toFixed(2),
          }
        : i
    );
    setItem(updatedItems);
  };
  
  
  const onSubmit = () => {
    const payload = {
      description,
      paymentTerms,
      clientName,
      clientEmail,
      senderStreet,
      senderCity,
      senderPostCode,
      senderCountry,
      clientStreet,
      clientPostCode,
      clientCountry,
      item,
      currency,
      invoiceNumber,
    };

    if (type === 'edit') {
      dispatch(invoiceSlice.actions.editInvoice({ ...payload, id: invoice.id }));
    } else {
      dispatch(invoiceSlice.actions.addInvoice(payload));
      dispatch(invoiceSlice.actions.filterInvoice({ status: filterValue }));
    }
    setOpenCreateInvoice(false);
  };

  useEffect(() => {
    if (type === 'edit' && isFirstLoad) {
      setClientName(invoice.clientName);
      setClientEmail(invoice.clientEmail);
      setPaymentTerms(invoice.paymentTerms);
      setDescription(invoice.description);
      setSenderStreet(invoice.senderAddress.street);
      setSenderCity(invoice.senderAddress.city);
      setSenderPostCode(invoice.senderAddress.postCode);
      setSenderCountry(invoice.senderAddress.country);
      setClientStreet(invoice.clientAddress.street);
      setClientCity(invoice.clientAddress.city);
      setClientPostCode(invoice.clientAddress.postCode);
      setClientCountry(invoice.clientAddress.country);
      const itemsWithId = invoice.items.map((obj) => ({ ...obj, id: uuidv4() }));
      setItem(itemsWithId);
      setCurrency(invoice.currency || 'USD');
      setIsFirstLoad(false);
      setInvoiceNumber(invoice.invoiceNumber || '');
    }
  }, [invoice, isFirstLoad, type]);

  const itemsValidator = () => {
    return item.every(i =>
      validateItemName(i.name) &&
      validateItemCount(i.quantity) &&
      validateItemPrice(i.price)
    );
  };

  const validator = () => (
    invoiceNumber.trim() !== '' &&
    validateSenderStreetAddress(senderStreet) &&
    validateSenderPostCode(senderPostCode) &&
    validateSenderCity(senderCity) &&
    validateSenderCountry(senderCountry) &&
    validateClientName(clientName) &&
    validateClientEmail(clientEmail) &&
    validateClientStreetAddress(clientStreet) &&
    validateClientCity(clientCity) &&
    validateClientPostCode(clientPostCode) &&
    validateClientCountry(clientCountry) &&
    itemsValidator()
  );

  return (
    <div onClick={e => e.target === e.currentTarget && setOpenCreateInvoice(false)} className='fixed inset-0 bg-[#000005be]'>
      <motion.div
        key='createInvoice-sidebar'
        initial={{ x: -500, opacity: 0 }}
        animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 40, duration: .4 } }}
        exit={{ x: -700, transition: { duration: .2 } }}
        className='scrollbar-hide flex flex-col dark:text-white dark:bg-[#141625] bg-white md:pl-[150px] py-16 px-6 h-screen md:w-[768px] md:rounded-r-3xl'
      >
        <h1 className='font-semibold dark:text-white text-3xl mb-6'>
          {type === 'edit' ? 'Edit' : 'Create'} Invoice
        </h1>

        <div className='overflow-y-scroll scrollbar-hide mb-8 space-y-6'>
          {/* Bill To */}
          <div>
            <h2 className='text-[#7c5dfa] mb-2 font-medium'>Bill To</h2>
            {/* Dropdown Client */}
            <div className='col-span-3 mb-4'>
              <label className='text-gray-400 block mb-1'>Choose Saved Client</label>
              <select
                onChange={e => {
                  const selected = clients.find(c => c.name === e.target.value);
                  if (selected) {
                    setClientName(selected.name);
                    setClientStreet(selected.street);
                    setClientCity(selected.city);
                    setClientPostCode(selected.postCode);
                    setClientCountry(selected.country);
                  }
                }}
                className='w-full py-2 px-4 border rounded border-gray-300'
              >
                <option value="">Select a Client</option>
                {clients.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-3'>
                <label className='text-gray-400 block mb-1'>Client Name</label>
                <input
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className={`w-full py-2 px-4 border rounded ${isValidatorActive && !validateClientName(clientName) ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              <div className='col-span-3'>
                <label className='text-gray-400 block mb-1'>Street Address</label>
                <input
                  value={clientStreet}
                  onChange={e => setClientStreet(e.target.value)}
                  className={`w-full py-2 px-4 border rounded ${isValidatorActive && !validateClientStreetAddress(clientStreet) ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className='text-gray-400 block mb-1'>Post Code</label>
                <input
                  value={clientPostCode}
                  onChange={e => setClientPostCode(e.target.value)}
                  className={`w-full py-2 px-4 border rounded ${isValidatorActive && !validateClientPostCode(clientPostCode) ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              <div>
                <label className='text-gray-400 block mb-1'>Country</label>
                <input
                  value={clientCountry}
                  onChange={e => setClientCountry(e.target.value)}
                  className={`w-full py-2 px-4 border rounded ${isValidatorActive && !validateClientCountry(clientCountry) ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              <div className="mb-6">
              <label className="text-gray-400 block mb-1">Invoice Number</label>
              <input
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className={`w-full py-2 px-4 border rounded ${
                  isValidatorActive && invoiceNumber.trim() === '' ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. INV-2025-001"
              />
            </div>
            </div>
          </div>

          {/* Other Form Fields */}

          {/* Item List */}
          <div>
            <h2 className='text-gray-500 text-2xl mb-2'>Item List</h2>
            {item.map((itemDetails, idx) => (
              <div key={itemDetails.id} className='border-b pb-2 mb-4'>
                <AddItem
                  itemDetails={itemDetails}
                  handleOnChange={handleOnChange}
                  onDelete={onDelete}
                  isValidatorActive={isValidatorActive}
                />
              </div>
            ))}
            <button
              onClick={() => setItem(prev => [...prev, { name: "", quantity: 1, price: 0, total: 0, id: uuidv4() }])}
              className='w-full py-2 rounded bg-gray-200 dark:bg-[#252945] text-center hover:opacity-80'
            >
              + Add New Item
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className='flex justify-between'>
          <button
            onClick={() => setOpenCreateInvoice(false)}
            className='px-8 py-4 rounded bg-gray-200 dark:bg-[#252945] hover:opacity-80'
          >
            Discard
          </button>
          <button
            onClick={() => {
              setIsValidatorActive(true);
              if (validator()) onSubmit();
            }}
            className='px-8 py-4 rounded bg-[#7c5dfa] text-white hover:opacity-80'
          >
            Save & Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateInvoice;
