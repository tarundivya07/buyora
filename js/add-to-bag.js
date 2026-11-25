let addToBagBtn = document.querySelectorAll(".add-to-bag");
//    let addToBagBtn = document.querySelectorAll(".go-to-bag");

let getBagItem = JSON.parse(localStorage.getItem("bagProducts")) || [];
getBagItem.forEach(e => {
    console.log("Bagitem: " + e);
});
let bagProductsID = getBagItem;

addToBagBtn.forEach(element => {
    element.setAttribute("data-goToBagBtnStatus", "inactive");
    element.addEventListener("click", e => {
        e.stopPropagation();
        if (e.target.closest(".add-to-bag").dataset.gotobagbtnstatus == "inactive") {

            let productId = e.target.closest(".add-to-bag").dataset.productId;

            let isProductExist = bagProductsID.some(
                item => item.productId === productId
            );
            if (isProductExist) {
                bagProductsID.forEach((ele, index) => {
                    if (ele.productId == productId) {
                        let funcCall = async () => {
                            let res = await fetch(`https://dummyjson.com/products/${productId}`);
                            let product = await res.json();
                            console.log(product);
                            console.log(product.minimumOrderQuantity);
                            if (ele.productQuantity < product.minimumOrderQuantity) {
                                console.log("dfdfjdkfjadlfdjsdfjlsdkf");

                                let productQuantity = ele.productQuantity + 1;
                                console.log(productQuantity);
                                bagProductsID.splice(index, 1, {
                                    productId: productId,
                                    productQuantity: productQuantity,
                                });

                                console.log(productId);
                                localStorage.setItem("bagProducts", JSON.stringify(bagProductsID));

                                e.target.closest(".add-to-bag").querySelector(".go-to-bag").textContent = "Go to bag";
                                e.target.closest(".add-to-bag").setAttribute("data-goToBagBtnStatus", "active");
                                console.log("Added to cart");
                                
                            }
                            else{
                                e.target.closest(".add-to-bag").querySelector(".go-to-bag").textContent = "Max reached item";
                                e.target.closest(".add-to-bag").setAttribute("data-goToBagBtnStatus", "active");
                                console.log("Max reached item");
                            }

                        };
                        funcCall();
                    }

                });
            }
            else {
                bagProductsID.push({
                    productId: productId,
                    productQuantity: 1,

                });

                console.log(productId);
                localStorage.setItem("bagProducts", JSON.stringify(bagProductsID));

                e.target.closest(".add-to-bag").querySelector(".go-to-bag").textContent = "Go to bag";
                e.target.closest(".add-to-bag").setAttribute("data-goToBagBtnStatus", "active");

                console.log("Added to cart");
            }

        }
        else {
            window.location.href = "bag.html";
        }
    });
});
