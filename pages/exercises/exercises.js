const questionTemplate = (question) => {
    const result = `
    <h3>${question.q}</h3>
    <ul class="answer">
    ${Object.keys(question.a).map(k => `
        <li class="keyval">
            <span class="key">${k}</span>: <span class="value hide">${question.a[k]}</span>
        </li>`).join("")}
    </ul>
    <button class="toggler">👁</button>
    `;
    return result;
};

window.addEventListener("load", async () => {
    // Fetch Data
    let response = await fetch("/data/exercises.json");
    let json = await response.json();

    // Insert HTML
    let $questions = document.getElementById("questions");
    $questions.innerHTML = json.map(questionTemplate).join("<hr/>");

    // clickable "toggle all" buttons
    $questions.querySelectorAll(".toggler").forEach(t => {
        let hidden = true;
        t.addEventListener("click", () => {
            t.previousElementSibling.querySelectorAll(".value").forEach(e => {
                if (hidden) {
                    e.classList.remove("hide");
                } else {
                    e.classList.add("hide");
                }
            });
            hidden = !hidden;
        });
    });

    // clicking to toggle per line
    $questions.querySelectorAll(".key").forEach(t => {
        t.addEventListener("click", () => {
            t.nextElementSibling.classList.toggle("hide");
        });
    });
});

