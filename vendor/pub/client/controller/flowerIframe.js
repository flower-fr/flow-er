function autoresizeFrame() {
    const frame = document.getElementById("flowerIframe")
    if (frame.contentWindow.document.body) {
        const height = frame.contentWindow.document.body.offsetHeight
        frame.style.height = height
    }
}

window.onload = (event) => {
    document.getElementById("flowerForm").innerHTML = `
    <iframe id="flowerIframe" 
        style="border: none; width: 90%;"
        src="/pub/account">
    </iframe>`

    const auto_resize_timer = window.setInterval("autoresizeFrame()", 400)
}