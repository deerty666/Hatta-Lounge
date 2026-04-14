let menu = JSON.parse(localStorage.getItem('menu')) || {
    categories: ["وجبات رئيسية", "مشروبات", "حلويات", "مقبلات"],
    items: []
};

let cart = [];
let orderType = 'takeaway';
let deliveryFee = 15;
let openCategory = null;

function saveMenu() {
    localStorage.setItem('menu', JSON.stringify(menu));
}

// عرض القائمة
function renderMenu() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = '';

    menu.categories.forEach((cat, index) => {
        const isOpen = openCategory === cat;

        const catBox = document.createElement('div');
        catBox.className = 'category-box';
        catBox.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${cat}')">
                <strong>${cat}</strong>
                <span class="arrow">${isOpen ? '▲' : '▼'}</span>
            </div>
        `;

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items-grid';
        itemsContainer.style.display = isOpen ? 'grid' : 'none';

        const catItems = menu.items.filter(i => i.category === cat);
        catItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.backgroundColor = getRandomColor(index);
            card.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price} ر.س</div>
            `;
            card.onclick = () => addToCart(item);
            itemsContainer.appendChild(card);
        });

        catBox.appendChild(itemsContainer);
        container.appendChild(catBox);
    });
}

function getRandomColor(index) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
    return colors[index % colors.length];
}

function toggleCategory(cat) {
    openCategory = (openCategory === cat) ? null : cat;
    renderMenu();
}

// السلة
function addToCart(item) {
    cart.push({ ...item, qty: 1, note: '' });
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart');
    container.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <strong>${item.name} × ${item.qty}</strong> = ${itemTotal} ر.س<br>
            <input type="text" placeholder="ملاحظة" value="${item.note || ''}" 
                   onchange="cart[${index}].note = this.value" style="width:100%; margin:8px 0; padding:8px;">
            <button onclick="changeQty(${index},1)">+</button>
            <button onclick="changeQty(${index},-1)">−</button>
            <button onclick="removeItem(${index})" style="background:#e74c3c;color:white;">حذف</button>
        `;
        container.appendChild(div);
    });

    updateTotal();
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart.splice(index, 1);
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function updateTotal() {
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    deliveryFee = (orderType === 'delivery') ? parseFloat(document.getElementById('deliveryFee').value) || 0 : 0;
    document.getElementById('grandTotal').textContent = (subtotal + deliveryFee).toFixed(2) + " ر.س";
}

function setOrderType(type) {
    orderType = type;
    document.getElementById('btn-takeaway').classList.toggle('active', type === 'takeaway');
    document.getElementById('btn-delivery').classList.toggle('active', type === 'delivery');
    document.getElementById('delivery-fee-section').style.display = (type === 'delivery') ? 'flex' : 'none';
    updateTotal();
}

//////////////////////////////////////////////////////
// 🔥 دالة الطباعة الاحترافية الجديدة
//////////////////////////////////////////////////////

function printReceipt() {

    const invoiceNumber = Date.now().toString().slice(-6);

    let subtotal = 0;
    let itemsHTML = '';

    cart.forEach(item => {
        let total = item.price * item.qty;
        subtotal += total;

        itemsHTML += `
        <tr>
            <td>${item.name}</td>
            <td style="text-align:center;">${item.qty}</td>
            <td style="text-align:left;">${total.toFixed(2)}</td>
        </tr>
        `;

        if (item.note) {
            itemsHTML += `
            <tr>
                <td colspan="3" style="font-size:10px;">↳ ${item.note}</td>
            </tr>
            `;
        }
    });

    let delivery = (orderType === 'delivery') 
        ? (parseFloat(document.getElementById('deliveryFee').value) || 0) 
        : 0;

    let grandTotal = subtotal + delivery;

    let html = `
    <html>
    <head>
    <style>
    body { width:80mm; font-family:Arial; direction:rtl; font-size:12px; }
    .center{text-align:center;}
    .line{border-top:1px dashed #000;margin:6px 0;}
    table{width:100%;border-collapse:collapse;}
    th{border-bottom:1px solid #000;}
    td{padding:3px 0;}
    .grand{border-top:2px solid #000;text-align:center;font-size:15px;font-weight:bold;margin-top:5px;}
    </style>
    </head>

    <body>

    <div class="center">
        <img src="logo.png" style="width:70px"><br>
        <b style="font-size:16px;">سحايب ديرتي</b><br>
        ${new Date().toLocaleString('ar-SA')}
    </div>

    <div class="line"></div>

    <table>
    <tr><th>الصنف</th><th>ك</th><th>ر.س</th></tr>
    ${itemsHTML}
    </table>

    <div class="line"></div>

    <div>المجموع: ${subtotal.toFixed(2)}</div>
    ${delivery > 0 ? `<div>توصيل: ${delivery.toFixed(2)}</div>` : ''}

    <div class="grand">
        الإجمالي: ${grandTotal.toFixed(2)} ر.س
    </div>

    <div class="center" style="margin-top:10px;">
        <img src="qr.png" style="width:90px;border:1px solid #000;padding:4px;"><br>
        <small>امسح لفتح المنيو</small>
    </div>

    </body>
    </html>
    `;

    let w = window.open('', '', 'width=300,height=600');
    w.document.write(html);
    w.document.close();
    w.print();
    w.close();
}

//////////////////////////////////////////////////////

// واتساب
function sendToWhatsApp() {
    let phone = document.getElementById('custPhone').value.trim().replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '966' + phone.substring(1);
    if (!phone.startsWith('966')) phone = '966' + phone;

    const message = `طلب جديد\n${document.getElementById('grandTotal').textContent}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
}

// تشغيل
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    setOrderType('takeaway');
});
