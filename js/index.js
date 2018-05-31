// let data = [];
let filteredData = data;

let offset = 0;
let limit = 6;

function render() {
    let html = '';
    for(let i = offset; i < Math.min(offset + limit, filteredData.length); i++) {
        let {title, desc, link, img, type} = filteredData[i];
        html += `
        <article>
            ${link? `
                <a href="${link}" target="_blank">
                    <img src="${img}" alt="${title}" style="width: 100%" class="w3-hover-opacity">
                </a>
            ` : `
                <img src="${img}" alt="${title}" style="width: 100%; background-color: #fff;" class="w3-hover-opacity">
            `}
            <h3>${title}</h3>
            <p>${desc}</p>
        </article>
        `
    }
    html += ''
    document.getElementById('content').innerHTML = html;

    // 'More' Button
    if (limit >= filteredData.length) {
        document.getElementById('btnMore').classList.add('hide')
    } else {
        document.getElementById('btnMore').classList.remove('hide')
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
        btn.classList.remove('black')
        btn.classList.add('white')
    })
    button.classList.toggle('black')
    button.classList.toggle('white')
    setFilter(button.getAttribute('value'))
    render()
}

// Main
(async function() {
    render()
    document.getElementById('copyright').innerText = `الحقوق محفوظة - حسان القوز ${new Date().getFullYear()} ©`
})()