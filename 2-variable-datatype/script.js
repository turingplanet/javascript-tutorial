function showTime() {
    var d = new Date();
    document.querySelector("p").innerHTML = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}
