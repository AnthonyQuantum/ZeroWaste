var url = new URL(window.location.href);
var category = url.searchParams.get("category");

// Get category title
httpGetAsync("/api/categories/" + category, setTitle);

// Get products for this category
httpGetAsync("/api/products/" + category, showProducts);

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function setTitle(title) {
    var data = JSON.parse(title).data[0].title;
    document.getElementById('page-title').innerText = data;
}

function showProducts(products) {
    const productsElement = document.getElementById("products");
    
    if (JSON.parse(products).data.length == 0) {
        productsElement.innerText = "There's no products in this category yet :(";
        productsElement.classList.add("std-text");
        productsElement.style.height = "400px";
    }

    var productsData = JSON.parse(products).data;
    productsData.forEach(product => {
        var productDiv = document.createElement('div');
        productDiv.classList.add("col-lg-3");
        productDiv.classList.add("product");

        var productImage = document.createElement("img");
        productImage.src = "/images/" + product.image;
        productImage.classList.add("product-image");
        productDiv.appendChild(productImage);

        var productTitle = document.createElement("h3");
        productTitle.innerText = product.title;
        productDiv.appendChild(productTitle);

        var productDescription = document.createElement("h4");
        productDescription.innerText = product.description;
        productDiv.appendChild(productDescription);

        var productPrice = document.createElement("h3");
        productPrice.innerText = product.price + "$";
        productPrice.classList.add("text-right");
        productPrice.classList.add("product-price");
        productDiv.appendChild(productPrice);

        var quantityControlDiv = document.createElement("div");
        quantityControlDiv.classList.add("quantity-control");
        var decButton = document.createElement("button");
        decButton.innerText = "-";
        decButton.classList.add("quantity-button");
        decButton.addEventListener('click', function() {
            var targetInput = document.getElementById("input-" + product.id);
            if (targetInput.value > 0)
                targetInput.value = parseInt(targetInput.value) - 1;
        });
        quantityControlDiv.appendChild(decButton);
        var quantityInput = document.createElement("input");
        quantityInput.setAttribute("type", "textbox");
        quantityInput.classList.add("quantity-input");
        quantityInput.value = 1;
        quantityInput.id = "input-" + product.id;
        quantityControlDiv.appendChild(quantityInput);
        var incButton = document.createElement("button");
        incButton.innerText = "+";
        incButton.classList.add("quantity-button");
        incButton.addEventListener('click', function() {
            var targetInput = document.getElementById("input-" + product.id);
            targetInput.value = parseInt(targetInput.value) + 1;
        });
        quantityControlDiv.appendChild(incButton);
        quantityControlDiv.classList.add("inline");
        productDiv.appendChild(quantityControlDiv);

        var cartButton = document.createElement("button");
        var cartSymbol = document.createElement("i");
        cartSymbol.classList.add("fas");
        cartSymbol.classList.add("fa-shopping-cart");
        cartSymbol.classList.add("fa-2x");
        cartButton.classList.add("inline");
        cartButton.classList.add("product-cart");
        cartButton.addEventListener('click', function() {
        
            var quantity = quantityInput.value;
        
            // Ensure a valid quantity has been entered
            if (!Number.isInteger(parseInt(quantity)) === true) {
                alert('Please enter a valid quantity');
                return;
            }
        
            var _product = {};
            _product.id = product.id;
            _product.quantity = quantity;
        
            addToCart(_product);
        });
        cartButton.appendChild(cartSymbol);
        productDiv.appendChild(cartButton);

        productsElement.appendChild(productDiv);
    });
}