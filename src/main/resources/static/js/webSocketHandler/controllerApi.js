const baseUrl = "http://localhost:8080";
const baseSSLUrl = "https://192.168.0.101:8443";

export const post = (url, data) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${baseUrl}/${url}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

	xhr.onreadystatechange = function () {
	    if (this.readyState != 4) return;
	
	    if (this.status == 200) {
			console.log(this.responseText);
	        // we get the returned data
	    }
	
	    // end of state change: it can be after some time (async)
	};
}