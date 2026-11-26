const params = new URLSearchParams(window.location.search);
const searchQuery = params.get("searchq") || "";
const searchTitle = document.querySelector("#search-title");
const searchSummary = document.querySelector("#search-summary");
const searchResultsCon = document.querySelector(".search-results-con");
const searchResultsCount = document.querySelector("#search-results-count");

searchTitle.textContent = `Search results for "${searchQuery}"`;
searchSummary.textContent = `Products matching "${searchQuery}".`;

async function loadSearchResults(searchInputText) {
    const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchInputText)}`);
    if (!res.ok) {
        throw new Error("Search results could not be loaded");
    }

    const resIntoJson = await res.json();
    const resProducts = resIntoJson.products;

    searchResultsCount.textContent = `${resProducts.length} products`;

    if (resProducts.length === 0) {
        searchResultsCon.innerHTML = `
            <p class="search-empty-state">No products found for "${searchInputText}".</p>
        `;
        return;
    }

    searchResultsCon.innerHTML = resProducts.map((product) => {
        const productTitle = product.title;
        const productCategory = product.category;
        const productImg = product.thumbnail;
        const productPrice = product.price;
        const productId = product.id;
        const productRating = product.rating;

        return `
            <article class="product-card" data-product-id="${productId}">
                <div class="product-image">
                    <img src="${productImg}" alt="${productTitle}">
                </div>
                <p class="product-category">${productCategory}</p>
                <h3>${productTitle}</h3>
                <p class="price">$${productPrice.toFixed(2)}</p>
                <p class="search-product-rating">★ ${productRating}</p>
            </article>
        `;
    }).join("");

    let productCard = document.querySelectorAll(".product-card");
        console.log(productCard);
        productCard.forEach(elem => {
            elem.addEventListener("click", (e) => {
                e.stopPropagation();
                window.location.href = `product-details.html?id=${elem.dataset.productId}`;
            });
        });
}

loadSearchResults(searchQuery);
