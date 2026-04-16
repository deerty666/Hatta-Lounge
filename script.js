let defaultMenu={
categories:["وجبات","مشروبات"],
items:[
{id:1,name:"برجر",price:15,category:"وجبات"},
{id:2,name:"بيتزا",price:25,category:"وجبات"},
{id:3,name:"عصير",price:8,category:"مشروبات"}
]
};

let saved=JSON.parse(localStorage.getItem("menu"));
let menu=(saved&&saved.items&&saved.items.length>0)?saved:defaultMenu;

let cart=[],openCategory=null,orderType="takeaway";

function saveMenu(){localStorage.setItem("menu",JSON.stringify(menu));}

/* القائمة */
function renderMenu(){
let c=document.getElementById("menuContainer");c.innerHTML="";
menu.categories.forEach(cat=>{
let box=document.createElement("div");

let title=document.createElement("div");
title.className="category-title";
title.textContent=cat;
title.onclick=()=>toggleCategory(cat);

let items=document.createElement("div");
items.className="items";
items.style.display=openCategory===cat?"grid":"none";

menu.items.filter(i=>i.category===cat).forEach(item=>{
let d=document.createElement("div");
d.className="item";
d.textContent=item.name+" - "+item.price+" ر.س";
d.onclick=()=>addToCart(item);
items.appendChild(d);
});

box.appendChild(title);
box.appendChild(items);
c.appendChild(box);
});
}

function toggleCategory(cat){openCategory=openCategory===cat?null:cat;renderMenu();}

/* السلة */
function addToCart(item){
cart.push({...item,qty:1,note:""});
renderCart();
}

function renderCart(){
let c=document.getElementById("cartItems");
c.innerHTML="";

cart.forEach((i,index)=>{
let total=i.price*i.qty;

c.innerHTML+=`
<div style="display:flex;justify-content:space-between;align-items:center;margin:5px 0">
<div>
<b>${i.name}</b> × ${i.qty}<br>
<small>${total} ر.س</small>
</div>

<div>
<button onclick="changeQty(${index},1)">+</button>
<button onclick="changeQty(${index},-1)">-</button>
</div>
</div>

<input placeholder="ملاحظة" value="${i.note||''}" 
onchange="cart[${index}].note=this.value" style="width:100%;margin-bottom:5px">
<hr>
`;
});

updateTotal();
}

function changeQty(i,d){
cart[i].qty+=d;
if(cart[i].qty<=0)cart.splice(i,1);
renderCart();
}

function updateTotal(){
let total=cart.reduce((s,i)=>s+i.price*i.qty,0);
if(orderType==="delivery") total+=parseFloat(document.getElementById("deliveryFee").value)||0;
document.getElementById("total").textContent=total+" ر.س";
}

function setOrderType(t){
orderType=t;
document.getElementById("deliveryBox").style.display=t==="delivery"?"block":"none";
updateTotal();
}

/* زر جديد */
function clearCart(){

cart=[];

document.getElementById("custName").value="";
document.getElementById("custPhone").value="";
document.getElementById("custAddress").value="";
document.getElementById("custTime").value="";

orderType="takeaway";

let box=document.getElementById("deliveryBox");
if(box) box.style.display="none";

let fee=document.getElementById("deliveryFee");
if(fee) fee.value=15;

renderCart();
updateTotal();
}

/* واتساب */
/* واتساب - نسخة محسنة وآمنة مع إيموجي جميلة */
function sendToWhatsApp() {
    let inputPhone = document.getElementById("custPhone").value.trim();
    let phone = inputPhone.replace(/\D/g, '');

    // ضبط تنسيق الرقم السعودي
    if (phone.startsWith("05")) phone = "966" + phone.substring(1);
    else if (phone.startsWith("5")) phone = "966" + phone;
    else if (!phone.startsWith("966")) phone = "966" + phone;

    let name = document.getElementById("custName").value.trim() || "ضيف";
    let address = document.getElementById("custAddress").value.trim() || "لم يحدد";
    let time = document.getElementById("custTime").value;
    let timeText = time ? new Date(time).toLocaleString('ar-SA') : "-";

    // استخدام الرموز مباشرة (تظهر بوضوح في GitHub و WhatsApp)
    let type = (typeof orderType !== 'undefined' && orderType === "delivery") ? "🚗 توصيل" : "🏠 استلام";

    let text = `🧾 *سحايب ديرتي - فاتورة حجز*\n\n`;
    text += `👤 *العميل:* ${name}\n`;
    text += `📦 *نوع الطلب:* ${type}\n`;
    text += `📍 *العنوان:* ${address}\n`;
    text += `⏰ *الموعد:* ${timeText}\n`;
    text += `━━━━━━━━━━━━━━━━━━\n\n`;

    cart.forEach(i => {
        let total = i.price * i.qty;
        text += `▪️ *${i.name}*\n`;
        text += `   العدد: ${i.qty} × ${i.price} = ${total} ر.س\n`;
        if (i.note && i.note.trim() !== "") {
            text += `📝 ملاحظة: ${i.note}\n`;
        }
        text += `\n`;
    });

    if (typeof orderType !== 'undefined' && orderType === "delivery") {
        let fee = parseFloat(document.getElementById("deliveryFee").value) || 0;
        text += `🚚 *رسوم التوصيل:* ${fee} ر.س\n\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━\n`;
    let totalText = document.getElementById("total").textContent;
    text += `💰 *الإجمالي النهائي: ${totalText}*\n\n`;
    text += `💙 شكراً لتعاملكم معنا\n`;
    text += `نتمنى لك يوماً سعيداً 🌟\n\n`;
    text += `📱 *لطلب أسهل وأسرع:*\n`;
    text += `https://deerty666.github.io/menu.html?branch=branch1`;

    // استخدام الرابط الرسمي لضمان تشفير الإيموجي
    let url = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(text);
    
    window.open(url, '_blank');
}

/* الطباعة */

function printReceipt() {
    const qr = "https://deerty666.github.io/menu.html?branch=branch1";

    let content = `
    <html>
    <head>
        <title>طباعة الفاتورة</title>
        <style>
            body { font-family: 'Tahoma', sans-serif; direction: rtl; text-align: right; padding: 10px; margin: 0; }
            .receipt-container { width: 72mm; margin: auto; }
            .center { text-align: center; }
            .flex-space { display: flex; justify-content: space-between; margin: 2px 0; }
            .dashed-line { border-bottom: 1px dashed #000; margin: 4px 0; }
            .logo { width: 70px; height: auto; }
            .qr-code { width: 120px; height: auto; }
            @media print { body { margin: 0; } }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="center">
                <img src="logo.png" class="logo"><br>
                <b>سحايب ديرتي</b><br>
                حجز مسبق<br>
                📞 0112020203
            </div>

            <hr>

            👤 ${document.getElementById("custName").value || "-"}<br>
            📞 ${document.getElementById("custPhone").value || "-"}<br>
            📍 ${document.getElementById("custAddress").value || "-"}<br>

            ${document.getElementById("custTime").value ?
            "⏰ " + new Date(document.getElementById("custTime").value).toLocaleString('ar-SA') : ""}

            <hr>
    `;

    // جزء إضافة أصناف السلة
    cart.forEach(i => {
        let total = i.price * i.qty;
        content += `
            <div class="flex-space">
                <span>${i.name} × ${i.qty}</span>
                <span>${total} ر.س</span>
            </div>
            <div class="dashed-line"></div>
            ${i.note ? `<div style="font-size:11px">📝 ${i.note}</div>` : ""}
        `;
    });

    content += `
            <hr>
            <div class="center" style="font-size:18px;font-weight:bold">
                ${document.getElementById("total").textContent}
            </div>

            <hr>

            <div class="center">
                <img src="qr.png" class="qr-code">
            </div>

            <div class="center" style="font-size:12px">
                شكراً لثقتكم ❤️
            </div>
        </div>

        <script>
            window.onload = function() {
                window.print();
                setTimeout(() => { window.close(); }, 500);
            };
        </script>
    </body>
    </html>
    `;

    let w = window.open('', '', 'width=600,height=800');
    w.document.open();
    w.document.write(content);
    w.document.close();
}


/* الإدارة */
function openAdmin(){document.getElementById("admin").style.display="block";renderAdmin();}
function closeAdmin(){document.getElementById("admin").style.display="none";}

function renderAdmin(){
let list=document.getElementById("adminList");
let select=document.getElementById("catSelect");

list.innerHTML="";select.innerHTML="";

menu.categories.forEach(cat=>{
let opt=document.createElement("option");
opt.value=cat;opt.textContent=cat;
select.appendChild(opt);

list.innerHTML+=`${cat} <button onclick="deleteCategory('${cat}')">❌</button><br>`;
});

menu.items.forEach(item=>{
list.innerHTML+=`${item.name} - ${item.price}
<button onclick="deleteItem(${item.id})">❌</button><br>`;
});
}

function addCategory(){
let name=document.getElementById("newCat").value;
if(!name)return;
menu.categories.push(name);
saveMenu();renderMenu();renderAdmin();
}

function deleteCategory(cat){
menu.categories=menu.categories.filter(c=>c!==cat);
menu.items=menu.items.filter(i=>i.category!==cat);
saveMenu();renderMenu();renderAdmin();
}

function addItem(){
let name=document.getElementById("newItemName").value;
let price=parseFloat(document.getElementById("newItemPrice").value);
let cat=document.getElementById("catSelect").value;

if(!name||!price)return;

menu.items.push({id:Date.now(),name,price,category:cat});
saveMenu();renderMenu();renderAdmin();
}

function deleteItem(id){
menu.items=menu.items.filter(i=>i.id!==id);
saveMenu();renderMenu();renderAdmin();
}

renderMenu();
