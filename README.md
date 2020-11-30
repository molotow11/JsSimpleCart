# jQuerySimpleCart
Simple order cart for your Site

### How to integrate
	- Copy the layout from cart.html and put it somwhere into your site (need jQuery to be included first)
	- Configure this part for link it to products
		```
		var productBlockSelector	= "table.model tbody tr";
		var addToCartSelector		= "a.cart";
		var productTitleSelector	= "td:eq(0)";
		var productPriceSelector	= "td.price";
		var productQtySelector		= ""; // default 1
		var cartCookieDays		= 7;
		var formSubmitUrl		= "/OrderSubmit.php";
		```
	- Put OrderSubmit.php in site root or other place you configured in formSubmitUrl parameter.
	- Configure OrderSubmit.php and change your email and site.
	- The cart will be visible on the top right corner (if productBlockSelector existing on the page).