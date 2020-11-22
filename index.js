const model = {
    courses: [],
    filter:  "all", // all | courses | maps
    offset:  0,
    limit:   6,
    posts:   [],

};

const el = {
    btnMore:          "btnMore",
    btnFilterAll:     "btnFilterAll",
    btnFilterCourses: "btnFilterCourses",
    btnFilterMaps:    "btnFilterMaps",
    filterButtons:    [
        "btnFilterAll",
        "btnFilterCourses",
        "btnFilterMaps",
    ],
    tutorialsListView: "tutorialsListView",
    postsListView:     "postsListView",
};
window.addEventListener("load", () => {
    for(let [key, val] of Object.entries(el)) {
        if (typeof val === "string") {
            el[key] = document.getElementById(val);
        } else if (Array.isArray(val)) {
            el[key] = val.map(id => document.getElementById(id));
        } else {
            console.error("unknown el value", val);
        }
    }

    // Main
    setTimeout(async function () {
        const r1 = await fetch("/data/tutorials.json");
        model.courses = await r1.json();

        const r2 = await fetch("/data/posts.json");
        model.posts = await r2.json();

        render();
    }, 1);
});

function selectFilter(buttonElement) {
    el.filterButtons.forEach(btn => {
        btn.classList.remove("active");
    });
    buttonElement.classList.toggle("active");
    model.filter = buttonElement.getAttribute("value");
    model.offset = 0;
    model.limit = 6;
    render();
}

function handleMoreButton() {
    if (model.limit < model.courses.length) {
        model.limit = Math.min(model.limit + model.limit, model.courses.length);
        render();
    }
}


function render() {

    // Render Posts
    (() => {
        el.postsListView.innerHTML = `
            <ul class="posts-list">
                ${model.posts
            .filter((v, idx, array) => idx >= model.offset && idx < Math.min(model.offset + model.limit, array.length))
            .sort((a, b) => {
                if (a.date < b.date) {
                    return 1;
                } else if (a.date > b.date) {
                    return -1;
                }
                return 0;
            })
            .map(c => `
                ${c.dir === "ltr"
            ? "<li class=\"\" dir=\"rtl\">"
            : "<li class=\"\" dir=\"rtl\">"}
                        <a href="${c.link}">${c.title} <small>— ${c.date}</small></a>
                    </li>
                `).join("")}
            </ul>
        `;
    })();

    // Render Tutorials
    (() => {
        const filteredCourses = model.courses.filter(c => model.filter === "all" || c.category === model.filter);
        el.tutorialsListView.innerHTML = filteredCourses
            .filter((v, idx, array) => idx >= model.offset && idx < Math.min(model.offset + model.limit, array.length))
            .map(c => `
            <article class="card">
                <a href="${c.link}" class="no-underline">
                    ${c.img ? `<img src="${c.img}" alt="${c.title}" style="width: 100%">` : ""}
                <h3>${c.title}</h3>
                </a>
                ${c.desc? `<p>${c.desc}</p>`: ""}
            </article>
        `).join("");

        // 'More' Button
        if (model.limit >= filteredCourses.length) {
            el.btnMore.classList.add("hide");
        } else {
            el.btnMore.classList.remove("hide");
        }
    })();
}
