function addToCart(product) {
  if (localStorage.getItem("cart") == null) {
    var cart = {};
    cart.products = [];
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  // Retrieve the cart object from local storage
  if (localStorage && localStorage.getItem('cart')) {
      var cart = JSON.parse(localStorage.getItem('cart'));            

      cart.products.push(product);

      localStorage.setItem('cart', JSON.stringify(cart));
  } 
}