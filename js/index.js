let data = [];
let filteredData = [];
async function fetchData() {
    let response = await fetch(`/data/index.json`);
    data = await response.json();
    filteredData = data
}

let offset = 0;
let limit = 6;

function render() {
    let html = `<div class="w3-row-padding">`;
    for(let i = offset; i < Math.min(offset + limit, filteredData.length); i++) {
        let {title, desc, link, img, type} = filteredData[i];
        html += `
            <div class="w3-third w3-container w3-margin-bottom">
                <a href="${link}" target="_blank">
                    <img src="${img}" alt="${title}" style="width: 100%" class="w3-hover-opacity">
                </a>
                <div class="w3-container w3-white">
                    <p><b>${title}</b></p>
                    <p>${desc}</p>
                </div>
            </div>
        `
    }
    html += "</div>"
    document.getElementById('content').innerHTML = html;

    // 'More' Button
    if (limit >= filteredData.length) {
        document.getElementById('btnMore').classList.add('w3-hide')
    } else {
        document.getElementById('btnMore').classList.remove('w3-hide')
    }
}

let stepSize = 6;
function more() {
    if (limit < filteredData.length) {
        limit = Math.min(limit + stepSize, filteredData.length);
        render()
    }
}

const filterButtons = [
    document.getElementById('btnFilterAll'),
    document.getElementById('btnFilterCourses'),
    document.getElementById('btnFilterMaps')
]

function setFilter(value) {
    offset = 0;
    limit = 6;
    filteredData = data.filter(d => value == 'all' || d.type == value);
}

function selectFilter(button) {
    filterButtons.forEach(btn => {
        btn.classList.remove('w3-black')
        btn.classList.add('w3-white')
    })
    button.classList.toggle('w3-black')
    button.classList.toggle('w3-white')
    setFilter(button.getAttribute('value'))
    render()
}

// Main
(async function() {
    await fetchData()
    render()
})()