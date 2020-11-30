const READING_SPEED = 200; // words per minute

window.addEventListener("load", () => {
    const $body = document.getElementsByClassName("post-body").item(0);
    const words = $body.textContent.split(" ");
    const time = words.length / READING_SPEED;

    const $readingTime = document.getElementsByClassName("reading-time").item(0);
    $readingTime.textContent = `${Math.ceil(time).toFixed(0)} د`;
});