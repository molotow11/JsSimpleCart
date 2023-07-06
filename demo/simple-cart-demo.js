document.addEventListener("DOMContentLoaded", () => {
  const productSelectors = {
    product: ".product__element",
    buttonAddToCart: ".cart",
    title: ".title",
    price: ".price",
    qty: ".qty",
    currency: '$'
  };

  const cartSelectors = {
    body: "SimpleCart",
    details: "SimpleCartDetails",
    detailsClose: ".SimpleCartDetails__close",
    detalisHidden: "SimpleCartDetails-hidden",
  };

  const cartCookieDays = 7;
  const formSubmitUrl = "/order-submit.php";
  const cookieProductsName = "SimpleCart";

  const productsOnSite = document.querySelectorAll(productSelectors.product);

  function ifProductAddedInCart(productsInCart = []) {
    productsOnSite.forEach((siteProduct) => {
      let isInCart = false;

      productsInCart.forEach((cartProduct) => {
        const siteProductTitle = siteProduct.querySelector(
          productSelectors.title
        ).textContent;

        if (cartProduct.title === siteProductTitle) {
          isInCart = true;
        }
      });

      if (isInCart) {
        siteProduct.classList.add("SimpleCart-inCart");
      } else {
        siteProduct.classList.remove("SimpleCart-inCart");
      }
    });
  }

  function createClass(selector) {
    return selector.split(".").join('');
  }

  function useCartLayout({ body, details, detailsClose, detalisHidden }) {
    const cart = document.getElementById(body);
    const cartDetails = document.getElementById(details);
    const cartDetailsClose = cartDetails.querySelector(detailsClose);

    cart.style.display = "block";

    cart.addEventListener("click", () => {
      cartDetails.classList.remove(detalisHidden);
    });

    cartDetailsClose.addEventListener("click", () => {
      cartDetails.classList.add(detalisHidden);
    });

    document.body.addEventListener("click", (e) => {
      if (e.target.closest(`#${body}`)) return;
      if (e.target.closest(`#${details}`)) return;
      if (cartDetails.classList.contains(detalisHidden)) return;
      cartDetails.classList.add(detalisHidden);
    });
  }

  function buildCartLayout(source = "cookie") {
    let productsCount = 0;
    let productsTotalPrice = 0;
    let products;

    if (source === "cookie") {
      products =
        (getCookie(cookieProductsName) &&
          JSON.parse(getCookie(cookieProductsName))) ||
        [];
    } else {
      products = getCartProducts();
    }

    const cartDetails = document.getElementById(cartSelectors.details);
    const cartDetailsProducts = cartDetails.querySelector(
      ".SimpleCartDetails__products"
    );
    const cartDetailsProductsCount = cartDetails.querySelector(
      ".SimpleCartDetails__productsCount"
    );
    const cartDetailsTotalPrice = cartDetails.querySelector(
      ".SimpleCartDetails__totalPrice"
    );

    //update detailed cart
    cartDetailsProducts.innerHTML = "";

    products.forEach((product) => {
      const productLayout = `
        <li>
          <span class='${createClass(productSelectors.title)}'>${
            product.title
          }</span>
          <span class='${createClass(productSelectors.price)}'>${
            product.price} ${
            productSelectors.currency
          }</span>
          <span class='qty-sign'>x</span>
          <span>
            <input class='${createClass(productSelectors.qty)}' type='number' min='0' value='${product.qty}'>
          </span>
        </li>
      `;
      cartDetailsProducts.insertAdjacentHTML("beforeend", productLayout);
      productsCount++;
      productsTotalPrice += product.price * product.qty;
    });

    productsTotalPrice = productsTotalPrice.toFixed(2);
    cartDetailsProductsCount.textContent = productsCount;
    cartDetailsTotalPrice.textContent = productsTotalPrice;

    //update mini cart
    const cartMini = document.getElementById(cartSelectors.body);
    const cartMiniTotals = cartMini.querySelector(".SimpleCartDetails__totals");
    const cartMiniEmpty = cartMini.querySelector(".SimpleCart-empty");
    const cartDetailsTotals = cartDetails.querySelector(
      ".SimpleCartDetails__totals"
    );

    if (productsCount > 0) {
      if (cartMiniTotals) {
        cartMiniTotals.replaceWith(cartDetailsTotals.cloneNode(true));
      } else {
        cartMini.appendChild(cartDetailsTotals.cloneNode(true));
      }

      cartMiniEmpty.style.display = "none";
    } else {
      cartMiniEmpty.style.display = "block";

      if (cartMiniTotals) {
        cartMiniTotals.style.display = "none";
      }
    }

    ifProductAddedInCart(products);
  }

  async function fetchUrl({
    url: url,
    method: method = "GET",
    body: body,
    callback: callback,
  }) {
    try {
      const res = await fetch(url, {
        method: method,
        body: body,
      });

      //if (!res.ok) return;
      if (!callback) return;
      callback();
    } catch (err) {
      console.log(err);
    }
  }

  function clearString(string = "") {
    return string.replace(/\n|\r/g, "").replace(/\s+/g, " ").trim();
  }

  function getCartProducts() {
    const products = [];
    const cartProducts = document
      .getElementById(cartSelectors.details)
      .querySelectorAll(".SimpleCartDetails__products li");

    cartProducts.forEach((product) => {
      const addedProduct = {
        title: product.querySelector(productSelectors.title).textContent,
        price: parseFloat(
          product.querySelector(productSelectors.price).textContent
        ),
        qty: parseInt(product.querySelector(productSelectors.qty).value),
      };

      if (addedProduct.qty > 0) {
        products.push(addedProduct);
      }
    });
    return products;
  }

  //rebuild cart layout and products

  function saveCartFromLayout() {
    const products = getCartProducts();
    setCookie(cookieProductsName, JSON.stringify(products), cartCookieDays);
  }

  function addToCart(product) {
    const products =
      (getCookie(cookieProductsName) &&
        JSON.parse(getCookie(cookieProductsName))) ||
      [];

    if (products.length) {
      let isExistingProduct = false;

      products.forEach((addedProduct) => {
        if (addedProduct.title === product.title) {
          addedProduct.qty = addedProduct.qty + product.qty;
          isExistingProduct = true;
        }
      });

      if (!isExistingProduct) {
        products.push(product);
      }
    } else {
      products.push(product);
    }

    console.log("Product added: ", product);
    setCookie(cookieProductsName, JSON.stringify(products), cartCookieDays);
    buildCartLayout();
  }

  function clearCookie({ name: name, callback: callback }) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

    if (!callback) return;

    buildCartLayout();
  }

  function setCookie(name, value = "", days = null) {
    let expires = "";

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `expires=${date.toUTCString()}`;
    }

    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (var i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);

      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  //cart init
  if (productsOnSite.length) {
    const cart = document.getElementById(cartSelectors.body);
    const cartDetails = document.getElementById(cartSelectors.details);
    const popup = document.getElementById("SimpleCartOrderPopup");
    const cartDetailsClear = cartDetails.querySelector(
      ".SimpleCartDetails__clearCart"
    );
    const cartDetailsNotEmpty = cartDetails.querySelector(
      ".SimpleCartDetails__totals"
    );
    const popupOpenButton = cartDetails.querySelector(
      ".SimpleCartDetails__place-order"
    );
    const popupCloseButton = popup.querySelector(
      ".SimpleCartOrderPopup__close"
    );
    const popupOpened = popup.querySelector(".SimpleCartOrderPopup__backdrop");
    const popupFrom = popup.querySelector(".SimpleCartOrderPopup__form");
    const popupFormBody = popup.querySelector(".SimpleCartOrderPopup__body");
    const popupFormSent = popup.querySelector(".SimpleCartOrderPopup-success");
    const popupOrder = popup.querySelector(".SimpleCartOrderPopup__orderList");
    const source = "cart";

    buildCartLayout();
    useCartLayout(cartSelectors);

    //Change qty in detailed cart
    document.body.addEventListener("change", (e) => {
      if (!e.target.classList.contains(createClass(productSelectors.qty))) return;

      buildCartLayout(source);
      saveCartFromLayout();
    });

    //Order popup
    popupOpenButton.addEventListener("click", () => {
      const products = getCartProducts();
      let totals = cartDetailsNotEmpty.cloneNode(true);

      totals.querySelector("button").remove();
      totals.querySelector(".SimpleCartDetails__clearCart").remove();
      totals = clearString(totals.textContent);
      popupOrder.value = "";

      products.forEach((product) => {
        let value = `${product.title} - ${product.price} Р x ${product.qty}`;
        value +=
          "\r\n-----------------------------------------------------------\r\n";
        popupOrder.value += value;
      });

      popupOrder.value += totals;
      popup.classList.add("visible");
      cartDetails.classList.add(cartSelectors.detalisHidden);
    });

    popupCloseButton.addEventListener("click", () => {
      popup.classList.remove("visible");
    });
    popupOpened.addEventListener("click", () => {
      popup.classList.remove("visible");
    });

    popupFrom.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(popupFrom);

      fetchUrl({
        url: formSubmitUrl,
        method: "POST",
        body: formData,
        callback: () => {
          popupFormBody.style.display = "none";
          popupFormSent.style.display = "block";
          clearCookie({
            name: cookieProductsName,
            callback: buildCartLayout,
          });
        },
      });
    });

    //bind buy buttons click
    productsOnSite.forEach((product) => {
      const addToCartBtn = product.querySelector(
        productSelectors.buttonAddToCart
      );

      addToCartBtn.addEventListener("click", () => {
        const addedProduct = {
          title: product.querySelector(productSelectors.title).textContent, // prepare product title
          price: parseFloat(
            product.querySelector(productSelectors.price).textContent
          ), // prepare product price
          qty:
            parseInt(product.querySelector(productSelectors.qty)?.value) || 1,
        };

        addToCart(addedProduct);
        cart.classList.add("productAdded");
        setTimeout(() => {
          cart.classList.remove("productAdded");
        }, 1000);
      });
    });

    //clear cart button
    cartDetailsClear.addEventListener("click", () => {
      clearCookie({
        name: cookieProductsName,
        callback: buildCartLayout,
      });
    });
  }
});
