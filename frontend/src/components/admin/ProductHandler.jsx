import '../../style/mainPageStyle/adminPageStyle/ProductHandlerStyle.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductHandler() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    axios.get("/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Handle product deletion
  const handleDelete = (id) => {
    axios.delete(`/api/products/${id}`)
      .then(() => setProducts(products.filter((product) => product.id !== id)))
      .catch((error) => console.error("Error deleting product:", error));
  };

  // View product details
  const handleView = (id) => {
    axios.get(`/api/products/${id}`)
      .then((response) => setSelectedProduct(response.data))
      .catch((error) => console.error("Error fetching product details:", error));
  };

  return (
    <div className="products-admin">
    </div>
  );
};

export default ProductHandler;

