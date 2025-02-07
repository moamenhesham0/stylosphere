import React, { useState, useEffect } from 'react';
import '../../style/mainPageStyle/adminPageStyle/productHandlerStyle.css';

const ProductHandler = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        tags: '',
        price: '',
        discountPrice: '',
        brand: '',
        styles: ''
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [variants, setVariants] = useState([]);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [currentVariant, setCurrentVariant] = useState({
        size: '',
        color: '',
        quantity: 0,
        variantImagesList: []
    });
    const [topSellingProducts, setTopSellingProducts] = useState([]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFiles([...e.target.files]);
    };

    const handleMainSubmit = (e) => {
        e.preventDefault();
        setCurrentVariant({
            size: '',
            color: '',
            quantity: 0,
            images: []
        });
        setShowVariantModal(true);
        
    };

    const handleAddVariant = (isFinal = false) => {
        if (!currentVariant.size || !currentVariant.color || currentVariant.quantity <= 0 || !currentVariant.images.length) {
            alert("Please fill out all variant fields and add images.");
            return;
        }
    
        const newVariant = {
            size: currentVariant.size,
            color: currentVariant.color,
            quantity: currentVariant.quantity,
            images: Array.from(currentVariant.images)
        };
    
        setVariants(prevVariants => [...prevVariants, newVariant]);
    
        if (isFinal) {
            setShowVariantModal(false);  // Closing modal triggers `useEffect`
        }
    
        setCurrentVariant({ size: '', color: '', quantity: 0, images: [] });
    };
    
    useEffect(() => {
        if (showVariantModal === false && variants.length > 0) {
            handleVariantSubmit();
        }
    }, [showVariantModal]);  // Trigger submission when the modal closes
    

    const handleVariantSubmit = async (updatedVariants = variants) => {
        console.log("Submitting product data...");
    
        const formData = new FormData();
    
        // Add main product details
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });
    
        // Ensure latest variants are used
        formData.append('sizes', updatedVariants.map(v => v.size).join(','));
        formData.append('colors', updatedVariants.map(v => v.color).join(','));
        formData.append('variantQuantities', updatedVariants.map(v => v.quantity).join(','));
    
        // Add variant images
        updatedVariants.forEach((variant) => {
            variant.images.forEach(image => {
                formData.append(`variantImagesList`, image);
            });
        });
    
        console.log("Final Data:", Object.fromEntries(formData.entries()));
    
        try {
            const response = await fetch('http://localhost:8080/api/admin/add-product', {
                method: 'POST',
                body: formData
            });
    
            if (response.ok) {
                alert('Product added successfully!');
                setProduct({
                    name: '', description: '', tags: '', price: '',
                    brand: '', styles: '', discountPrice: ''
                });
                setVariants([]);
                setShowVariantModal(false);
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add product');
        }
    };
    

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/top-selling');
                const result = await response.json();
                if (Array.isArray(result)) {
                    setTopSellingProducts(result.map(product => ({
                        ...product,
                        images: Array.isArray(product.images) ? product.images : [] // Ensure images is an array
                    })));
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
        return `data:image/jpeg;base64,${image}`;
    };

    return (
        <div>
            <div className='product-form-container'>
                <form onSubmit={handleMainSubmit} className="product-form">
                    <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Name" required className="form-input"/>
                    <input type="text" name="description" value={product.description} onChange={handleChange} placeholder="Description" required className="form-input" />
                    <input type="text" name="tags" value={product.tags} onChange={handleChange} placeholder="Tags (comma separated)" required  className="form-input"/>
                    <div className="form-row">
                        <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" required className="form-input small-input" />
                    </div>
                    <div className="form-row">
                        <input type="number" name="discountPrice" value={product.discountPrice} onChange={handleChange} placeholder="Discount Price" required className="form-input small-input" />
                        <input type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Brand" required className="form-input small-input" />
                    </div>
                    <input type="text" name="styles" value={product.styles} onChange={handleChange} placeholder="Styles (comma separated)" required  className="form-input"/>

                    <button type="submit" className="submit-button">Next: Add Variants</button>
                </form>
            </div>
            {showVariantModal && (
                
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add Product Variant</h2>
                        <div className="variant-form">
                            <input
                                type="text"
                                placeholder="Size"
                                value={currentVariant.size}
                                onChange={e => setCurrentVariant({...currentVariant, size: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Color"
                                value={currentVariant.color}
                                onChange={e => setCurrentVariant({...currentVariant, color: e.target.value})}
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={currentVariant.quantity}
                                onChange={e => setCurrentVariant({...currentVariant, quantity: e.target.value})}
                            />
                            <input
                                type="file"
                                multiple
                                 className="file-input"
                                onChange={e => setCurrentVariant({...currentVariant, images: e.target.files})} // Store selected files properly
                            />

                            <div className="variant-buttons">
                                <button onClick={() => handleAddVariant(false)}>
                                    Add Another Variant
                                </button>
                                <button onClick={() => handleAddVariant(true)}>Done</button>

                            </div>
                        </div>
                        <div className="variants-list">
                            {currentVariant.images && currentVariant.images.length > 0 && (
                                <p>Images: {currentVariant.images.length} selected</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
    );
};

export default ProductHandler;