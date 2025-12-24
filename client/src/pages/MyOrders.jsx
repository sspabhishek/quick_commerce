import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NoData from '../components/NoData'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  console.log("order Items", orders)

  return (
    <div className='bg-gray-50 min-h-screen pb-10'>
      <div className='bg-white shadow-sm p-4 mb-4 sticky top-0 z-10'>
        <h1 className='text-lg font-bold text-gray-800 text-center'>My Orders</h1>
      </div>

      <div className='max-w-2xl mx-auto px-4 flex flex-col gap-4'>
        {
          !orders[0] && (
            <div className='flex flex-col items-center justify-center p-10'>
              <NoData />
              <p className='text-gray-500 mt-4'>No orders found</p>
            </div>
          )
        }
        {
          orders.map((order, index) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={order._id + index + "order"} className='bg-white rounded-lg shadow-sm p-4 border border-gray-100'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <p className='font-bold text-gray-800'>Order #{order?.orderId?.slice(-6).toUpperCase()}</p>
                    <p className='text-xs text-gray-500'>{date}</p>
                  </div>
                  <span className='px-2 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full'>
                    {order.payment_status === 'paid' ? 'Delivered' : 'Pending'}
                  </span>
                </div>

                <div className='flex gap-4 items-center'>
                  <div className='relative flex-shrink-0'>
                    <img
                      src={order.product_details.image[0]}
                      className='w-16 h-16 object-cover rounded-md border border-gray-200'
                      alt={order.product_details.name}
                    />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h3 className='text-sm font-semibold text-gray-800 truncate'>
                      {order.product_details.name}
                    </h3>
                    <p className='text-xs text-gray-500 mt-1 truncate'>
                      {/* Assuming logic for other items if multiple, otherwise generic text */}
                      Quality Products
                    </p>
                    <div className='flex items-center justify-between mt-2'>
                      <p className='text-sm font-bold text-gray-900'>₹{order.totalAmt}</p>
                    </div>
                  </div>
                </div>

                <div className='mt-3 pt-3 border-t border-gray-100 flex justify-end'>
                  <Link
                    to={`/dashboard/order-detail/${order._id}`}
                    className='text-green-600 text-sm font-semibold hover:text-green-700 transition-colors'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders
