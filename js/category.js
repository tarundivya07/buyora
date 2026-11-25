const params = new URLSearchParams(window.location.search);
const category = params.get("category");
console.log(category);

let productCon = document.querySelector(".product-grid");
let cateTitle = document.querySelector("#category-title");

cateTitle.textContent = category
    ? category.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Products";
let Products = async () => {
    let fetchingProducts = await fetch(`https://dummyjson.com/products/category/${category}`);
    let productsIntoJF = await fetchingProducts.json();
    let products = productsIntoJF.products;
    console.log(products);

    products.forEach((element, index) => {
        let productId = products[index].id;
        let productBrand = products[index].brand;
        let productTitle = products[index].title;
        let productDisc = products[index].description;
        let productPrice = products[index].price;
        let minimumOrderQ = products[index].minimumOrderQuantity;
        let productImg = products[index].images[0];

        productCon.innerHTML += `
        <div class="product-tile">
        <button class="like-button" type="button" aria-label="Like product"></button>
         <article class="product-card" data-product-id="${productId}">
                    <div class="product-image">
                        <img src="${productImg}" alt="Wireless headphones">
                    </div>
                    <p class="product-category">${category}</p>
                    <h3>${productTitle}</h3>
                    <p class="price">$${productPrice}</p>
                    <button class="add-to-bag" type="button" data-product-id="${productId}" data-product="Studio Wireless Headphones"><span class="go-to-bag">Add to bag</span></button>
                </article>
                </div>
        `;
    });
    let productCard = document.querySelectorAll(".product-card");
    productCard.forEach(elem => {
        elem.addEventListener("click", (e) => {
            window.location.href = `product-details.html?id=${elem.dataset.productId}`;
        });
    });
    let script = document.createElement("script");

script.src = "js/add-to-bag.js";

document.body.appendChild(script);
}
Products();

