var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', 'http://18.144.14.140:5000/v1/books')
ourRequest.onload = function() {
	console.log(ourRequest.responseText);
}
ourRequest.send();
