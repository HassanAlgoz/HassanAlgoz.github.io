import { KEYS } from "./globals.js";
import PlainText from "./text.js";

const converter = new showdown.Converter();

const app = new Vue({
    el: "#app",

    data: {
        code:     "# عنوان\n من جد وجد ومن زرع حصد.\n1. واحد\n2. اثنان\n3. ثلاثة\n\n",
        capsLock: null,
    },

    created() {
    },

    methods: {
        insertLink() {
            let link = window.prompt("Enter Link");
            if (link) {
                this.wrapSelected(["[", "]("+link+")"]);
            }
        },
        insertParenthesis() {
            this.wrapSelected(["(", ")"]);
        },
        insertBrackets() {
            this.wrapSelected(["[", "]"]);
        },
        insertCurlyBrackets() {
            this.wrapSelected(["{", "}"]);
        },
        insertImage() {
            let link = window.prompt("Enter Image Link");
            if (link) {
                this.wrapSelected(["[", "]("+link+")"]);
            }
        },
        insertCode() {
            this.wrapSelected(["```\n", "\n```"]);
        },
        insertBold() {
            this.wrapSelected(["**", "**"]);
        },
        insertItalic() {
            this.wrapSelected(["_", "_"]);
        },
        wrapSelected([A, B]) {
            let [start, end] = [$code.selectionStart, $code.selectionEnd];
            let selectedText = this.code.substring(start, end);
            let text = `${A}${selectedText}${B}`;
            document.execCommand("insertText", false, text);
            let offset = A.length;
            $code.selectionStart = start + offset;
            $code.selectionEnd = end + offset;
            console.log("wrapSelected", text);
        },

        indent(evt) {
            console.log("indent");
            document.execCommand("insertText", false, "\t");
        },
        outdent(evt) {
            console.log("outdent");
            document.execCommand("outdent");
        },

        saveText() {
            PlainText.Download(this.code, "saved.md");
        },

        keypress(evt) {
            const keyCode = evt.keyCode;

            switch(keyCode) {

            case KEYS.RIGHT_PAREN: {
                evt.preventDefault();
                app.insertParenthesis();
                return false;
            }

            case KEYS.RIGHT_BRACKET: {
                evt.preventDefault();
                app.insertBrackets();
                return false;
            }

            case KEYS.RIGHT_CURLY: {
                evt.preventDefault();
                app.insertCurlyBrackets();
                return false;
            }
            }

            // Print Arabic digits instead of English digits
            // if (keyCode >= 0x30 && keyCode <= 0x39) {
            // 	evt.preventDefault();
            // 	const num = String.fromCodePoint((keyCode - 0x30) + 0x0660);
            // 	console.log(num)
            // 	document.execCommand('insertText', false, num)
            // }
        },

        keyup(evt) {
            // Dot Separation of characters when capsLock is on.
            // let text = app.code
            // let codePoint = evt.key.codePointAt(0);
            // let prevCodePoint = text.codePointAt(text.length - 2);
            // console.log(`${prevCodePoint}=${String.fromCodePoint(prevCodePoint)}`, `${codePoint}=${String.fromCodePoint(codePoint)}`)
            // if (app.capsLock && isAlphaArabic(codePoint) && isAlphaArabic(prevCodePoint)) {
            // 	app.code = text.substring(0, text.length - 1) + '.' + text.charAt(text.length - 1)
            // }
        },

    },

    computed: {
        preview() {
            return converter.makeHtml(this.code);
        },

        lineNumbers() {
            let numbers = [1];
            for(let i = 0; i < this.code.length; i++) {
                if (this.code[i] === "\n") {
                    numbers.push(numbers.length + 1);
                }
            }
            return numbers.join("<br/>");
        },

        length() {
            return this.code.length;
        },
    },

});


// HTML Elements
let $lineNumbers;
let $code;
function initDocumentElements() {
    $lineNumbers = document.getElementById("lineNumbers");
    $code = document.getElementById("code");
}

document.addEventListener("keydown", (evt) => {
    // Update CapsLock state
    app.capsLock = evt.getModifierState("CapsLock");

    // Ctrl + S: Saves (and downloads) markdown in ".md" format
    if (evt.keyCode === KEYS.S && (evt.ctrlKey || evt.metaKey)) {
        evt.preventDefault();
        app.saveText();
        return false;
    }
});


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
    PlainText.LoadFile(evt.dataTransfer.files[0])
        .then(text => {
            app.code = text;
        })
        .catch(console.error);
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