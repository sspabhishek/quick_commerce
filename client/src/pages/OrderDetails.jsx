import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";

const OrderDetails = () => {
    const { orderId } = useParams()
    const user = useSelector(state => state.user)
    const orders = useSelector(state => state.orders.order)
    const [orderGroup, setOrderGroup] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (orders) {
            const primaryOrder = orders.find(order => order._id === orderId)

            if (primaryOrder) {
                // Find all orders in the same group
                const group = orders.filter(order => {
                    if (primaryOrder.orderGroupId) {
                        return order.orderGroupId === primaryOrder.orderGroupId;
                    } else if (primaryOrder.paymentId) {
                        return order.paymentId === primaryOrder.paymentId;
                    } else {
                        // Fallback for old COD orders: strict timestamp matching
                        return order.createdAt === primaryOrder.createdAt;
                    }
                });
                setOrderGroup(group);
            }
        }
    }, [orders, orderId])

    if (!orderGroup.length) {
        return <div className='p-4'>Loading or Order Not Found...</div>
    }

    const firstItem = orderGroup[0]
    const { delivery_address, totalAmt, orderId: displayOrderId, createdAt, payment_status } = firstItem

    // Calculate total explicitly if needed, but backend totalAmt should be Order Total now.
    // However, if orderGroupId is missing (old data), totalAmt is per item.
    // If we have legacy data, we sum it up.
    let displayTotal = totalAmt;
    let itemTotal = 0;

    orderGroup.forEach(item => {
        itemTotal += item.subTotalAmt;
    });

    if (!firstItem.orderGroupId) {
        displayTotal = itemTotal; // For legacy data, order total is sum of parts
    }

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
                            <p className='font-bold text-gray-800'>
                                {firstItem.orderGroupId ?
                                    firstItem.orderId?.slice(-6).toUpperCase() : // Use the first item's ID as representative 
                                    displayOrderId?.slice(-6).toUpperCase()
                                }
                            </p>
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

                {/* Items List */}
                <div className='bg-white rounded-lg shadow-sm p-4 border border-gray-100'>
                    <h2 className='font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide'>Items in this Order</h2>

                    <div className='flex flex-col gap-4'>
                        {orderGroup.map((item, index) => (
                            <div key={item._id + index} className='flex gap-4 items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0'>
                                <div className='relative flex-shrink-0'>
                                    <img
                                        src={item.product_details.image[0]}
                                        className='w-16 h-16 object-cover rounded-md border border-gray-200'
                                        alt={item.product_details.name}
                                    />
                                </div>

                                <div className='flex-1 min-w-0'>
                                    <h3 className='text-sm font-semibold text-gray-800'>
                                        {item.product_details.name}
                                    </h3>
                                    <p className='text-sm font-bold text-gray-900 mt-1'>₹{item.subTotalAmt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bill Details */}
                <div className='bg-white rounded-lg shadow-sm p-4 border border-gray-100'>
                    <h2 className='font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide'>Bill Details</h2>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-gray-600'>Item Total</span>
                        <span className='text-sm font-medium text-gray-800'>₹{itemTotal}</span>
                    </div>
                    {/* Placeholder for delivery charge if available */}
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-gray-600'>Delivery Charge</span>
                        <span className='text-sm font-medium text-green-600'>Free</span>
                    </div>
                    <div className='border-t border-gray-100 my-2 pt-2 flex justify-between items-center'>
                        <span className='font-bold text-gray-800'>Bill Total</span>
                        <span className='font-bold text-gray-800'>₹{displayTotal}</span>
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
