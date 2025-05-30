import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import arrowDown from '../assets/icon-arrow-down.svg'
import plus from '../assets/plus.png'
import InvoiceCard from './InvoiceCard'
import { useDispatch, useSelector } from 'react-redux'
import invoiceSlice from '../redux/invoiceSlice'
import CreateInvoice from './CreateInvoice'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'  // Import Sidebar component

function Center() {
    const location = useLocation()
    const controls = useAnimation()
    const dispatch = useDispatch()
    const filter = ['paid', 'pending', 'draft']
    const [isDropdown, setIsDropdown] = useState(false)
    const [openCreateInvoice, setOpenCreateInvoice] = useState(false)
    const [filterValue, setfilterValue] = useState('')
    const [selectedMenu, setSelectedMenu] = useState('dashboard')  // Default to dashboard

    const invoices = useSelector((state) => state.invoices.filteredInvoice)
    const allInvoices = useSelector((state) => state.invoices.allInvoice)  // To get all invoices for dashboard summary

    useEffect(() => {
        dispatch(invoiceSlice.actions.filterInvoice({ status: filterValue }))
    }, [filterValue, dispatch])

    useEffect(() => {
        controls.start({
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 20
            }
        })
    }, [controls])

    const transition = { stiffness: 200 }

    const varients = {
        open: { opacity: 1, x: -20, duration: 200, transition },
        close: { opacity: 0, x: -100, duration: 500, transition }
    }

    // === Hitung Total Piutang per Klien ===
    const piutangPerKlien = allInvoices
        .filter(inv => inv.status === 'pending' || inv.status === 'unpaid')  // Memastikan status 'pending' dan 'unpaid' dihitung
        .reduce((acc, curr) => {
            const client = curr.clientName || 'Unknown'
            const total = (curr.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0)
            acc[client] = (acc[client] || 0) + total
            return acc
        }, {})

    // === Render berdasarkan selectedMenu ===
    let content
    if (selectedMenu === 'dashboard') {
        content = (
            <div className='mt-6 bg-white dark:bg-[#1E2139] rounded-lg p-4 shadow-md'>
                <h2 className='text-lg font-semibold dark:text-white mb-3'>Total Piutang per Klien</h2>
                {Object.keys(piutangPerKlien).length > 0 ? (
                    <ul className='space-y-2'>
                        {Object.entries(piutangPerKlien).map(([client, total]) => (
                            <li key={client} className='text-sm text-gray-700 dark:text-gray-200 flex justify-between'>
                                <span>{client}</span>
                                <span className='font-medium'>Rp {total.toLocaleString('id-ID')}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-gray-500 dark:text-gray-400 text-sm'>Tidak ada piutang saat ini.</p>
                )}
            </div>
        )
    } else if (selectedMenu === 'invoices') {
        content = (
            <div className='mt-10 overflow-x-auto rounded-lg shadow-md'>
                <table className="min-w-full bg-white dark:bg-[#1E2139] rounded-lg">
                    <thead className="bg-gray-100 dark:bg-[#252945] text-sm text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className='text-left py-4 px-6'>Invoice ID</th>
                            <th className='text-left py-4 px-6'>Due Date</th>
                            <th className='text-left py-4 px-6'>Client</th>
                            <th className='text-right py-4 px-6'>Total</th>
                            <th className='text-center py-4 px-6'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {invoices.map((invoice, index) => (
                                <motion.tr
                                    key={invoice.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <InvoiceCard invoice={invoice} />
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        )
    } else if (selectedMenu === 'payments') {
        const paidInvoices = allInvoices.filter(inv => inv.status === 'paid')
        content = (
            <div className='mt-10 space-y-4'>
                <table className="min-w-full bg-white dark:bg-[#1E2139] rounded-lg">
                    <thead className="bg-gray-100 dark:bg-[#252945] text-sm text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className='text-left py-4 px-6'>Invoice ID</th>
                            <th className='text-left py-4 px-6'>Due Date</th>
                            <th className='text-left py-4 px-6'>Client</th>
                            <th className='text-right py-4 px-6'>Total</th>
                            <th className='text-center py-4 px-6'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paidInvoices.map((invoice, index) => (
                                <motion.tr
                                    key={invoice.id}
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.2 } }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <InvoiceCard invoice={invoice} />
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className="flex">
            {/* Sidebar Section */}
            <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />

            {/* Main Content Section */}
            <div className='dark:bg-[#141625] scrollbar-hide duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-12 lg:py-[72px] w-full'>
                <motion.div
                    key={location.pathname}
                    initial={{ x: '0' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-150%' }}
                    transition={{ duration: 0.5 }}
                    className='max-w-3xl flex flex-col mx-auto my-auto'>

                    {/* Center Header */}
                    <div className='min-w-full max-h-[64px] flex items-center justify-between'>
                        <div>
                            <h1 className='lg:text-4xl md:text-2xl text-xl dark:text-white tracking-wide font-semibold'>
                                {selectedMenu === 'dashboard' ? 'Dashboard' : selectedMenu === 'invoices' ? 'Invoices' : 'Payments'}
                            </h1>
                            <p className='text-gray-500 font-light'>
                                {selectedMenu === 'dashboard' ? `Total Piutang per Klien` : `${invoices.length} total invoices.`}
                            </p>
                        </div>

                        {selectedMenu !== 'dashboard' && (
                            <div className='flex max-h-full items-center'>
                                <div className='flex items-center'>
                                    <p className='hidden md:block dark:text-white font-medium'>Filter by status</p>
                                    <p className='md:hidden dark:text-white font-medium'>Filter</p>
                                    <div onClick={() => { setIsDropdown((state) => !state) }} className='cursor-pointer ml-3'>
                                        <motion.img src={arrowDown} animate={isDropdown ? { transition, rotate: -180 } : { transition, rotate: 0 }} />
                                    </div>
                                </div>

                                {isDropdown &&
                                    <motion.div
                                        as='select'
                                        variants={varients}
                                        animate={isDropdown ? "open" : "close"}
                                        className='w-40 bg-white dark:bg-[#1E2139] dark:text-white flex px-6 py-4 flex-col top-[160px] lg:top-[120px] absolute shadow-2xl rounded-xl space-y-2'
                                    >
                                        {filter.map((item, i) => (
                                            <div key={i} onClick={() => { item === filterValue ? setfilterValue('') : setfilterValue(item) }} className='items-center cursor-pointer flex space-x-2'>
                                                <input value={item} checked={filterValue === item ? true : false} type='checkbox' className='accent-[#7c5dfa] hover:accent-[#7c5dfa]' />
                                                <p>{item}</p>
                                            </div>
                                        ))}
                                    </motion.div>}

                                <button onClick={() => setOpenCreateInvoice(true)} className='hover:opacity-80 ml-4 md:ml-10 flex items-center py-2 px-2 md:space-x-3 space-x-2 bg-[#7c5dfa] rounded-full'>
                                    <img src={plus} alt="" />
                                    <p className='md:block hidden text-white font-semibold text-lg'>New invoice</p>
                                    <p className='md:hidden block text-white font-semibold text-base'>New</p>
                                </button>
                            </div>
                        )}

                    </div>

                    {/* === Render Content Dynamically === */}
                    {content}
                </motion.div>
            </div>

            <AnimatePresence>
                {openCreateInvoice &&
                    <CreateInvoice openCreateInvoice={openCreateInvoice} setOpenCreateInvoice={setOpenCreateInvoice} />
                }
            </AnimatePresence>
        </div>
    )
}

export default Center
