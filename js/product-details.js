const productTag = document.querySelector(".eyebrow");
const productName = document.querySelector("#product-name");
const detailPrice = document.querySelector(".detail-price");
const discountPrice = document.querySelector(".discount-price");
const priceWrap = document.querySelector(".price-wrap");
const productDescription = document.querySelector(".product-description");
const ratingNum = document.querySelectorAll(".rating-num");
const numOfReview = document.querySelectorAll(".num-of-review");
const reviewerNameCon = document.querySelector(".reviewer-name");
const reviewerEmailCon = document.querySelector(".reviewer-email");
const reviewerCommentCon = document.querySelector(".reviewer-comment");
const reviewDateCon = document.querySelector(".review-date");
const reviewList = document.querySelector(".review-list");
const productBrandCon = document.querySelector("#product-brand");
const productStarCon = document.querySelectorAll(".stars");
const productShippInfoCon = document.querySelector("#shipping-information");
const productDelRetInfoCon = document.querySelector("#delivery-return");
const productSpecListCon = document.querySelector(".product-spec-list");
const discountBadgeCon = document.querySelector(".discount-badge");
const productWarrantyInformationCon = document.querySelector("#warranty-information");
const purchaseRow = document.querySelector(".purchase-row");



document.querySelectorAll(".color-swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".color-swatch").forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-checked", "false");
    });
    swatch.classList.add("active");
    swatch.setAttribute("aria-checked", "true");
    document.querySelector("#selected-color").textContent =
      swatch.dataset.color;
  });
});

function ratingStarFunc(productRating){
    let starsss = "";
for (let i = 1; i <= 5; i++) {
    if(i <= Math.round(productRating)){
        starsss += "★";
    }
    else{
        starsss += "☆";
    }
}
return starsss;
};

const params = new URLSearchParams(window.location.search);
const productIdFromUrl = params.get("id");

let Products = async () => {
  let fetchingProducts = await fetch(
    `https://dummyjson.com/products/${productIdFromUrl}`,
  );
  let productsIntoJF = await fetchingProducts.json();
  let product = productsIntoJF;
  console.log(product);



  let productId = product.id;
  let productTags = product.tags;
  let productBrand = product.brand;
  let productTitle = product.title;
  let productDisc = product.description;
  let productPrice = product.price;
  let productImg = product.images;
  let productThumbnail = product.thumbnail;
  let productReviews = product.reviews;
  let productRating = product.rating;
  let productReturnPolicy = product.returnPolicy;
  let productShippingInformation = product.shippingInformation;
  let productWarrantyInformation = product.warrantyInformation;
  let productDiscountPercentage = product.discountPercentage;
  let minimumOrderQ = product.minimumOrderQuantity;
  let discountProductPrice =(productPrice - (productDiscountPercentage/100 * productPrice)).toFixed(2); 
  
  purchaseRow.innerHTML += `
<button class="add-to-bag add-to-bag" type="button" data-product-id="${productId}" id="add-to-bag">
                            <span class="go-to-bag">Add to bag</span>
                            <span class="bag-price"></span>
                        </button>
`;
const bagPrice = document.querySelector(".bag-price");

  const productSpecs = [
    ["Brand", product.brand],
    ["Category", product.category],
    ["SKU", product.sku],
    ["Weight", `${product.weight} g`],
    ["Dimensions", `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth}`],
    ["Stock", product.stock],
    ["Availability", product.availabilityStatus],
    ["Warranty", product.warrantyInformation],
    ["Minimum order", product.minimumOrderQuantity],
  ];
  console.log(productSpecs);
  productSpecs.forEach(([label, value])=> {
    if(value != undefined){
      productSpecListCon.innerHTML += `<li>
      <strong>${label}:</strong>
      <span>${value}</span>
      </li>`;
      }
  });
  
  productName.textContent = productTitle;
  if(productDiscountPercentage > 0){
    discountBadgeCon.textContent = productDiscountPercentage+ "%" + " off";
    discountPrice.textContent ="$" +  discountProductPrice;
    detailPrice.textContent = productPrice;
    priceWrap.classList.add("has-discount");
    bagPrice.textContent = "$" + discountProductPrice;
  }
  else{
    discountBadgeCon.hidden=true;
    priceWrap.classList.remove("has-discount");
    detailPrice.textContent = "$" + productPrice;
    bagPrice.textContent = "$" + productPrice;
  }
  productDescription.textContent = productDisc;
  productDelRetInfoCon.textContent = productReturnPolicy;
  productShippInfoCon.textContent = productShippingInformation ;
  productWarrantyInformationCon.textContent = productWarrantyInformation ;



  numOfReview.forEach(elem => {
    elem.textContent = productReviews.length;
  });
  ratingNum.forEach(elem => {
    elem.textContent = productRating;;
  });
  
  productStarCon.forEach(elem => {
    elem.textContent = ratingStarFunc(productRating);

  });
  
  productBrandCon.textContent = productBrand;




  productTags.forEach((element) => {
    productTag.textContent += `${element} / `;
  });
  const gallThumbnails = document.querySelector(".gallery-thumbnails");
  const mainProductImg = document.querySelector("#main-product-image");
  mainProductImg.src = productThumbnail;
  productImg.forEach((elem) => {
    console.log(elem);
    gallThumbnails.innerHTML += `
         <button class="gallery-thumb active" type="button" data-image="${elem}" aria-label="View product image 1">
                            <img src="${elem}" alt="">
                        </button>
      `;
  });

  const mainImage = document.querySelector("#main-product-image");
  const thumbnails = document.querySelectorAll(".gallery-thumb");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbnails.forEach((item) => item.classList.remove("active"));
      thumb.classList.add("active");
      mainImage.src = thumb.dataset.image;
    });
  });

  productReviews.forEach((elem, index) => {
    let rEmail = elem.reviewerEmail;
    let rName = elem.reviewerName;
    let rComment = elem.comment;
    let rRating = elem.rating;
    let rDate = elem.date;
    reviewList.innerHTML += `
   <article class="review-card">
                        <div class="review-meta">
                            <span class="stars" aria-label="4 out of 5 stars">${ratingStarFunc(rRating)}</span>
                            <time class="review-date" datetime="${rDate}"></time>
                        </div>
                        <!-- <h3>Excellent quality!</h3> -->
                        <p class="reviewer-comment">${rComment}</p>
                        <strong class="reviewer-name">${rName}</strong>
                        <a class="reviewer-email" href="mailto:aaliyah.hanson@x.dummyjson.com">${rEmail}</a>
                    </article>
`;
  });
let script = document.createElement("script");

script.src = "js/add-to-bag.js";

document.body.appendChild(script);
};
Products();
