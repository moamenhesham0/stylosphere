import React from 'react';
import '../style/productsPageStyle/ProductsPageStyle.css';



const ProductsPage = () => {
    const products = [
        { id: 1, name: 'Product A' },
        { id: 2, name: 'Product B' },
        { id: 3, name: 'Product C' },
    ];

    return (
        <div className="products-container">
            <h1>Products Page</h1>
            <ul className="products-list">
                {products.map(product => (
                    <li key={product.id}>
                        <span>{product.name}</span>
                        <button>View Details</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductsPage;

