<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>سحايب ديرتي POS</title>

<style>
body{font-family:Tahoma;margin:0;background:#f5f5f5}
h3{text-align:center}

/* القائمة */
.category-box{background:#fff;margin:10px;border-radius:10px;overflow:hidden}
.category-header{padding:15px;background:#222;color:#fff;cursor:pointer;display:flex;justify-content:space-between}
.items-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:10px}
.item-card{padding:15px;border-radius:10px;color:#fff;text-align:center;cursor:pointer}

/* السلة */
#cart{padding:10px}
.cart-item{background:#fff;padding:10px;margin-bottom:8px;border-radius:8px}

button{padding:6px 10px;margin:3px;border:none;border-radius:6px;cursor:pointer}
.active{background:#27ae60;color:#fff}

/* الإدارة */
#adminModal{
position:fixed;top:0;left:0;width:100%;height:100%;
background:rgba(0,0,0,0.6);display:none;justify-content:center;align-items:center
}
.admin-box{
background:#fff;width:90%;max-height:90%;overflow:auto;padding:15px;border-radius:10px
}
</style>
</head>

<body>

<h3>سحايب ديرتي</h3>
<button onclick="openAdmin()">⚙️ إدارة</button>

<div id="menuContainer"></div>

<hr>

<div id="cart"></div>
<h3 id="grandTotal">0 ر.س</h3>

<input id="custName" placeholder="اسم العميل">
<input id="custPhone" placeholder="رقم الجوال">
<input id="custAddress" placeholder="الموقع">
<input id="custTime" type="datetime-local">

<br>

<button id="btn-takeaway" onclick="setOrderType('takeaway')" class="active">استلام</button>
<button id="btn-delivery" onclick="setOrderType('delivery')">توصيل</button>

<div id="delivery-fee-section" style="display:none;">
<input id="deliveryFee" type="number" value="15">
</div>

<br>

<button onclick="printReceipt()">🖨️ طباعة</button>
<button onclick="sendToWhatsApp()">📲 واتساب</button>
<button onclick="clearCart()">🗑️ مسح</button>

<!-- الإدارة -->
<div id="adminModal">
<div class="admin-box">

<h3>الإدارة</h3>

<input id="newCat" placeholder="اسم القسم">
<button onclick="addCategory()">➕ قسم</button>

<hr>

<input id="newItemName" placeholder="اسم الصنف">
<input id="newItemPrice" type="number" placeholder="السعر">
<select id="catSelect"></select>
<button onclick="addItem()">➕ صنف</button>

<hr>

<div id="adminList"></div>

<button onclick="closeAdmin()">إغلاق</button>

</div>
</div>

<script>
let menu = JSON.parse(localStorage.getItem('menu')) || {
    categories:["وجبات رئيسية","مشروبات"],
    items:[]
};

let cart=[];
let orderType='takeaway';
let deliveryFee=15;
let openCategory=null;

function saveMenu(){localStorage.setItem('menu',JSON.stringify(menu));}

/* القائمة (مضمونة) */
function renderMenu(){
    const container=document.getElementById('menuContainer');
    container.innerHTML='';

    menu.categories.forEach((cat,index)=>{
        const isOpen=openCategory===cat;

        const box=document.createElement('div');
        box.className='category-box';

        box.innerHTML=`
        <div class="category-header" onclick="toggleCategory('${cat}')">
            <strong>${cat}</strong>
            ${isOpen?'▲':'▼'}
        </div>
        `;

        const itemsDiv=document.createElement('div');
        itemsDiv.className='items-grid';
        itemsDiv.style.display=isOpen?'grid':'none';

        const catItems=menu.items.filter(i=>i.category===cat);

        if(catItems.length===0){
            itemsDiv.innerHTML='<div style="color:#888">لا يوجد أصناف</div>';
        }

        catItems.forEach(item=>{
            const card=document.createElement('div');
            card.className='item-card';
            card.style.background=getColor(index);

            card.innerHTML=`
                <div>${item.name}</div>
                <div>${item.price} ر.س</div>
            `;

            card.onclick=()=>addToCart(item);

            itemsDiv.appendChild(card);
        });

        box.appendChild(itemsDiv);
        container.appendChild(box);
    });
}

function getColor(i){
    const colors=['#e74c3c','#3498db','#27ae60','#9b59b6','#f39c12'];
    return colors[i%colors.length];
}

function toggleCategory(cat){
    openCategory=openCategory===cat?null:cat;
    renderMenu();
}

/* السلة */
function addToCart(item){
    cart.push({...item,qty:1,note:''});
    renderCart();
}

function renderCart(){
    const c=document.getElementById('cart');
    c.innerHTML='';

    cart.forEach((item,i)=>{
        const d=document.createElement('div');
        d.className='cart-item';

        d.innerHTML=`
        <b>${item.name} × ${item.qty}</b>
        <input placeholder="ملاحظة" value="${item.note}" onchange="cart[${i}].note=this.value">
        <br>
        <button onclick="changeQty(${i},1)">+</button>
        <button onclick="changeQty(${i},-1)">-</button>
        <button onclick="removeItem(${i})">حذف</button>
        `;

        c.appendChild(d);
    });

    updateTotal();
}

function changeQty(i,d){
    cart[i].qty+=d;
    if(cart[i].qty<=0) cart.splice(i,1);
    renderCart();
}

function removeItem(i){
    cart.splice(i,1);
    renderCart();
}

function updateTotal(){
    let subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);

    deliveryFee=(orderType==='delivery')
        ? parseFloat(document.getElementById('deliveryFee').value)||0
        : 0;

    document.getElementById('grandTotal').textContent=
        (subtotal+deliveryFee).toFixed(2)+" ر.س";
}

/* نوع الطلب */
function setOrderType(t){
    orderType=t;

    document.getElementById('btn-takeaway').classList.toggle('active',t==='takeaway');
    document.getElementById('btn-delivery').classList.toggle('active',t==='delivery');

    document.getElementById('delivery-fee-section').style.display=
        t==='delivery'?'block':'none';

    updateTotal();
}

/* الطباعة */
function printReceipt(){
    const qr="https://deerty666.github.io/menu.html?branch=branch1";

    let html=`
    <div style="width:72mm;font-family:Tahoma;font-size:12px;text-align:right;direction:rtl;">
    <div style="text-align:center">
    <img src="logo.png" style="width:70px"><br>
    <b>سحايب ديرتي</b><br>
    ${new Date().toLocaleString('ar-SA')}
    </div><hr>
    `;

    cart.forEach(i=>{
        html+=`${i.name} × ${i.qty} = ${i.price*i.qty} ر.س<br>`;
        if(i.note) html+=`<small>${i.note}</small><br>`;
    });

    html+=`
    <hr><b>الإجمالي: ${document.getElementById('grandTotal').textContent}</b>
    <hr>
    <div style="text-align:center">
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qr)}">
    </div></div>
    `;

    const old=document.body.innerHTML;
    document.body.innerHTML=html;
    window.print();
    document.body.innerHTML=old;
    location.reload();
}

/* واتساب (مضمون) */
function sendToWhatsApp(){
    let phone=document.getElementById('custPhone').value.trim().replace(/\D/g,'');

    if(phone.startsWith('0')) phone='966'+phone.substring(1);
    if(!phone.startsWith('966')) phone='966'+phone;

    if(phone.length<12){alert("رقم غير صحيح");return;}

    let text="🧾 طلب جديد\n\n";

    cart.forEach(i=>{
        text+=`${i.name} × ${i.qty} = ${i.price*i.qty} ر.س\n`;
    });

    text+=`\nالإجمالي: ${document.getElementById('grandTotal').textContent}`;
    text+=`\n\nاطلب من هنا:\nhttps://deerty666.github.io/menu.html?branch=branch1`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
}

/* الإدارة */
function openAdmin(){
    document.getElementById('adminModal').style.display='flex';
    renderAdmin();
}

function closeAdmin(){
    document.getElementById('adminModal').style.display='none';
}

function renderAdmin(){
    let list=document.getElementById('adminList');
    let select=document.getElementById('catSelect');

    list.innerHTML='';
    select.innerHTML='';

    menu.categories.forEach(cat=>{
        let opt=document.createElement('option');
        opt.value=cat;
        opt.textContent=cat;
        select.appendChild(opt);

        let div=document.createElement('div');
        div.innerHTML=`<b>${cat}</b>
        <button onclick="deleteCategory('${cat}')">حذف</button>`;
        list.appendChild(div);

        menu.items.filter(i=>i.category===cat).forEach(item=>{
            let d=document.createElement('div');
            d.innerHTML=`
            ${item.name} - ${item.price}
            <button onclick="editItem(${item.id})">تعديل</button>
            <button onclick="deleteItem(${item.id})">حذف</button>
            `;
            list.appendChild(d);
        });
    });
}

function addCategory(){
    let name=document.getElementById('newCat').value.trim();
    if(!name)return;

    if(menu.categories.includes(name)) return alert("موجود");

    menu.categories.push(name);
    saveMenu();
    renderMenu();
    renderAdmin();
}

function deleteCategory(cat){
    if(!confirm("حذف؟"))return;

    menu.categories=menu.categories.filter(c=>c!==cat);
    menu.items=menu.items.filter(i=>i.category!==cat);

    saveMenu();
    renderMenu();
    renderAdmin();
}

function addItem(){
    let name=document.getElementById('newItemName').value.trim();
    let price=parseFloat(document.getElementById('newItemPrice').value);
    let cat=document.getElementById('catSelect').value;

    if(!name||!price)return;

    menu.items.push({id:Date.now(),name,price,category:cat});
    saveMenu();
    renderMenu();
    renderAdmin();
}

function editItem(id){
    let item=menu.items.find(i=>i.id===id);
    let name=prompt("اسم",item.name);
    let price=parseFloat(prompt("سعر",item.price));

    if(name&&price){
        item.name=name;
        item.price=price;
        saveMenu();
        renderMenu();
        renderAdmin();
    }
}

function deleteItem(id){
    if(!confirm("حذف؟"))return;

    menu.items=menu.items.filter(i=>i.id!==id);
    saveMenu();
    renderMenu();
    renderAdmin();
}

/* تشغيل */
document.addEventListener('DOMContentLoaded',()=>{
    renderMenu();
    setOrderType('takeaway');
});
</script>

</body>
</html>
