# SimpleCart
Simple order cart for your Site

## Demo
https://molotow11.github.io/JsSimpleCart/demo/

## How to integrate
	1. Copy the layout from simple-cart.html and put it in the end html file of yours site.
		simple-cart.js into root catalog where added simple-cart.html.
	2. Configure this part for link it to products:
```javascript
const settings = {
  productSelectors: {
    product: ".product", // Add class to each product on your site. *
    buttonAddToCart: ".product__add-to-cart-button", // Add class to each button in your product. *
    title: ".product__title", // Add class to each title in your product. *
    price: ".product__price", // Add class to each price in your product. *
    qty: ".product__qty",
    currency: ".product__currency", // Add class to each currency in your product. *
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
    parentSelector: "products__currencies", // Add id to element in your site for to add currency select list.
    BASE: "USD", // Set default currency of products. *
    list: [ // You can add more currencies to the list or change the existing ones.
      {
        code: "USD", // Set currency code. *
        symbol: "$", // Set currency symbol. *
        rateToBase: 1, // Set exchange rate to base currency.
      },
      {
        code: "EUR",
        symbol: "€",
        rateToBase: 1.1,
      },
      {
        code: "RUB",
        symbol: "₽",
        rateToBase: 0.011,
      },
    ],
  },
  cartCookieDays: 7, // Cookie lifetime.
  formSubmitUrl: "/order-submit.php",
  cookieProductsName: "SimpleCart",
};
```
		* - required.
		If there is only one currency on your site, then fill in only the parameters
    marked * in the currency object.
    The default currency of the products must be selected from the list of available currencies.
	3. Put OrderSubmit.php in site root or other place you configured in formSubmitUrl parameter.
	4. Configure OrderSubmit.php and change your email and site.
	5. The cart will be visible on the top right corner (if productSelector existing on the page).

## Examples

	Product example:
```HTML
<tr class="product">
	<td class="product__title">LUCERNA LED 55 OR PRO 90</td>
	<td>
		<span class="product__price">
			264.76
		</span>
		<span class="product__currency">
			$
		</span>
	</td>
	<td>
		<button class="product__add-to-cart-button" type="button">
			Add to Cart
		</button>
	</td>
</tr>
```
Currencies select example:
```HTML
<th id="products__currencies">
	<select>
		<option value="$" selected="">Price in USD</option>
		<option value="₽">Price in RUB</option>
	</select>
</th>
```
