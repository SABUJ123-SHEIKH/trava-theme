if (!('boxShadow' in document.body.style)) {
    document.body.setAttribute('class', 'noBoxShadow');
}

document.body.addEventListener("click", function(event) {
    var target = event.target;
    if (target.tagName === "INPUT" &&
        target.getAttribute('class').indexOf('liga') === -1) {
        target.select();
    }
});

(function() {
    var fontSizeInput = document.getElementById('fontSize'),
        testDriveOutput = document.getElementById('testDrive'),
        testTextInput = document.getElementById('testText');
    function updateTest() {
        testDriveOutput.innerHTML = testTextInput.value || String.fromCharCode(160);
        if (window.icomoonLiga) {
            window.icomoonLiga(testDriveOutput);
        }
    }
    function updateSize() {
        testDriveOutput.style.fontSize = fontSizeInput.value + 'px';
    }
    fontSizeInput.addEventListener('change', updateSize, false);
    testTextInput.addEventListener('input', updateTest, false);
    testTextInput.addEventListener('change', updateTest, false);
    updateSize();
}());
