let getBagItem = JSON.parse(localStorage.getItem("bagProducts")) || [];
let bagEmptyState = document.querySelector(".bag-empty-state");
let bagItemsPanel = document.querySelector(".bag-items-panel");
let bagItemsContainer = bagItemsPanel.querySelector(".bag-items-list");
let bagItemCountLabel = document.querySelector("#bag-item-count");
let bagSubTotalCon = document.querySelector("#bag-subtotal");
let bagDiscountCon = document.querySelector("#bag-discount");
let bagTotalCon = document.querySelector("#bag-total");

let bagProductsID = getBagItem;
const formatPrice = (price) => `$${price.toFixed(2)}`;

let Products = async () => {
    let fetchingProducts = await fetch("https://dummyjson.com/products?limit=0");

    if (!fetchingProducts.ok) {
        throw new Error("Products could not be loaded for the shopping bag.");
    }

    let productsIntoJF = await fetchingProducts.json();
    let product = productsIntoJF.products;

    if (getBagItem.length == 0) {
        bagItemsContainer.innerHTML = "";
        bagEmptyState.style.display = "flex";
        bagSubTotalCon.textContent = formatPrice(0);
        bagDiscountCon.textContent = `-${formatPrice(0)}`;
        bagTotalCon.textContent = formatPrice(0);
    }
    else {
        bagEmptyState.style.display = "none";
        let bagItemsHTML = "";
        let bagSubTotalCents = 0;
        let bagTotalCents = 0;

        getBagItem.forEach((e) => {
            let bagProduct = product.find((item) => item.id == e.productId);

            if (!bagProduct) {
                console.error(`Product ${e.productId} was not found in the product catalog.`);
                return;
            }

            let productBrand = bagProduct.brand || "";
            let productTitle = bagProduct.title;
            let productDisc = bagProduct.description;
            let productPrice = bagProduct.price;
            let minimumOrderQuantity = bagProduct.minimumOrderQuantity;
            let productId = bagProduct.id;
            let productImg = bagProduct.images || [];
            let productThumbnail = bagProduct.thumbnail || productImg[0];
            let productDiscountPercentage = bagProduct.discountPercentage || 0;
            let discountProductPrice = Number(
                (productPrice - productDiscountPercentage / 100 * productPrice).toFixed(2)
            );
            let productMeta = [productBrand, bagProduct.category].filter(Boolean).join(" · ");
            let productQuantity = Number(e.productQuantity) || 1;
            let discountDetails = "";

            if (productDiscountPercentage > 0) {
                discountDetails = `
                    <del>${formatPrice(productPrice * e.productQuantity)}</del>
                    <span class="bag-item-discount">${Math.round(productDiscountPercentage)}% off</span>
                `;
            }

            bagItemsHTML += `
                <article class="bag-item">
                    <div class="bag-item-image">
                        <img src="${productThumbnail}" alt="${productTitle}" loading="lazy">
                    </div>
                    <div class="bag-item-details">
                        <p class="bag-item-meta">${productMeta}</p>
                        <h3 class="bag-item-title">${productTitle}</h3>
                        <p class="bag-item-description">${productDisc}</p>
                        <div class="bag-item-footer">
                            <div class="bag-item-price">
                                <strong class="bag-item-current-price">${formatPrice(discountProductPrice * e.productQuantity)}</strong>
                                ${discountDetails}
                            </div>
                            <div class="bag-item-quantity" data-product-id="${productId}" role="group" aria-label="Quantity">
                                <button type="button" class="dec-btn" aria-label="Decrease quantity">−</button>
                                <span class="productQ">${productQuantity}</span>
                                <button type="button" class="inc-btn" aria-label="Increase quantity">+</button>
                            </div>
                        </div>
                    </div>
                </article>
            `;
            bagSubTotalCents += Math.round(productPrice * 100) * productQuantity;
            bagTotalCents += Math.round(discountProductPrice * 100) * productQuantity;
        });
        
        bagItemsContainer.innerHTML = bagItemsHTML;
        let bagSubTotal = bagSubTotalCents / 100;
        let bagTotal = bagTotalCents / 100;
        let bagDiscount = bagSubTotal - bagTotal;
        bagSubTotalCon.textContent = formatPrice(bagSubTotal);
        bagDiscountCon.textContent = `-${formatPrice(bagDiscount)}`;
        bagTotalCon.textContent = formatPrice(bagTotal);


            async function quantityBehav(productId, incOrDec) {
                let res = await fetch(`https://dummyjson.com/products/${productId}`);
                let product = await res.json();

                if (incOrDec == "increment") {
                    let minOrderQ = product.minimumOrderQuantity;
                    let targetedProduct = getBagItem.find((item) => {
                        return item.productId == productId;
                    });
                    let index = bagProductsID.findIndex((elem, index) => {
                         return elem.productId == productId; 
                    });
                    if (targetedProduct.productQuantity < minOrderQ) {
                        let productQ = targetedProduct.productQuantity + 1;
                        bagProductsID.splice(index, 1, {
                            productId: productId,
                            productQuantity: productQ,
                        });
                        localStorage.setItem("bagProducts", JSON.stringify(bagProductsID));
Products();
                    }
                    else {
                        bagProductsID.splice(index, 1, {
                            productId: productId,
                            productQuantity: minOrderQ,
                        });
                        localStorage.setItem("bagProducts", JSON.stringify(bagProductsID));
                        console.log("reached max limit");
                        Products();
                    }
                }
                if (incOrDec == "decrement") {
                    let minOrderQ = product.minimumOrderQuantity;
                    let targetedProduct = getBagItem.find((item) => {
                        return item.productId == productId;
                    });
                    let index = bagProductsID.findIndex((elem, index) => {
                         return elem.productId == productId; 
                    });
                    if (targetedProduct.productQuantity <= minOrderQ && targetedProduct.productQuantity > 1) {
                        let productQ = targetedProduct.productQuantity - 1;
                        bagProductsID.splice(index, 1, {
                            productId: productId,
                            productQuantity: productQ,
                        });
                        localStorage.setItem("bagProducts", JSON.stringify(bagProductsID));
                        Products();

                    }
                    else {
                        bagProductsID.splice(index, 1);
                        localStorage.setItem("bagProducts", JSON.stringify(bagProductsID));
                        console.log("reached max limit");
                        Products();
                    }
                }
            }
            let bagItemQuantity = document.querySelectorAll(".bag-item-quantity");
            bagItemQuantity.forEach(element => {

                let productIdFromData = element.dataset.productId;

                element.addEventListener("click", elem => {
                    elem.stopPropagation();
                    if (elem.target.classList == "inc-btn") {
                        console.log(elem.target);
                        // let productQCon = element.querySelector(".productQ");
                        // productQCon.innerHTML = 3;
                        quantityBehav(productIdFromData, "increment");
                    }
                    if (elem.target.classList == "dec-btn") {
                        console.log(elem.target);
                                                quantityBehav(productIdFromData, "decrement");

                    }
                });
            });

     
    }

    bagItemCountLabel.textContent = `${getBagItem.length} ${getBagItem.length === 1 ? "item" : "items"}`;

};

Products();
