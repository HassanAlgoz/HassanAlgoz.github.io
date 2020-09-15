let $item = document.getElementById('item');
let $price = document.getElementById('price');
let $name = document.getElementById('name');
let $email = document.getElementById('email');
let $tableBody = document.getElementById('tableBody');
let $errorsBox = document.getElementById('errorsBox');

let errors = [];
// 1. cart error: item is already added 
// 2. print error: can't print empty invoice
function showError(msg) {
    if (errors.findIndex(value => value === msg) >= 0) {
        return;
    }
    errors.push(msg);
    renderErrors();
}

function renderErrors() {
    let html = ''
    for(const err of errors.reverse()) {
        html += `<div class="error">${err}</div>`;
        console.error(err)
    }
    $errorsBox.innerHTML = html;
}

let availableItems = [
    { name: 'Notebook', price: 15 },
    { name: 'Pencils',  price: 7 },
    { name: 'Eraser',   price: 4 },
    { name: 'Desk',     price: 300 },
    { name: 'Keyboard', price: 60 },
    { name: 'Mouse',    price: 30 },
];

for (const item of availableItems) {
    let $option = document.createElement('option')
    $option.innerText = item.name;
    $item.appendChild($option);
}

$item.addEventListener('change', function (evt) {
    let idx = this.selectedIndex - 1;
    if (idx < 0) {
        $price.value = '';
        this.setCustomValidity('Please select an item');
        return;
    }
    this.setCustomValidity('');
    let item = availableItems[idx];
    $price.value = (item.price).toFixed(2);
})

let cart = [];

function addToCart(evt) {
    evt.preventDefault();
    let formData = new FormData(evt.target)
    let item = availableItems.find(item => item.name === formData.get('item'));
    if (!item) {
        console.error('no such item exist')
        return;
    }
    let quantity = Number(formData.get('quantity'))
    if (!quantity || Number.isNaN(quantity)) {
        quantity = 0; // sanitize quantity
    }
    item.quantity = quantity;
    if (cart.findIndex((itm) => itm.name === item.name) >= 0) {
        showError(`item "${item.name}" is already added`)
        $item.setCustomValidity(`${item.name} is already added`)
        return;
    }
    $item.setCustomValidity('');
    cart.push(item)
    renderTable();
}

function renderTable() {
    let html = cart.map((item, i) => `
    <tr class="item">
        <td class="text-center print-not">${i+1}</td>
        <td>${item.name}</td>
        <td class="text-right">${(item.price).toFixed(2)}</td>
        <td class="text-center">${item.quantity}</td>
        <td class="text-right">${(item.quantity * item.price).toFixed(2)}</td>
        <td class="print-not"><button data-index=${i} onclick="removeItem(event)" class="remove">🞬</button></td>
    </tr>
    `).join('');

    // Invoice Total
    let total = 0;
    for(let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    html += `
    <tr class="total">
        <td class="print-not"></td>
        <td></td>
        <td></td>
        <td></td>
        <td class="text-right"><span class="print-only">SAR</span> ${(total).toFixed(2)}</td>
        <td class="print-not"></td>
    </tr>`

    $tableBody.innerHTML = html
}

function removeItem(evt) {
    evt.preventDefault();
    let idx = Number(evt.target.getAttribute('data-index'))
    cart = cart.filter((value, i) => i !== idx)
    renderTable()
}

function printInvoice(evt) {
    evt.preventDefault();
    let erred = false
    // Check name and email
    if (!$name.checkValidity()) {
        showError("print error: invalid name")
        erred = true;
    }
    if (!$email.checkValidity()) {
        showError("print error: invalid email")
        erred = true;
    }

    // print only if cart is not empty
    if (cart.length === 0) {
        showError("print error: cart is empty")
        erred = true;
    }
    
    if (erred) {
        return;
    }

    // elements with class "date-today" has their innerText replaced with the date of today (formatted).
    Array.from(document.getElementsByClassName('date-today')).forEach(elem => {
        elem.innerText = formatDate(new Date())
    });
    // elements with class "date-nextMonth" has their innerText replaced with the date of nextMonth (formatted).
    Array.from(document.getElementsByClassName('date-nextMonth')).forEach(elem => {
        let today = new Date()
        let nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);
        nextMonth.setDate(today.getDate() + 1)
        elem.innerText = formatDate(nextMonth);
    });
    // Print
    window.print()
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function formatDate(date) {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Clear errors on any input change
Array.from(document.querySelectorAll('input'))
.concat(Array.from(document.querySelectorAll('select')))
.concat(Array.from(document.querySelectorAll('button')))
    .forEach(elem => {
        elem.addEventListener('change', () => {
            errors = [];
            renderErrors();
        })
})