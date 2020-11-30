# jQuerySimpleCart
Simple order cart for your Site

### How to integrate
	1. Copy the layout from cart.html and put it somewhere into your site (need jQuery to be included first)
	2. Configure this part for link it to products:
		```
		var productBlockSelector	= "table.model tbody tr";
		var addToCartSelector		= "a.cart";
		var productTitleSelector	= "td:eq(0)";
		var productPriceSelector	= "td.price";
		var productQtySelector		= ""; // default 1
		var cartCookieDays		= 7;
		var formSubmitUrl		= "/OrderSubmit.php";
		```
	3. Put OrderSubmit.php in site root or other place you configured in formSubmitUrl parameter.
	4. Configure OrderSubmit.php and change your email and site.
	5. The cart will be visible on the top right corner (if productBlockSelector existing on the page).
	
### Demo
	- [https://joomcar.net/jQuerySimpleCart.html](https://joomcar.net/jQuerySimpleCart.html)