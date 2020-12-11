const READING_SPEED = 200; // words per minute

window.addEventListener("load", () => {

    (function calculateReadingTime() {
        const $body = document.getElementsByClassName("post-body").item(0);
        const words = $body.textContent.split(" ").filter(w => w.length >= 3);
        const time = words.length / READING_SPEED;

        const $readingTime = document.getElementsByClassName("reading-time").item(0);
        $readingTime.textContent = `${Math.ceil(time).toFixed(0)} د`;
    })();

    (function HighlightCodeBlocks() {
        document.querySelectorAll("pre code").forEach((block) => {
            console.log("hljs:", hljs);
            hljs.highlightBlock(block);
        });
    })();
});

