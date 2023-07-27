const settings = {
  productSelectors: {
    product: ".product", // add class to each product on your site *
    buttonAddToCart: ".product__add-to-cart-button", // add class to each button in your product *
    title: ".product__title", // add class to each title in your product *
    price: ".product__price", // add class to each price in your product *
    qty: ".product__qty",
    currency: ".product__currency", // add class to each currency in your product *
  },
  cartSelectors: {
    body: "SimpleCart",
    details: "SimpleCartDetails",
    detailsClose: ".SimpleCartDetails__close",
    detalisHidden: "SimpleCartDetails--hidden",
    productAdded: "SimpleCart--product-added",
    productNotAdded: "SimpleCart--product-not-added",
  },
  currencies: {
    parentSelector: "products__currencies", // add id to place in your site a currencies select
    BASE: "RUB",  // set base currency of products *
    list: [
      {
        BASE: "USD", // set one of two currencies *
        symbol: "$", // set one of two currencies symbols *
      },
      {
        BASE: "RUB", // set two of two currencies
        symbol: "₽", // set two of two currencies symbols
        rates: {
          USD: 90, // set the exchange rate of the first currency to the second
        },
      },
    ],
  },
  cartCookieDays: 7, // set the time data saved to the user
  formSubmitUrl: "/order-submit.php",
  cookieProductsName: "SimpleCart",
};

const productsOnSite = document.querySelectorAll(
  settings.productSelectors.product
);

function debounce(callback, delay = 0) {
  let debounceTimeout;

  return (...args) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function ifProductAddedInCart(productsInCart = []) {
  productsOnSite.forEach((siteProduct) => {
    let isInCart = false;

    productsInCart.forEach((cartProduct) => {
      const siteProductTitle = siteProduct.querySelector(
        settings.productSelectors.title
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
  return selector.split(".").join("");
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
    const cartCookie = getCookie(settings.cookieProductsName);

    products = (cartCookie && JSON.parse(cartCookie)) || [];
  } else {
    products = getCartProducts();
  }

  const cartDetails = document.getElementById(settings.cartSelectors.details);
  const cartDetailsProducts = cartDetails.querySelector(
    ".SimpleCartDetails__products"
  );
  const cartDetailsProductsCount = cartDetails.querySelector(
    ".SimpleCartDetails__productsCount"
  );
  const cartDetailsTotalPrice = cartDetails.querySelector(
    ".SimpleCartDetails__totalPrice"
  );
  const closeButton = cartDetails.querySelector(".SimpleCartDetails__close");
  const cartMini = document.getElementById(settings.cartSelectors.body);
  const cartMiniTotals = cartMini.querySelector(".SimpleCartDetails__totals");
  const cartDetailsTotals = cartDetails.querySelector(
    ".SimpleCartDetails__totals"
  );

  //update detailed cart
  cartDetailsProducts.textContent = "";

  products?.forEach((product) => {
    const productLayout = `
      <div>
        <span class='${createClass(settings.productSelectors.title)}'>${
      product.title
    }</span>
        <span class='${createClass(settings.productSelectors.price)}'>${
      product.price
    } <span class='${createClass(settings.productSelectors.currency)}'>${
      product.currency
    }</span></span>
        <span>&#120;</span>
        <span>
          <input class='${createClass(
            settings.productSelectors.qty
          )}' type='number' min='0' value='${product.qty}'>
        </span>
      </div>
    `;
    const listElement = document.createElement("li");
    const removeButton = closeButton.cloneNode(true);

    removeButton.classList = `${createClass(
      settings.productSelectors.product
    )}__remove-button`;
    listElement.insertAdjacentHTML("beforeend", productLayout);
    listElement.appendChild(removeButton);
    cartDetailsProducts.appendChild(listElement);

    productsCount++;
    productsTotalPrice += product.price * product.qty;

    removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      listElement.remove();
      buildCartLayout("cart");
      saveCartFromLayout();
    });
  });

  if (productsCount) {
    const space = "\u00A0";

    productsTotalPrice = `
      ${productsTotalPrice.toFixed(2)}${space}${products[0]?.currency}
    `;
    cartDetailsProductsCount.textContent = productsCount;
    cartDetailsTotalPrice.textContent = productsTotalPrice;
    cartMiniTotals?.remove();
    cartMini.appendChild(cartDetailsTotals.cloneNode(true));
  }

  cartMini.classList.toggle("SimpleCart--empty", !productsCount);
  cartDetails.classList.toggle("SimpleCartDetails--empty", !productsCount);

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

function addedProduct(product = {}, method = "get") {
  let qty = parseInt(
    product.querySelector(settings.productSelectors.qty)?.value
  );
  if (method === "add") {
    qty = qty || 1;
  }

  return {
    title: product.querySelector(settings.productSelectors.title).textContent,
    price: parseFloat(
      product.querySelector(settings.productSelectors.price).textContent
    ),
    currency: product.querySelector(settings.productSelectors.currency)
      .textContent,
    qty: qty || 0,
  };
}

function getCartProducts() {
  const products = [];
  const cartProducts = document
    .getElementById(settings.cartSelectors.details)
    .querySelectorAll(".SimpleCartDetails__products li");

  cartProducts.forEach((product) => {
    const getAddedProduct = addedProduct(product);

    if (getAddedProduct.qty > 0) {
      products.push(getAddedProduct);
    }
  });
  return products;
}

//rebuild cart layout and products

function saveCartFromLayout() {
  const products = getCartProducts();
  setCookie(
    settings.cookieProductsName,
    JSON.stringify(products),
    settings.cartCookieDays,
  );
}

function addToCart({
  product: product = {},
  callback: callback = null,
  errorCallback: errorCallback = null,
}) {
  const cartCookie = getCookie(settings.cookieProductsName);
  const products = (cartCookie && JSON.parse(cartCookie)) || [];

  if (products.length) {
    const cartProductsCurrency = products[0].currency;
    let isExistingProduct = false;

    if (product.currency !== cartProductsCurrency) {
      if (!errorCallback) return;
      return errorCallback();
    }

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

  callback && callback();
  console.log("Product added: ", product);
  setCookie(
    settings.cookieProductsName,
    JSON.stringify(products),
    settings.cartCookieDays,
  );
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

function buildCurrencySelect({
  parentID = "",
  baseCurrency = "",
  onChange = null,
}) {
  if (!parentID || !baseCurrency) return;

  const parent = document.getElementById(parentID);
  const currenciesSelector = document.createElement("select");
  const currenciesList = settings.currencies.list;

  currenciesList.forEach(({ BASE, symbol }) => {
    const option = `<option value="${symbol}">Price in ${BASE}</option>`;

    if (BASE === baseCurrency) {
      currenciesSelector.insertAdjacentHTML("afterbegin", option);
      return;
    }

    currenciesSelector.insertAdjacentHTML("beforeend", option);
  });

  currenciesSelector[0].setAttribute("selected", "");
  parent?.appendChild(currenciesSelector);

  if (!onChange) return;

  onChange(parent);
}

function onChangeCurrency(productsCurrency) {
  productsCurrency?.addEventListener("change", (e) => {
    const selectedCurrnecy = e.target.value;

    productsOnSite.forEach((product) => {
      const productCurrency = product.querySelector(
        settings.productSelectors.currency
      );
      const firstCurrencySymbol = settings.currencies.list[0].symbol;
      const secondCurrencySymbol = settings.currencies.list[1].symbol;
      const toCurrencyRate = settings.currencies.list[1].rates.USD;
      let productPrice = product.querySelector(settings.productSelectors.price);
      let productPriceValue = +productPrice.textContent;

      productCurrency.textContent = selectedCurrnecy;

      if (selectedCurrnecy === firstCurrencySymbol) {
        productPriceValue = productPriceValue / toCurrencyRate;
      }
      if (selectedCurrnecy === secondCurrencySymbol) {
        productPriceValue = productPriceValue * toCurrencyRate;
      }

      productPriceValue = productPriceValue.toFixed(2);
      productPrice.textContent = productPriceValue;
    });
  });
}

function findBaseCurrencySymbol() {
  const baseSiteCurrencyCode = settings.currencies.BASE;
  const currenciesList = settings.currencies.list;
  const baseCurrency = currenciesList.find(({ BASE }) => {
    return BASE === baseSiteCurrencyCode;
  });

  return baseCurrency.symbol;
}

function elementOutOfDimensions({element, event, callback}) {
    const dialogDimensions = element.getBoundingClientRect();

    if (
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom
    )  {
      callback();
    }
  }

//cart init
if (productsOnSite.length) {
  const cart = document.getElementById(settings.cartSelectors.body);
  const cartDetails = document.getElementById(settings.cartSelectors.details);
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
  const popupCloseButton = popup.querySelector(".SimpleCartOrderPopup__close");
  const popupFrom = popup.querySelector(".SimpleCartOrderPopup__form");
  const popupOrder = popup.querySelector(".SimpleCartOrderPopup__orderList");
  const source = "cart";

  const baseCurrencySymbol = findBaseCurrencySymbol();

  buildCartLayout();
  useCartLayout(settings.cartSelectors);
  buildCurrencySelect({
    parentID: settings.currencies.parentSelector,
    baseCurrency: settings.currencies.BASE,
    onChange: onChangeCurrency,
  });

  //Change qty in detailed cart
  document.body.addEventListener("change", (e) => {
    if (
      !e.target.classList.contains(createClass(settings.productSelectors.qty))
    )
      return;

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
      let value = `${product.title} - ${product.price} ${product.currency} x ${product.qty}`;
      value +=
        "\r\n-----------------------------------------------------------\r\n";
      popupOrder.value += value;
    });

    popupOrder.value += totals;
    popup.classList.remove('SimpleCartOrderPopup--success');
    popup.showModal();
    cartDetails.classList.add(settings.cartSelectors.detalisHidden);
  });

  popupCloseButton.addEventListener("click", () => popup.close());

  popup.addEventListener("click", (e) => {
    elementOutOfDimensions({
      element: popup,
      event: e,
      callback: () => popup.close(),
    });
  });

  const submitSuccessDebounce = debounce(() => {
    popup.classList.remove('SimpleCartOrderPopup--success');
    popup.close();
  }, 2000);

  const formSubmitedCallback = () => {
    popup.classList.add('SimpleCartOrderPopup--success');
    submitSuccessDebounce();
    clearCookie({
      name: settings.cookieProductsName,
      callback: buildCartLayout,
    });
  };
  
  popupFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(popupFrom);

    fetchUrl({
      url: settings.formSubmitUrl,
      method: "POST",
      body: formData,
      callback: formSubmitedCallback,
    });
  });

  const addToCartDebounce = debounce(() => {
    cart.classList.remove(settings.cartSelectors.productAdded);
  }, 1000);

  const addToCartErrorDebounce = debounce(() => {
    cart.classList.remove(settings.cartSelectors.productNotAdded);
  }, 3000);

  const addToCartCallback = () => {
    cart.classList.add(settings.cartSelectors.productAdded);
    addToCartDebounce();
  };

  const addToCartErrorCallback = () => {
    cart.classList.add(settings.cartSelectors.productNotAdded);
    addToCartErrorDebounce();
  };

  productsOnSite.forEach((product) => {
    const currency = product.querySelector(settings.productSelectors.currency);
    const addToCartBtn = product.querySelector(
      settings.productSelectors.buttonAddToCart
    );

    currency.textContent = baseCurrencySymbol;

    addToCartBtn.addEventListener("click", () => {
      const addedProductToCart = addedProduct(product, "add");

      addToCart({
        product: addedProductToCart,
        callback: addToCartCallback,
        errorCallback: addToCartErrorCallback,
      });
    });
  });

  //clear cart button
  cartDetailsClear.addEventListener("click", () => {
    clearCookie({
      name: settings.cookieProductsName,
      callback: buildCartLayout,
    });
  });
}
