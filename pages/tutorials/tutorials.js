let data = [];
let filteredData = data;

let offset = 0;
let limit = 9;
let stepSize = limit;

function render() {
    let html = "";
    for (let i = offset; i < Math.min(offset + limit, filteredData.length); i++) {
        let { title, desc, link, img, category } = filteredData[i];
        html += `
        <article class="card">
            <a href="${link}" class="no-underline">
                ${img ? `<img src="${img}" alt="${title}" style="width: 100%">` : ""}
            <h3>${title}</h3>
            </a>
            ${desc? `<p>${desc}</p>`: ""}
        </article>
        `;
    }
    html += "";
    document.getElementById("content").innerHTML = html;

    // 'More' Button
    if (limit >= filteredData.length) {
        document.getElementById("btnMore").classList.add("hide");
    } else {
        document.getElementById("btnMore").classList.remove("hide");
    }
}

function more() {
    if (limit < filteredData.length) {
        limit = Math.min(limit + stepSize, filteredData.length);
        render();
    }
}

let filterButtons = [];

function setFilter(value) {
    offset = 0;
    limit = 6;
    filteredData = data.filter(d => value === "all" || d.category === value);
}

function selectFilter(button) {
    filterButtons.forEach(btn => {
        btn.classList.remove("active");
    });
    button.classList.toggle("active");
    setFilter(button.getAttribute("value"));
    render();
}

// Main
setTimeout(async function () {
    filterButtons = [
        document.getElementById("btnFilterAll"),
        document.getElementById("btnFilterCourses"),
        document.getElementById("btnFilterMaps"),
        // document.getElementById("btnFilterPosts"),
    ];

    const response = await fetch("/data/index.json");
    data = await response.json();
    filteredData = data;
    render();
}, 1);