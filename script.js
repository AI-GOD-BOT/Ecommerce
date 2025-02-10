let productsDiv = document.querySelector(".products")
let buttons = document.querySelectorAll(".button2")
let opt = document.querySelector(".options")
let countbtn = document.getElementById("countDisplay")
// let womenClothing = document.querySelectorAll(".button2")[2]
// let jewelery = document.querySelectorAll(".button2")[3]
// let elctronic = document.querySelectorAll(".button2")[4]


let productdata = []
let cartitem = new Set()
let count = 0
console.log(productdata);


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
            <a href="#" class="btn btn-primary addtocart " data-id="${da.id}" >Add to cart</a>
             <a href="./productDetailsPage.html?id=${da.id}" class="btn btn-primary Details " data-id="${da.id}" >Details</a>
          </div>
        </div>
      </div>
      `

  })
  productsDiv.innerHTML = value;
  // attachCartListeners();
  // let detailsButtons = document.querySelectorAll(".Details");
  // detailsButtons.forEach(buttons => {
  //   buttons.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     let productId = e.target.getAttribute("data-id");
  //     console.log(productId);


  //   })
  // })

}
function attachCartListeners() {
  let cartButtons = document.querySelectorAll(".addtocart");
  cartcount.forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault()
      let productid = button.getAttribute("data-product-id");
      if (!cartitem.has(productid)) {
        cartitem.add(productid);
        count++
        countbtn.textContent = count
        console.log(count);
      }
    })
  });
}
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
let slider = document.querySelector(".silder-loop");

async function fetchAll(category) {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    const filteredProducts = products.filter(prod => prod.category === category).slice(0, 5);
    slideShow(filteredProducts);
  } catch (error) {
    console.error("Error fetching products for slider:", error);
  }

}

function slideShow(products) {

  slider.innerHTML = "";
  products.forEach((product) => {
    let slide = document.createElement("img");
    slide.src = product.image;
    slide.alt = product.title;
    slide.classList.add("slide")

    slider.appendChild(slide);
  });
  startAutoSlide();
}
let index = 0;
function startAutoSlide() {
  let slides = document.querySelectorAll(".slide");

  if (slides.length === 0) return;

  setInterval(() => {
    slides.forEach((slide) => (slide.style.display = "none")); // Hide all
    slides[index].style.display = "block"; // Show current image
    index = (index + 1) % slides.length; // Move to next image
  }, 3000);
}