import './UserProfileStyle.css';
import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa'; // For the close button icon



import { updateUserEmail,
         updateUserName , 
         updateUserAddress , 
         updateUserPhone,
         checkCurrentPassword,
         updateUserPassword,
         fetchPurchaseHistory,
         fetchProducts,
         fetchWishList,
         removeFromWishList,
         sendImageToBackend } from './UserApi';



function UserProfile() {
  /* Local user storage*/
  const { user, updateUser } = useUser();
  const navigate = useNavigate();




  /*User Data*/
  const [userName, setUserName] = useState(user.name);
  const [userAddress, setUserAdress] = useState(user.address);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPhone, setUserPhone] = useState(user.phone);
  const [userPhoto, setUserPhoto] = useState(user.image);





  /*User Profile different data sections*/
  const [showData, setShowData] = useState('profileData');


  /* Error Message */
  const [errorMessage , setErrorMessage] = useState('');


  /* Whish List */
  const [wishList, setWishList] = useState([]);

  /* Purchase History */
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [purchaseHistoryProducts, setPurchaseHistoryProducts] = useState({});
  const [shownPurchaseHistory , setShownPurchaseHistory] = useState([]);





  /* Edit states*/
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const isEditing = (editName || editEmail || editPhone || editAddress);

  /* New data states */
  const [newName, setNewName] = useState(userName);
  const [newEmail, setNewEmail] = useState(userEmail);
  const [newPhone, setNewPhone] = useState(userPhone);
  const [newAddress, setNewAddress] = useState(userAddress);


  /* Security */
  const [changePasswordWindow, setChangePasswordWindow] = useState(false);
  const [currentPasswordConfirmed, setCurrentPasswordConfirmed] = useState(false);
  const [currentPassword , setCurrentPassword] = useState('');
  const [newPassword , setNewPassword] = useState('');
  const [confirmNewPassword , setConfirmNewPassword] = useState('');



  /* Fetching data */
  useEffect(() => {
    
    /*Purchase History */
    const getPurchaseHistory = async () => {
      const fetchedPurchaseHistory = await fetchPurchaseHistory(user.userId);
      setPurchaseHistory(fetchedPurchaseHistory);

      if(fetchedPurchaseHistory.length > 0){
        const fetchedProducts = await fetchProducts(purchaseHistory);
        setPurchaseHistoryProducts(fetchedProducts);
      }
    };

    /*Whish List */
    const getWishList = async () => {
      const fetchedWishList = await fetchWishList(user.userId);
      setWishList(fetchedWishList);
    };

    getPurchaseHistory();
    getWishList();

    
  }, [showData]);



  /* Reset data when changing tabs */
  useEffect(() => {

    /*Profile Data*/
    handleAddressCancel();
    handleEmailCancel();
    handleNameCancel();
    handlePhoneCancel();

    /*Security*/
    setChangePasswordWindow(false);
    setCurrentPasswordConfirmed(false);
    setCurrentPassword('');
    setConfirmNewPassword('');
    setNewPassword('');

  }, [showData]);



  /* IMAGE UPLOAD */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];
        sendImageToBackend(base64Image , userEmail);
        setUserPhoto(base64Image);
        updateUser({
          ...user,
          image: base64Image,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  

  /* Cancel Error Message */
  const handleErrorMessageCancel = () => {
    setErrorMessage('');
  };





  /* USER DATA UPDATE */

  //Name
  const handleNameUpdate = async() => {
    if(newName === userName){
      setErrorMessage('Name is the same as the current one');
      return;
    }
    if(newName === '' || newName.trim() === '') {
      setErrorMessage('Name cannot be empty');
      setNewName(userName);
      return;
    }
    updateUser({
      ...user,
      name: newName
    })
    setUserName(newName);
    await updateUserName(user.userId, newName); 
    handleNameCancel(true);
  };
  const handleNameCancel = (success =false) => {
    if(!success)
      setNewName(user.name);
    setEditName(false);
    handleErrorMessageCancel();
  };

  // Email
  const emailFormatValidation = () => {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailFormat.test(newEmail)){
      return false;
    }
    return true;
  };
  const handleEmailUpdate = async() => {
    if(newEmail === userEmail){
      setErrorMessage('Email is the same as the current one');
      return;
    }
    if(newEmail === '' || newEmail.trim() === '') {
      setNewEmail(userEmail);
      setErrorMessage('Email cannot be empty');
      return;
    }
    if(!emailFormatValidation()){
      setErrorMessage('Invalid email format');
      return;
    }
    updateUser({
      ...user,
      email: newEmail
    })
    setUserEmail(newEmail);
    await updateUserEmail(user.userId, newEmail);
    handleEmailCancel(true);
  };

  const handleEmailCancel = (success = false) => {
    if(!success)
      setNewEmail(user.email);
    setEditEmail(false);
    handleErrorMessageCancel();
  };

  // Phone
  const handlePhoneUpdate = async() => {
    if(newPhone === userPhone){
      setErrorMessage('Phone number is the same as the current one');
      return;
    }
    if(newPhone === '' || newPhone.trim() === '') {
      setNewPhone(userPhone);
      setErrorMessage('Phone number cannot be empty');
      return;
    }
    if(newPhone.length !== 10){
      setErrorMessage('Phone number must be 10 digits long');
      return;
    }
    updateUser({
      ...user,
      phone: newPhone
    })
    setUserPhone(newPhone);
    await updateUserPhone(user.userId, newPhone);
    handlePhoneCancel(true);
  };
  const handlePhoneCancel = (success = false) => {
    if(!success)
      setNewPhone(user.phone);
    setEditPhone(false);
    handleErrorMessageCancel();
  };
  


  // Address
  

  const handleAddressUpdate = async() => {
    if(newAddress === userAddress){
      setErrorMessage('Address is the same as the current one');
      return;
    }
    if(newAddress === '' || newAddress.trim() === '') {
      setErrorMessage('Address cannot be empty');
      setNewAddress(userAddress);
      return;
    }
    updateUser({
      ...user,
      address: newAddress
    })
    setUserAdress(newAddress); 
    await updateUserAddress(user.userId, newAddress);
    handleAddressCancel(true);
  };
  const handleAddressCancel = (success = false) => {
    if(!success)
      setNewAddress(user.address); 
    setEditAddress(false);
    handleErrorMessageCancel();
  };
  





  /* Security */


  //Password Handling
  const strongPasswordValidation = () => {
    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if(!passwordFormat.test(newPassword)){
      return false;
    }
    return true
  };
  const handlePasswordChangeCancel = async() => {
    setCurrentPasswordConfirmed(false);
    setChangePasswordWindow(false);
    setErrorMessage('');
    setCurrentPassword('');
  };

  const handleConfirmCurrentPassword = async() => {
    const currentPasswordGrant = await checkCurrentPassword(user.userId , currentPassword);
    if(currentPasswordGrant === 'true'){
      setCurrentPasswordConfirmed(true);
      handleErrorMessageCancel();
    }else{
      setErrorMessage('Incorrect password');
      return;
    }
    setCurrentPassword('');
  };
  
  const handleChangePassword = async() => {
    if(newPassword !== confirmNewPassword){
      setErrorMessage('Passwords do not match');
      return;
    }

    if(!strongPasswordValidation()){
      setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number');
      return;
    }

    await updateUserPassword(user.userId, newPassword);
    handlePasswordChangeCancel();
  };




  /*WishList*/
  const handleRemoveFromWishlist = async(productId) => {
    await removeFromWishList(user.userId, productId);
    // Update local wishlist by filtering out the removed product
    setWishList(wishList.filter(product => product.id !== productId));
  }




  const ErrorMessage = () => {
    if (!errorMessage) return null;

    return (
      <div className="error-message" 
           style={{
             color: '#ff3333',
             fontSize: '0.875rem',
             marginTop: '8px',
             padding: '8px 12px',
             backgroundColor: '#fff0f0',
             borderRadius: '6px',
             border: '1px solid #ffcccc',
             boxShadow: '0 2px 4px rgba(255, 0, 0, 0.1)',
             animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
             display: 'flex',
             alignItems: 'center',
             gap: '8px',
             '@keyframes shake': {
               '0%, 100%': { transform: 'translateX(0)' },
               '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
               '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
             }
           }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 15A7 7 0 108 1a7 7 0 000 14zM7 4h2v5H7V4zm0 6h2v2H7v-2z" 
                fill="#ff3333"/>
        </svg>
        {errorMessage}
      </div>
    );
  };

  return (
    <div className="profileUser-container">




      <div className="profileUser-left">
        <button onClick={() => setShowData("profileData")}>Profile Data</button>
        <button onClick={() => setShowData("securityCredentials")}>Security</button>
        <button onClick={() => setShowData("whishList")}>Wishlist</button>
        <button onClick={() => setShowData("purchaseHistory")}>Purchase History</button>
      </div>
      



      <div className="profileUser-right">




        {/*Security*/}
        {showData === "securityCredentials" && (
          <div className="security-info">
            <h1>Security Credentials</h1>
            <div className='security-item'>
            <h2>Password</h2>
            <p>********</p>

            {!changePasswordWindow?
            (
              <button onClick={()=> setChangePasswordWindow(true)}>Change Password</button>
            )
            :
            (
              <>
              <div className='change-password-overlay'></div>
              <div className="change-password-window">

              
                {
                  !currentPasswordConfirmed ? (
                    <>
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button onClick={()=> handleConfirmCurrentPassword()}>Confirm</button>
                    </>
                    ) 
                    : 
                    (
                      <>
                        <input
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />  
                        <button onClick={()=> handleChangePassword()}>Change Password</button>
                      </>
                    )
                  }


                  <button onClick={()=> handlePasswordChangeCancel()}>Cancel</button>
                  <ErrorMessage/>
              </div>
              </>
            )}


          </div>
          </div>
        )}




        {/*wish list*/}
        {showData === "whishList" && (
          <div className="purchase-history-container">
            <h2>Wish List</h2>
            <div className="search-sort-container">
              <input
                type="text"
                placeholder="Search wishlist..."
                className="search-input"
                onChange={(e) => {
                  const searchValue = e.target.value.toLowerCase();
                  const filtered = wishList.filter(product => 
                    product.name.toLowerCase().includes(searchValue)
                  );
                  setWishList(filtered);
                }}
              />
              <div className="sort-container">
                <select 
                  className="sort-select"
                  onChange={(e) => {
                    const sorted = [...wishList].sort((a, b) => {
                      switch(e.target.value) {
                        case 'name':
                          return a.name.localeCompare(b.name);
                        case 'price':
                          return a.price - b.price;
                        default:
                          return 0;
                      }
                    });
                    setWishList(sorted);
                  }}
                >
                  <option value="">Sort by</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>

            {wishList.length > 0 ? (
              <ul className="wishlist-items">
                {wishList.map((product) => (
                  <li key={product.id} className="wishlist-item">
                      <button className="closebutton" onClick={() => handleRemoveFromWishlist(product.id)}>
                          <FaTimes />
                      </button>
                    <div className="wishlist-product-details">
                      <img
                        src={`data:image/jpeg;base64,${product.image[0].image}`}
                        alt={product.name}
                        onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                      />
                      <div className="wishlist-product-info">
                        <h3>{product.name}</h3>
                        <p className="price">${product.price}</p>

                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-wishlist">Your wishlist is empty.</p>
            )}
          </div>
        )}

        {/*Purchase History*/}
        {showData === "purchaseHistory" && (
          <div className="purchase-history-container">
            <h2>Purchase History</h2>
            <div className="search-sort-container">
              <input
                type="text"
                placeholder="Search purchases..."
                className="search-input"
                onChange={(e) => {
                  const filtered = purchaseHistory.filter(item => 
                    purchaseHistoryProducts[item.productId]?.name.toLowerCase().includes(e.target.value.toLowerCase())
                  );
                    setPurchaseHistory(filtered);
                  }}
                  />
                  <div className="sort-container">
                  <select 
                    className="sort-select"
                    onChange={(e) => {
                    const sorted = [...purchaseHistory].sort((a, b) => {
                      switch(e.target.value) {
                      case 'date':
                        return new Date(b.timeStamp) - new Date(a.timeStamp);
                      case 'quantity':
                        return b.quantity - a.quantity;
                      case 'price':
                        return purchaseHistoryProducts[b.productId]?.price - purchaseHistoryProducts[a.productId]?.price;
                      default:
                        return 0;
                      }
                    });
                    setPurchaseHistory(sorted);
                    }}
                  >
                    <option  value="date">Date</option>
                    <option value="quantity">Quantity</option>
                    <option value="price">Price</option>
                  </select>
                  <button 
                    className="clear-sort"
                    onClick={() => {
                    const select = document.querySelector('.sort-select');
                    select.selectedIndex = 0;
                    const original = [...purchaseHistory].sort((a, b) => 
                      new Date(b.timeStamp) - new Date(a.timeStamp)
                    );
                    setPurchaseHistory(original);
                    }}
                  >
                    ✕
                  </button>
                  </div>
                </div>

                {purchaseHistory.length > 0 ? (
                  <ul className="purchase-history-list">
                  {purchaseHistory.map((item, index) => (
                    <li key={index} className="purchase-item">
                    <div className="purchase-details">
                      <img
                      src={`data:image/jpeg;base64,${purchaseHistoryProducts[item.productId]?.image[0].image}`}
                      alt={purchaseHistoryProducts[item.productId]?.name}
                      />
                      <h3>{purchaseHistoryProducts[item.productId]?.name}</h3>
                      <p><strong>Date:</strong> {item.purchaseDate}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> ${purchaseHistoryProducts[item.productId]?.price}</p>
                      <p><strong>Color:</strong> {item.productColor}</p>
                      <p><strong>Size:</strong>  {item.productSize}</p> 
                    </div>
                    </li>
                  ))}
                  </ul>
                ) : (
                  <p>You have no purchase history yet.</p>
                )}
                </div>
              )}

              {/*Profile Data*/}
          {showData === "profileData" && (
                    <div className="user-info">

          <div
          className="profileUser-image"
          onClick={() => document.getElementById('imageUpload').click()}  // Trigger file input click on image click
          >
          <img
            src={userPhoto ? `data:image/jpeg;base64,${userPhoto}` : "https://via.placeholder.com/100"}
            alt="Profile User Picture"
          />
        </div>

        {/* Hidden file input for image upload */}
         <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="imageUpload"
        /> 
                    {/* Full Name */}
                    <div className="info-item">
                      <h3>Name</h3>
                      {editName ? (
                        <div>
                          <input
                            type="text"
                            value={newName}
                            placeholder='Enter your Name'
                            onChange={(e) => setNewName(e.target.value)}
                          />
                          <button
                            className="update-button"
                            onClick={() => handleNameUpdate()}
                          >
                            Update
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => handleNameCancel()}
                          >
                            Cancel
                          </button>
                          <ErrorMessage/>
                        </div>
                      ) : (
                        <>
                          {!isEditing && (
                            <button className="edit-button" onClick={() => setEditName(true)}>
                              Edit
                            </button>
                          )}
                          <p>{userName}</p>
                        </>
                      )}
                    </div>
                  
                    {/* Email */}
                    <div className="info-item">
                      <h3>Email</h3>
                      {editEmail ? (
                        <div>
                          <input
                            type="email"
                            value={newEmail}
                            placeholder='Enter your Email Address'
                            onChange={(e) => setNewEmail(e.target.value)}
                          />
                          <button
                            className="update-button"
                            onClick={() => handleEmailUpdate()}
                          >
                            Update
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => handleEmailCancel()}
                          >
                            Cancel
                          </button>
                          <ErrorMessage/>
                        </div>
                      ) : (
                        <>
                          {!isEditing && (
                            <button className="edit-button" onClick={() => setEditEmail(true)}>
                              Edit
                            </button>
                          )}
                          <p>{userEmail}</p>
                        </>
                      )}
                    </div>
                  
                    {/* Phone */}
                    <div className="info-item">
                      <h3>Phone Number</h3>
                      {editPhone ? (
                        <div>
                          <input
                            type="text"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder='Enter your Phone Number'
                            inputmode="numeric"
                            pattern='\d+'
                            maxLength={10}
                            onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                          />
                          <button
                            className="update-button"
                            onClick={() => handlePhoneUpdate()}
                          >
                            Update
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => handlePhoneCancel()}
                          >
                            Cancel
                          </button>
                          <ErrorMessage/>
                        </div>
                      ) : (
                        <>
                          {!isEditing && (
                            <button className="edit-button" onClick={() => setEditPhone(true)}>
                              Edit
                            </button>
                          )}
                          <p>{!userPhone ? 'N/A' : userPhone}</p>
                        </>
                      )}
                    </div>
                  
                    {/* Address */}
                    <div className="info-item">
                      <h3>Address</h3>
                      {editAddress ? (
                        <div>
                          <input
                            type="text"
                            value={newAddress}
                            placeholder='Enter your Address'
                            onChange={(e) => setNewAddress(e.target.value)}
                          />
                          <button
                            className="update-button"
                            onClick={() => handleAddressUpdate()}
                          >
                            Update
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => handleAddressCancel()}
                          >
                            Cancel
                          </button>
                          <ErrorMessage/>
                        </div>
                      ) : (
                        <>
                          {!isEditing && (
                            <button className="edit-button" onClick={() => setEditAddress(true)}>
                              Edit
                            </button>
                          )}
                          <p>{!userAddress ? 'N/A' : userAddress}</p>
                        </>
                      )}
                    </div>
                  </div>
                  )}


      </div>
    </div>
  );
}

export default UserProfile;


