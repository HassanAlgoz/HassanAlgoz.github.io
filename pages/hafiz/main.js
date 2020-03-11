const app = new Vue({
    el: "#app",

    data: {

    },

    created() {
    },

    methods: {

    },

    computed: {

    },

});


// HTML Elements
let $lineNumbers = null;
let $code = null;
function initDocumentElements() {
    $lineNumbers = document.getElementById("lineNumbers");
    $code = document.getElementById("code");
}


// Drag and Drop loads text file
// Prevent browser from viewing the file as a page upon dropping it accidentally outside the dropbox borders
window.URL = window.URL || window.webkitURL;
window.addEventListener("dragenter", (e) => {
    e.preventDefault();
});
window.addEventListener("dragover", (e) => {
    e.preventDefault();
});
window.addEventListener("drop", (e) => {
    e.preventDefault();
});
// Dropping a text.md file loads it.
document.addEventListener("drop", function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    // PlainText.LoadFile(evt.dataTransfer.files[0])
    //     .then(text => {
    //         app.code = text;
    //     })
    //     .catch(console.error);
}, false);


window.addEventListener("load", () => {
    initDocumentElements();
    // bind text area with num of lines column (y-scrolling)
    $code.addEventListener("scroll", (evt) => {
        $lineNumbers.scrollTop = $code.scrollTop;
    });
});


function isAlphaArabic(codePoint) {
    // From Aliph to Yaa' excluding "Tatweel" letter.
    return codePoint >= 0x620 && codePoint <= 0x64A && codePoint !== 0x640;
}