let productsDiv = document.querySelector(".products")
let buttons = document.querySelectorAll(".button2")
let opt = document.querySelector(".options")
// let cartbtn = document.querySelectorAll(". addtocart")
let countbtn = document.getElementById("countDisplay")


// let productdata = []
// let cartitem = []
// let count = 0
// console.log(productdata);


async function fetchData() {
  try {
    const reponse = await fetch("https://fakestoreapi.com/products")

    const Data = await reponse.json()
    console.log(Data);
    productdata = Data
    displayData(productdata);


  } catch (error) {
    console.log("Error fetching data:", error);

  }
}
fetchData()


function displayData(data) {
  let value = ""
  data.map((da) => {

    value += `
         <div class="col-lg-4 col-md-6  p-2">
        <div class="card text-center " >
          <div class= "">
            <img src="${da.image}" class="img-fluid card-img-top img2 m-2" alt="prod">
          </div>
          <figcaption class="">
              <p class= "fw-bold">${da.title.slice(0, 12)}...</p>
              <p class= "mx-3">${da.description.slice(0, 90)}...</p>
           </figcaption>
           <hr>
           <p class= "m-0"> $ ${da.price}<p>
           <hr class= "m-0">
          <div class="card-body">
            <a href="" class="btn btn-primary addtocart " data-id="${da.id}" >Add to cart</a>
             <a href="./productDetailsPage.html?id=${da.id}" class="btn btn-primary Details " data-id="${da.id}" >Details</a>
          </div>
        </div>
      </div>
      `

  })
  productsDiv.innerHTML = value;
  setupCartButtons();
}




/// products filtered by category ///
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    let category = button.getAttribute("data-category");
    console.log(category);

    if (category === "All") {
      displayData(productdata);
    } else {
      const filteredProducts = productdata.filter((prod) => prod.category === category);
      displayData(filteredProducts);
    }
  });
});

//////   product details page     //////
if (window.location.pathname.includes("productDetailsPage.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  async function fetchProductDetails() {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const product = await response.json();

      document.getElementById("productTitle").textContent = `${product.title}`;
      document.getElementById("productrating").textContent = `${product.rating.rate}⭐`;
      document.getElementById("productImage").src = product.image;
      document.getElementById("productDescription").textContent = product.description;
      document.getElementById("productPrice").textContent = `$${product.price}`;
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }
  fetchProductDetails();
}
function setupCartButtons() {
  let cartButtons = document.querySelectorAll(".addtocart");

  cartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let productId = button.getAttribute("data-id");
      let product = productdata.find((prod) => prod.id == productId);

      if (!product) {
        console.error("Product not found!");
        return;
      }


      let cart = JSON.parse(localStorage.getItem("cart")) || [];


      let existingItem = cart.find(item => item.id == productId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }


      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();

    });
  });
}

if (window.location.pathname.includes("cart.html")) {
  function displayCart() {
    let cartpro = document.querySelector(".product-list");

    if (!cartpro) {
      console.error("Error: .product-list not found in DOM");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      cartpro.innerHTML = `
      <p class = 'text-center fs-5 empty'>Your cart is empty!</p>
      <p class = 'text-center  m-2 fs-1 Continue'><a class="con " href="./product.html" >continue shopping!</a></p>
      
      `;
      return;
    }


    cartpro.innerHTML = "";
    let totalSum = 0;
    const shippingFee = 30;

    cart.forEach((product, index) => {
      let cartItem = document.createElement("figure");
      let productTotal = product.quantity * product.price;
      totalSum += productTotal;

      cartItem.innerHTML = `
       
        <div class="cart-figure">
        <img class="fluid m-4" src="${product.image}" alt="pro img" width="90">
       <span class = "cart-item-details fw-normal"> ${product.title}</span>
        <span class = " cart-item-math m-3  ">
        <button class="decrease text-align p-1 px-3 pb-2" data-index="${index}">-</button>
        <span class="quantity px-2">${product.quantity}</span>
        <button class="increase text-align p-1  pb-2 px-3" data-index="${index}">+</button>
        </span>
        <span><button class="remove m-3 p-1 px-3 text-align" data-index="${index}"><ion-icon name="trash-sharp"></ion-icon></button></span>
        </div>
        <div class = "cart-product-price"> ${product.quantity} x $${product.quantity * (product.price).toFixed(2)}</div>
        <hr id="cart-item-hr"/>
      `;

      cartpro.appendChild(cartItem);

    });
    updateCartTotal(totalSum, shippingFee);
    setupCartActions();

  }

  function setupCartActions() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    document.querySelectorAll(".increase").forEach((button) => {
      button.addEventListener("click", (e) => {
        let index = e.target.getAttribute("data-index");
        cart[index].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
      });
    });

    document.querySelectorAll(".decrease").forEach((button) => {
      button.addEventListener("click", (e) => {
        let index = e.target.getAttribute("data-index");
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();

      });
    });

    document.querySelectorAll(".remove").forEach((button) => {
      button.addEventListener("click", (e) => {
        let index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
        updateCartCount()

      });
    });
  }

  displayCart();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = cart.length;
  countbtn.textContent = count;
}

updateCartCount();

function updateCartTotal(total, shipping) {
  let totalPriceElemnt = document.querySelector(".cart-price1")
  if (!totalPriceElemnt) {
    totalPriceElemnt = document.createElement("div")
    totalPriceElemnt.className = "cart-price1"
    document.querySelector(".order-summary").appendChild(totalPriceElemnt)

  }
  let grandTotal = total + shipping;
  totalPriceElemnt.innerHTML = `
  <p class=" m-2 fs-5">order-summary</p>
   <hr class="m-0">
   <div class="cart-total">
   <span class = "">Subtotal:</span> 
    <span class="">$${total.toFixed(2)}</span>
    </div>
     <div>
   <span class="m">Shipping Fee:</span> 
    <span> $${shipping.toFixed(2)}</span>
    </div> <div>
   <span mx-2>Total:</span> 
    <span>$${grandTotal.toFixed(2)}</span>
    </div>
      
  `;

}

