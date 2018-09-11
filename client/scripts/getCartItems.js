getCartItems();

function httpPostAsync(theUrl, str, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, true); // true for asynchronous

    //Send the proper header information along with the request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xmlHttp.onreadystatechange = function() { 
        if(this.readyState == XMLHttpRequest.DONE && this.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.send(str);
}

function setTitle(title) {
    var data = JSON.parse(title).data[0].title;
    document.getElementById('page-title').innerText = data;
}

function showCart(cart) {
    var totalPrice = 0;

    const cartElement = document.getElementById("cart");
    while (cartElement.firstChild) {
        cartElement.removeChild(cartElement.firstChild);
    }
    var cartItems = JSON.parse(cart).data;

    cartItems.forEach(product => {
        totalPrice += product.quantity*product.price;

        var productDiv = document.createElement('div');
        productDiv.classList.add("col-lg-6");
        productDiv.classList.add("product");
        productDiv.classList.add("cart-item-center");

        var productImage = document.createElement("img");
        productImage.src = "/images/" + product.image;
        productImage.classList.add("cart-image");
        productImage.classList.add("inline");
        productDiv.appendChild(productImage);

        var productTitle = document.createElement("h3");
        productTitle.innerText = product.title;
        productTitle.classList.add("inline");
        productTitle.classList.add("cart-product-title");
        productDiv.appendChild(productTitle);

        var productPrice = document.createElement("h3");
        productPrice.innerText = product.price*product.quantity + "$";
        productPrice.classList.add("text-right");
        productPrice.classList.add("cart-product-price");
        productPrice.classList.add("inline");
        productDiv.appendChild(productPrice);

        var quantityControlDiv = document.createElement("div");
        quantityControlDiv.classList.add("cart-quantity-control");
        var decButton = document.createElement("button");
        decButton.innerText = "-";
        decButton.classList.add("quantity-button");
        decButton.addEventListener('click', function() {
            var targetInput = document.getElementById("input-" + product.id);
            if (targetInput.value > 0) {
                targetInput.value = parseInt(targetInput.value) - 1;
                changeQuantity(product.id, "-");
            }
        });
        quantityControlDiv.appendChild(decButton);
        var quantityInput = document.createElement("input");
        quantityInput.setAttribute("type", "textbox");
        quantityInput.classList.add("quantity-input");
        quantityInput.value = product.quantity;
        quantityInput.id = "input-" + product.id;
        quantityControlDiv.appendChild(quantityInput);
        var incButton = document.createElement("button");
        incButton.innerText = "+";
        incButton.classList.add("quantity-button");
        incButton.addEventListener('click', function() {
            var targetInput = document.getElementById("input-" + product.id);
            targetInput.value = parseInt(targetInput.value) + 1;
            changeQuantity(product.id, "+");
        });
        quantityControlDiv.appendChild(incButton);
        quantityControlDiv.classList.add("inline");
        productDiv.appendChild(quantityControlDiv);

        var deleteButton = document.createElement("button");
        var deleteSymbol = document.createElement("i");
        deleteSymbol.classList.add("fas");
        deleteSymbol.classList.add("fa-times");
        deleteSymbol.classList.add("fa-2x");
        deleteButton.classList.add("inline");
        deleteButton.classList.add("delete-from-cart");
        deleteButton.addEventListener('click', function() {
            deleteFromCart(product.id);
        });
        deleteButton.appendChild(deleteSymbol);
        productDiv.appendChild(deleteButton);

        cartElement.appendChild(productDiv);
    });

    var checkOutElement = document.createElement("div");
    checkOutElement.classList.add("col-lg-4");
    checkOutElement.classList.add("offset-6");

    var totalElement = document.createElement("h3");
    totalElement.classList.add("std-text");
    totalElement.classList.add("bold");
    totalElement.classList.add("inline");
    totalElement.classList.add("totalPrice");
    totalElement.innerText = "Total: " + totalPrice + "$";
    checkOutElement.appendChild(totalElement);

    var checkOutButton = document.createElement("button");
    checkOutButton.innerText = "Checkout";
    checkOutButton.classList.add("btn");
    checkOutButton.classList.add("logo-text");
    checkOutButton.classList.add("inline");
    checkOutElement.appendChild(checkOutButton);

    cartElement.appendChild(checkOutElement);
}

function getCartItems() {
    var items = localStorage.getItem("cart");
    const _cartElement = document.getElementById("cart");
    if (items != null) {
        // Get info about all products in cart 
        httpPostAsync("/api/cart", items, showCart);
    } else {
        _cartElement.innerText = "There's no products in your cart yet :(";
        _cartElement.classList.add("std-text");
        _cartElement.style.height = "400px";
    }
}

function changeQuantity(id, op) {
    console.log("change");
    var allProducts = JSON.parse(localStorage.getItem("cart")).products;
    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].id == id) {
            if (op == "+") {
                allProducts[i].quantity = (parseInt(allProducts[i].quantity) + 1).toString();
                localStorage.setItem("cart", JSON.stringify({ "products": allProducts }));
            }
            if (op == "-") {
                if (parseInt(allProducts[i].quantity) > 1) {
                    allProducts[i].quantity = (parseInt(allProducts[i].quantity) - 1).toString();
                    localStorage.setItem("cart", JSON.stringify({ "products": allProducts }));
                } else {
                    deleteFromCart(id);
                }
            }
            getCartItems();
            return;
        }
    }
}

function deleteFromCart(id) {
    var allProducts = JSON.parse(localStorage.getItem("cart")).products;
    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].id == id) {
            allProducts.splice(i, 1);
            break;
        }
    }
    if (allProducts.length != 0) {
        localStorage.setItem("cart", JSON.stringify({ "products": allProducts }));
    } else {
        localStorage.removeItem("cart");
    }
    getCartItems();
}