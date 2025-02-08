export const saveLogInstance = async(userId) =>{
    const userAgent = navigator.userAgent;
    const browser = userAgent.match(/(firefox|chrome|safari|opera|edg|msie|trident(?=\/))\/?\s*(\d+)/i)?.[1]?.toLowerCase() || "unknown";
    const platform = browser.includes("Win")   ? "Windows" :
                     browser.includes("Mac")   ? "MacOS"   :
                     browser.includes("Linux") ? "Linux"   :
                                                 "Unknown" ;
                                                 
    const url = new URL(`http://localhost:8080/api/log-history/add-log-instance?userId=${userId}&device=${platform}&browser=${browser}`)
    await fetch(url, {method:'POST'});
};

export const signInProccess = async(email , password)=> 
{
  const response = await fetch('http://localhost:8080/api/customers/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  
  const data = await response.json();
  return data;
};

export const fetchUserCart = async(userId)=>
{
const cartResponse = await fetch(
    `http://localhost:8080/api/cart/retrieve-cart?userId=${userId}`,
    {
      method: 'GET',
    }
  );

  if (cartResponse.ok) {
    const cartData = await cartResponse.json();
    return cartData;
  }else
  {
    return "empty cart";
  }
};