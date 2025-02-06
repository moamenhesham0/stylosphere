import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./Orders.css";
import { FaTimes } from 'react-icons/fa'; // For the close button icon


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/purchase/all-orders");
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setOrders(data);
                
                // Fetch users after orders are loaded
                const uniqueCustomerIds = [...new Set(data.map(order => order.customerId))];
                for (const customerId of uniqueCustomerIds) {
                    fetchUsers(customerId);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('There was a problem fetching orders:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchProducts = async () => {
            const products = await getBaseList();
            setProducts(products.map(product => ({
                ...product,
                image: product.images && product.images.length > 0 ? product.images : null
            })));
            console.log(products);
        };

        const fetchUsers = async (customerId) => {
            try {
                const response = await fetch(`http://localhost:8080/api/customers/get-user-id?id=${customerId}`);
                if (!response.ok) throw new Error('Failed to fetch user');
                const userData = await response.json();
                setUsers(prev => ({
                    ...prev,
                    [customerId]: userData
                }));
            } catch (error) {
                console.error(`Error fetching user ${customerId}:`, error);
            }
        };

        fetchOrders();
        fetchProducts();
    }, []); // Keep empty dependency array

    const getBaseList = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/all');
            const result = await response.json();
            if (Array.isArray(result)) {
                const processedProducts = result.map(product => ({
                    ...product,
                    images: product.image || [] // Use product.image instead of product.images
                }));
                setProducts(processedProducts);
                return processedProducts;
            } else {
                console.error('Fetched data is not an array:', result);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const groupOrders = (orders) => {
        const grouped = {};
        orders.forEach(order => {
            const key = `${order.customerId}-${order.purchaseDate}`;
            if (!grouped[key]) {
                grouped[key] = {
                    customerId: order.customerId,
                    purchaseDate: order.purchaseDate,
                    items: []
                };
            }
            grouped[key].items.push(order);
        });
        return Object.values(grouped);
    };

    if (loading) {
        return <div className="loading">Loading orders...</div>;
    }

    const deleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://localhost:8080/api/purchase/delete-item?orderId=${orderId}`);
                setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Failed to delete order');
            }
        }
    };

    const deleteOrderGroup = async (orderGroup) => {
        if (window.confirm('Are you sure you want to delete all items in this order?')) {
            try {
                // Delete all items in the group
                for (const order of orderGroup.items) {
                    await axios.delete(`http://localhost:8080/api/purchase/delete-item?orderId=${order.id}`);
                }
                // Update local state by removing all orders in the group
                setOrders(prevOrders => 
                    prevOrders.filter(order => !orderGroup.items.find(item => item.id === order.id))
                );
            } catch (error) {
                console.error('Error deleting order group:', error);
                alert('Failed to delete order group');
            }
        }
    };

    const handleStatusChange = async (orderIds, newStatus) => {
        setStatusUpdating(true);
        try {
            // Update all orders in the group
            for (const orderId of orderIds) {
                await axios.post(
                    `http://localhost:8080/api/purchase/update-status`,
                    null,
                    { params: { orderId, status: newStatus } }
                );
            }
            
            // Update local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    orderIds.includes(order.id)
                        ? { ...order, shipmentStatus: newStatus }
                        : order
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update order status');
        } finally {
            setStatusUpdating(false);
        }
    };

    return (
        <div className="orders-container">
            <h1>Orders</h1>
            <div className="table-container">
                {orders.length === 0 ? (
                    <div className="no-orders">No orders available</div>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Customer Name</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupOrders(orders).map((group, index) => (
                                <tr key={index}>
                                    <td>{group.customerId}</td>
                                    <td>
                                        {users[group.customerId]?.name || `Customer ${group.customerId}`}
                                    </td>
                                    <td>{formatDate(group.purchaseDate)}</td>
                                    <td className="grouped-items">
                                        {group.items.map((order, itemIndex) => {
                                            const product = products.find(p => p.id === order.productId);
                                            return (
                                                <div key={itemIndex} className="order-item">
                                                    <div className="item-image">
                                                        {product && product.images && product.images.length > 0 ? (
                                                            <img
                                                                src={`data:image/jpeg;base64,${product.images[0].image}`}
                                                                alt={`${product?.name || 'Product'}`}
                                                                className="product-thumbnail"
                                                            />
                                                        ) : (
                                                            <span>No image</span>
                                                        )}
                                                    </div>
                                                    <div className="item-details">
                                                        {product ? (
                                                            <>
                                                                <strong>{product.name}</strong>
                                                                <span className="brand">{product.brand}</span>
                                                                <span className="price">${product.price}</span>
                                                            </>
                                                        ) : (
                                                            <span>Product not found</span>
                                                        )}
                                                        <div className="item-specifics">
                                                            <span>Color: {order.productColor}</span>
                                                            <span>Size: {order.productSize}</span>
                                                            <span>Qty: {order.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <div className="item-actions">
                                                        <button 
                                                            className="delete-btn"
                                                            onClick={() => deleteOrder(order.id)}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </td>
                                    <td>
                                        <select
                                            className="status-select"
                                            value={group.items[0]?.shipmentStatus || 'PENDING'}
                                            onChange={(e) => handleStatusChange(
                                                group.items.map(item => item.id),
                                                e.target.value
                                            )}
                                            disabled={statusUpdating}
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="DELIVERED">Delivered</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                        <div>
                                        <button 
                                            className="delete-group-btn"
                                            onClick={() => deleteOrderGroup(group)}
                                        >
                                            Delete Order
                                        </button>
                                        </div>
                                    </td>
                                </tr>
                                
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Orders;