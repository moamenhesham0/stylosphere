const BASE_URL = "http://localhost:8080/api/customers";
const purchase_URL = "http://localhost:8080/api/purchase";
const wishlist_URL = "http://localhost:8080/api/wishlist";
const logHistory_URL = "http://localhost:8080/api/log-history"
// Saves User Image in backend
export const sendImageToBackend = (base64Image , userEmail) => {
  fetch(`${BASE_URL}/photo-upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: userEmail,
      image: base64Image,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

// Update user name
export const updateUserName = async (userId, name) => {
  const url = `${BASE_URL}/update-name?userId=${userId}&name=${name}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to update name. Status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error updating name:", error);
    throw error;
  }
};

// Update user email
export const updateUserEmail = async (userId, email) => {
  const url = `${BASE_URL}/update-email?userId=${userId}&email=${email}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to update email. Status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};


// check current password
export const checkCurrentPassword = async (userId, password) => {
  const url = `${BASE_URL}/check-password?userId=${userId}&password=${password}`;

  try{
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to check password. Status: ${response.status}`);
    }

    return await response.text();
  }catch(error){
    console.error("Error checking password:", error);
    throw error;
  }
};


// Update user password
export const updateUserPassword = async (userId, password) => {
  const url = `${BASE_URL}/update-password?userId=${userId}&password=${password}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to update password. Status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// Update user phone
export const updateUserPhone = async (userId, phone) => {
  const url = `${BASE_URL}/update-phone?userId=${userId}&phone=${phone}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to update phone. Status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Error updating phone:", error);
    throw error;
  }
};

/* UPDATE ADDRESS*/
export const updateUserAddress = async (userId, address) => {
    const url = `${BASE_URL}/update-address?userId=${userId}&address=${address}`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update password. Status: ${response.status}`);
      }
  
      return await response.text();
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

/* Fetch purchase history */
export const fetchPurchaseHistory = async (userId) => {
  const url = `${purchase_URL}/user-purchases?userId=${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to get purchase history. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting purchase history:", error);
    throw error;
  }
};


/*FETCH PRODUCTS  */
export const fetchProducts = async (list) => {
  const updatedProducts = {};
 
  await Promise.all(
    list.map(async (item) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/get-product?id=${item.productId}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product with productId: ${item.productId}`);
        }

        const data = await response.json();
        updatedProducts[item.productId] = data;
      } catch (error) {
        console.error(`Error fetching product ${item.productId}:`, error);
      }
    })
  );
  return updatedProducts;
};

/* FETCH WISH LIST */
export const fetchWishList = async (userId)=>{
    const url = `${wishlist_URL}/get-wishlist?customerId=${userId}`

    try {
        const response = await fetch(url, {method:'GET'});

        if (!response.ok) {
            throw new Error(`Failed to fetch wishlist. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }
};
/* REMOVE ITEM FROM WISHLIST*/
export const removeFromWishList = async (userId , productId)=>
{
    const url = `${wishlist_URL}/remove-from-wishlist?customerId=${userId}&productId=${productId}`
    try {
      const response = await fetch(url, {
        method: "POST",
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update password. Status: ${response.status}`);
      }
  
      return await response.text();
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
}

export const fetchLogHistory = async (userId)=>{
  const url = `${logHistory_URL}/get-customer-log-history?userId=${userId}`

  try {
      const response = await fetch(url, {method:'GET'});

      if (!response.ok) {
          throw new Error(`Failed to fetch wishlist. Status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
  }
};