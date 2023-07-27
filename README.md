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
		BASE: "USD",  // set base currency of products *
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
```
		* - required.
	3. Put OrderSubmit.php in site root or other place you configured in formSubmitUrl parameter.
	4. Configure OrderSubmit.php and change your email and site.
	5. The cart will be visible on the top right corner (if productSelector existing on the page).

## Examples

	Product example:
```html
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
```html
<th id="products__currencies">
	<select>
		<option value="$" selected="">Price in USD</option>
		<option value="₽">Price in RUB</option>
	</select>
</th>
```
