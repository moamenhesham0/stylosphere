export const getItemId = async (cartItem , userId) => {
  const url = new URL(`http://localhost:8080/api/cart/get-id?productId=${cartItem.productId}&customerId=${userId}&color=${cartItem.productColor}&size=${cartItem.productSize}`);

 

  try {
    const response = await fetch(url, {
      method: 'POST', // Use GET since you want query parameters
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    return parseInt(data, 10); 
  } catch (error) {
    console.error('Error fetching item ID:', error);
    throw error; // Propagate the error
  }
};

// Delete a cart item
export const deleteItem = async (cartItemId) => {
  const url = new URL(`http://localhost:8080/api/cart/delete-order?orderId=${cartItemId}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Ensure content type is set
    },
  });

  // Check if the response is OK (status 200-299)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
};

// Update item quantity in the cart
export const updateQuantity = async (id, newQuantity) => {
  const url = new URL(`http://localhost:8080/api/cart/update-quantity?id=${id}&newQuantity=${newQuantity}`);
  
  try {
    // Sending the request with GET method (You can use POST if necessary)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure content type is set
      },
    });

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response JSON
    const data = await response;

    // Log the response data (success)
    console.log(data);
    
  } catch (error) {
    // Log the error if request fails
    console.error('Error updating quantity:', error);
    throw error; // Re-throw the error so it can be handled upstream if necessary
  }
};


// Apply a promo code
export const applyPromoCode = async (productId, code) => {
  const url = `http://localhost:8080/api/cart/promo-code?id=${productId}&code=${code}`;
  await fetch(url, {
    method: 'GET',
  });
};

// Complete payment and clear the local cart
export const completePayment = async (cart, userId) => {
  try {
    await Promise.all(
      cart.map(async (item) => {
        try {
          const url = `http://localhost:8080/api/purchase/save-purchase?customerId=${userId}&productId=${item.productId}&productColor=${item.productColor}&productSize=${item.productSize}&quantity=${item.quantity}`;

          const response = await fetch(url, {
            method: 'POST',
          });
          console.log(url);
          if (!response.ok) {
            throw new Error(`Failed to save purchase for product ${item.productId}`);
          }
        } catch (error) {
          console.error(`Error saving purchase for product ${item.productId}:`, error);
        }
      })
    );

    console.log('Payment completed successfully and cart cleared.');
  } catch (error) {
    console.error('Error during completePayment:', error);
  }
};
