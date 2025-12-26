import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NoData from '../components/NoData'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)

  console.log("order Items", orders)

  // Group orders by orderGroupId, then paymentId, then createdAt
  const groupedOrders = React.useMemo(() => {
    if (!orders) return [];

    const groups = orders.reduce((acc, order) => {
      // Priority 1: orderGroupId (Newest Backend Code)
      // Priority 2: paymentId (Stripe orders share this)
      // Priority 3: createdAt (Batch insertions happen at identical timestamps)
      let groupKey = order.orderGroupId;

      if (!groupKey) {
        if (order.paymentId) {
          groupKey = order.paymentId;
        } else {
          // Fallback to timestamp for COD if missing Group ID
          groupKey = new Date(order.createdAt).toISOString();
        }
      }

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(order);
      return acc;
    }, {});

    // Convert to array and sort by date (newest first)
    return Object.values(groups).sort((a, b) =>
      new Date(b[0].createdAt) - new Date(a[0].createdAt)
    );
  }, [orders]);

  return (
    <div className='bg-gray-50 min-h-screen pb-10'>
      <div className='bg-white shadow-sm p-4 mb-4 sticky top-0 z-10'>
        <h1 className='text-lg font-bold text-gray-800 text-center'>My Orders</h1>
      </div>

      <div className='max-w-4xl mx-auto px-4 flex flex-col gap-4'>
        {
          groupedOrders.length === 0 && (
            <div className='flex flex-col items-center justify-center p-10'>
              <NoData />
              <p className='text-gray-500 mt-4'>No orders found</p>
            </div>
          )
        }
        {
          groupedOrders.map((group, index) => {
            const firstItem = group[0];
            const date = new Date(firstItem.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Calculate Order Total manually if backend data is old/missing 
            // (Current backend fix puts Order Total in firstItem.totalAmt, but old code had Item Total)
            // We sum it up here just in case to be safe and accurate for the view.
            const calculatedTotal = group.reduce((sum, item) => sum + (item.totalAmt || 0), 0);

            // Use the backend's total if it looks like an "Order Total" (significantly larger than sum? No, hard to tell).
            // Safer heuristic: If we have orderGroupId, trust totalAmt. If not, maybe sum it?
            // Actually, if orderGroupId is missing, totalAmt is per item. So we MUST sum it.
            // If orderGroupId is present, totalAmt is already Order Total.
            // Let's just sum it if orderGroupId is missing.
            const displayTotal = firstItem.orderGroupId ? firstItem.totalAmt : calculatedTotal;

            const isDelivered = firstItem.payment_status === 'paid' || firstItem.payment_status === 'CASH ON DELIVERY';

            return (
              <div key={firstItem.orderGroupId || firstItem._id + index} className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow'>

                {/* Header Section */}
                <div className='p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className={`w-2 h-2 rounded-full ${isDelivered ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      <h3 className='font-bold text-gray-800 text-sm sm:text-base'>
                        Order #{firstItem.orderId?.slice(-6).toUpperCase()}
                      </h3>
                    </div>
                    <p className='text-xs text-gray-500 mt-1 ml-4'>{date}</p>
                  </div>

                  <div className='flex items-center gap-3 ml-4 sm:ml-0'>
                    <p className='font-bold text-gray-900'>₹{displayTotal}</p>
                  </div>
                </div>

                {/* Content Section - Grid of Images */}
                <div className='p-4'>
                  <div className='flex gap-4 overflow-hidden'>
                    {/* Show up to 4 distinct items, then +N more */}
                    {group.slice(0, 4).map((item, idx) => (
                      <div key={item._id + idx} className='flex-shrink-0 flex flex-col w-20 gap-2'>
                        <div className='w-20 h-20 rounded-lg border border-gray-100 p-2 bg-gray-50 flex items-center justify-center'>
                          <img
                            src={item.product_details.image[0]}
                            className='max-w-full max-h-full object-contain mix-blend-multiply'
                            alt={item.product_details.name}
                          />
                        </div>
                        <p className='text-[10px] text-gray-600 truncate text-center leading-tight'>
                          {item.product_details.name}
                        </p>
                      </div>
                    ))}
                    {group.length > 4 && (
                      <div className='w-20 h-20 flex items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-500 font-bold text-sm'>
                        +{group.length - 4} More
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Section */}
                <div className='bg-gray-50 p-3 sm:px-4 flex justify-between items-center'>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                    {firstItem.payment_status}
                  </span>
                  <Link
                    to={`/dashboard/order-detail/${firstItem._id}`}
                    className='text-green-600 text-sm font-semibold hover:text-green-700 flex items-center gap-1 transition-colors'
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
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
