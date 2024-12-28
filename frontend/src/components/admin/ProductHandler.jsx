import React, { useState, useEffect } from 'react';

import '../../style/mainPageStyle/adminPageStyle/productHandlerStyle.css'; 
const ProductHandler = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        tags: '',
        price: '',
        quantity: '',
        colors: ''
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [products, setProducts] = useState([]);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('tags', product.tags);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('colors', product.colors);
        imageFiles.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch('http://localhost:8080/api/admin/add-product', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const result = await response.json().catch(() => null); // Handle empty response
                if (result) {
                    console.log('Product added:', result);
                    setProducts([...products, result]);
                } else {
                    console.log('Product added successfully, but no JSON response');
                }
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8080/api/admin/products');
    //             const result = await response.json();
    //             if (Array.isArray(result)) {
    //                 console.log('Fetched products:', result);
    //                 setProducts(result.map(product => ({
    //                     ...product,
    //                     images: Array.isArray(product.images) ? product.images : [] // Ensure images is an array
    //                 })));
    //                 console.log('Fetched products:', result);
    //             } else {
    //                 console.error('Fetched data is not an array:', result);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching products:', error);
    //         }
    //     };

    //     fetchProducts();
    // }, []);

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/top-selling');
                const result = await response.json();
                if (Array.isArray(result)) {
                    console.log('work ing', result);
                    setTopSellingProducts(result.map(product => ({
                        ...product,
                        images: Array.isArray(product.images) ? product.images : [] // Ensure images is an array
                    })));
                    console.log('work ing', result);
                } else {
                    console.log('Fetched data is not an array:', result);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchTopSellingProducts();
    }, []);

    const generateDataUrl = (image) => {
          if (!image) return '';
        console.log('Image:', image);
        return `data:image/jpeg;base64,${image}`;
    };

    return (
        <div>
            <div className='product-form-container'>    
            <form onSubmit={handleSubmit}  className="product-form">
                <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Name" required className="form-input"/>
                <input type="text" name="description" value={product.description} onChange={handleChange} placeholder="Description" required className="form-input" />
                <input type="text" name="tags" value={product.tags} onChange={handleChange} placeholder="Tags (comma separated)" required  className="form-input"/>
                <div className="form-row">
                    <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required className="form-input small-input" />
                    <input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="Quantity" required className="form-input small-input" />
                </div>
                <input type="text" name="colors" value={product.colors} onChange={handleChange} placeholder="Colors (comma separated)" required  className="form-input"/>
                <input type="file" multiple onChange={handleImageChange} required className="file-input"/>
                <button type="submit" className="submit-button" >Add Product</button>
            </form>
            
            <div>
            <div className="best-sellers-header">
            <h2>Best Sellers</h2>
            </div>
                <div className="best-sellers-container">
                    {topSellingProducts.map((product, index) => (
                        <div key={index} className="product-card">
                            <div className="product-images">
                                {product.images.map((image, idx) => (
                                    <div key={idx} className="product-image">
                                        <img
                                            src={generateDataUrl(image)}
                                            alt={`Product ${index} Image ${idx}`}
                                            title={`Product ${index} Image ${idx}`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <p>Price: ${product.price}</p>
                            <p>Quantity: {product.quantity}</p>
                            <p>ID: {product.id}</p>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    );
};

export default ProductHandler;