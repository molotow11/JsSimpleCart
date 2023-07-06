# SimpleCart
Simple order cart for your Site

## Demo
https://molotow11.github.io/JsSimpleCart/demo/

## How to integrate
	1. Copy the layout from simple-cart.html and put it in the end html file of yours site.
		simple-cart.js into root catalog where added simple-cart.html.
	2. Configure this part for link it to products:
		```
		const productSelectors = {
			product: ".product__element",
			buttonAddToCart: ".cart",
			title: ".title",
			price: ".price",
			qty: ".qty",
			currency: '$'
		};

		const cartCookieDays = 7;
		const formSubmitUrl = "/OrderSubmit.php";
		const cookieProductsName = "SimpleCart";

		```
	3. Put OrderSubmit.php in site root or other place you configured in formSubmitUrl parameter.
	4. Configure OrderSubmit.php and change your email and site.
	5. The cart will be visible on the top right corner (if productBlockSelector existing on the page).
