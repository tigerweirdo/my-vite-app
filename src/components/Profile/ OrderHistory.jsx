import  { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';  // Import PropTypes


const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/user/${userId}`); // Adjust API endpoint
        setOrders(response.data); // Set orders data from API
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div>
      {orders.map((order) => (
        <div key={order._id}>
          {/* Display order details */}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
OrderHistory.propTypes = {
    userId: PropTypes.string.isRequired, // Validate userId prop
  };