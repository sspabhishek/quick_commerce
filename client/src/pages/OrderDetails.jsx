import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";

const OrderDetails = () => {
    const { orderId } = useParams()
    const user = useSelector(state => state.user)
    const orders = useSelector(state => state.orders.order)
    const [orderDetails, setOrderDetails] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (orders) {
            const findOrder = orders.find(order => order._id === orderId)
            setOrderDetails(findOrder)
        }
    }, [orders, orderId])

    if (!orderDetails) {
        return <div className='p-4'>Loading or Order Not Found...</div>
    }

    const { delivery_address, product_details, totalAmt, subTotalAmt, orderId: displayOrderId, createdAt, payment_status } = orderDetails
    const date = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })

    return (
        <div className='bg-gray-50 min-h-screen pb-10'>
            {/* Header */}
            <div className='bg-white shadow-sm p-4 mb-4 sticky top-0 z-10 flex items-center gap-4'>
                <button onClick={() => navigate(-1)} className='text-gray-600 hover:text-gray-900'>
                    <IoArrowBack size={24} />
                </button>
                <h1 className='text-lg font-bold text-gray-800'>Order Details</h1>
            </div>

            <div className='max-w-2xl mx-auto px-4 flex flex-col gap-4'>
                {/* Order Summary Card */}
                <div className='bg-white rounded-lg shadow-sm p-4 border border-gray-100'>
                    <div className='flex justify-between items-center mb-4 border-b border-gray-100 pb-3'>
                        <div>
                            <p className='text-xs text-gray-500 uppercase tracking-wide font-semibold'>Order ID</p>
                            <p className='font-bold text-gray-800'>{displayOrderId}</p>
                        </div>
                        <div className='text-right'>
                            <p className='text-xs text-gray-500 uppercase tracking-wide font-semibold'>Date</p>
                            <p className='text-sm text-gray-800'>{date}</p>
                        </div>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-600'>Status</span>
                        <span className='px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase'>
                            {payment_status === 'paid' ? 'Delivered' : payment_status}
                        </span>
                    </div>
                </div>

                {/* Items */}
                <div className='bg-white rounded-lg shadow-sm p-4 border border-gray-100'>
                    <h2 className='font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide'>Items in this Order</h2>
                    <div className='flex gap-4 items-center'>
                        <div className='relative flex-shrink-0'>
                            <img
                                src={product_details.image[0]}
                                className='w-16 h-16 object-cover rounded-md border border-gray-200'
                                alt={product_details.name}
                            />
                        </div>

                        <div className='flex-1 min-w-0'>
                            <h3 className='text-sm font-semibold text-gray-800'>
                                {product_details.name}
                            </h3>
                            <p className='text-sm font-bold text-gray-900 mt-1'>₹{subTotalAmt}</p>
                            {/* Note: If quantity exists in data, display it here */}
                        </div>
                    </div>
                </div>

                {/* Bill Details */}
                <div className='bg-white rounded-lg shadow-sm p-4 border border-gray-100'>
                    <h2 className='font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide'>Bill Details</h2>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-gray-600'>Item Total</span>
                        <span className='text-sm font-medium text-gray-800'>₹{subTotalAmt}</span>
                    </div>
                    {/* Placeholder for delivery charge if available */}
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-gray-600'>Delivery Charge</span>
                        <span className='text-sm font-medium text-green-600'>Free</span>
                    </div>
                    <div className='border-t border-gray-100 my-2 pt-2 flex justify-between items-center'>
                        <span className='font-bold text-gray-800'>Bill Total</span>
                        <span className='font-bold text-gray-800'>₹{totalAmt}</span>
                    </div>
                </div>

                {/* Address Details */}
                {delivery_address && (
                    <div className='bg-white rounded-lg shadow-sm p-4 border border-gray-100'>
                        <h2 className='font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide'>Delivery Address</h2>
                        <div className='text-sm text-gray-600 leading-relaxed'>
                            <p className='font-semibold text-gray-800 mb-1'>{user.name || "User"}</p>
                            <p>{delivery_address.address_line}</p>
                            <p>{delivery_address.city}, {delivery_address.state} - {delivery_address.pincode}</p>
                            {delivery_address.mobile && <p className='mt-1'>Mobile: {delivery_address.mobile}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderDetails
