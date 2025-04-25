import React from 'react'
import { Link } from 'react-router-dom'
import PaidStatus from './PaidStatus'
import { formatCurrency } from '../functions/formatCurrency'

function InvoiceCard({ invoice }) {
    return (
        <tr className='hover:bg-gray-50 dark:hover:bg-[#252945] transition-all'>
            <td className='py-4 px-6 font-semibold text-[#7e88c3] dark:text-white'>
                <Link to={`/invoice?id=${invoice.id}`}>#{invoice.id}</Link>
            </td>
            <td className='py-4 px-6 text-sm text-gray-500 dark:text-gray-300'>
                {invoice.paymentDue}
            </td>
            <td className='py-4 px-6 text-sm text-gray-500 dark:text-gray-300'>
                {invoice.clientName}
            </td>
            <td className='py-4 px-6 font-medium text-black dark:text-white text-right'>
                {formatCurrency(invoice.total, invoice.currency || 'USD')}
            </td>
            <td className='py-4 px-6 text-center'>
                <PaidStatus type={invoice.status} />
            </td>
        </tr>
    )
}

export default InvoiceCard
