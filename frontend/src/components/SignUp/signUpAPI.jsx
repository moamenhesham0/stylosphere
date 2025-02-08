export const signUpProcess = async(formData)=>
{
    const response = await fetch('http://localhost:8080/api/customers/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstname} ${formData.lastname}`,
          email: formData.email,
          password: formData.password,
        }),
      });
    const data = await response.text();
    return parseInt(data);
}


export const addToRegisteredUserCart = async(cart , userId) =>
{
  await Promise.all(
    cart.map(async (item) => 
      fetch(
        `http://localhost:8080/api/cart/add-to-cart?productId=${item.productId}&color=${item.productColor}&size=${item.productSize}&quantity=${item.quantity}&userId=${userId}`,
        {
          method: 'POST',
        }
      )
    ));
};