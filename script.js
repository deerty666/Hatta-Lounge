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

    let name = document.getElementById("custName").value.trim() || "لم يحدد";
    let address = document.getElementById("custAddress").value.trim() || "لم يحدد";
    let time = document.getElementById("custTime").value;
    let timeText = time ? new Date(time).toLocaleString('ar-SA') : "-";

    // استخدام الرموز مباشرة (تظهر بوضوح في GitHub و WhatsApp)
    let type = (typeof orderType !== 'undefined' && orderType === "delivery") ? "🚗 توصيل" : "🏠 استلام";

    let text = `🧾 *مطعم ديرتي - تفاصيل الطلب*\n\n`;
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
    text += `نتمنى لكم وجبة شهية 😋 🌟\n\n`;
    text += `📱 *📲 خل ديرتي دايم معك
وثبت التطبيق الآن 👇:*\n`;
    text += `https://deerty666.github.io/menu.html?branch=branch1`;

    // استخدام الرابط الرسمي لضمان تشفير الإيموجي
    let url = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(text);
    
    window.open(url, '_blank');
}
/* الطباعة */
function printReceipt() {

    let cName = document.getElementById("custName").value || "-";
    let cPhone = document.getElementById("custPhone").value || "-";
    let cTime = document.getElementById("custTime").value;

    let timeText = cTime
        ? new Date(cTime).toLocaleString('ar-SA')
        : new Date().toLocaleString('ar-SA');

    let totalNumber = cart.reduce((s,i)=>s+(i.price*i.qty),0);

    if(orderType==="delivery"){
        totalNumber += parseFloat(document.getElementById("deliveryFee").value) || 0;
    }

    let invoiceNo = Math.floor(100000 + Math.random() * 900000);

    let content = `
<html>
<head>
<meta charset="UTF-8">

<style>

@page{
    size:80mm auto;
    margin:0;
}

*{
    box-sizing:border-box;
}

body{
    margin:0;
    padding:0;
    direction:rtl;
    background:#fff;
    font-family:Tahoma,Arial,sans-serif;
    color:#111;
}

.receipt{
    width:72mm;
    margin:auto;
    padding:4mm;
}

.center{
    text-align:center;
}

.logo{
    width:110px;
    max-height:90px;
    object-fit:contain;
    margin-bottom:5px;
}

.title{
    font-size:26px;
    font-weight:900;
    margin:0;
}

.sub{
    font-size:12px;
    margin-top:2px;
    margin-bottom:10px;
}

.black-box{
    background:#111;
    color:#fff;
    text-align:center;
    font-size:18px;
    font-weight:900;
    padding:8px;
    border-radius:4px;
    margin-bottom:10px;
}

.info-box{
    border:2px solid #111;
    border-radius:6px;
    padding:6px;
    margin-bottom:10px;
}

.info-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:6px 0;
    border-bottom:1px dashed #999;
    font-size:15px;
    font-weight:bold;
}

.info-row:last-child{
    border-bottom:none;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:5px;
}

th{
    background:#111;
    color:#fff;
    padding:8px 3px;
    font-size:14px;
}

td{
    padding:7px 3px;
    border-bottom:1px dashed #bbb;
    text-align:center;
    font-size:14px;
}

.name{
    text-align:right;
}

.total-box{
    margin-top:12px;
    border:2px solid #111;
    border-radius:6px;
    overflow:hidden;
}

.total-head{
    background:#111;
    color:#fff;
    text-align:center;
    padding:8px;
    font-size:18px;
    font-weight:900;
}

.total-price{
    text-align:center;
    font-size:32px;
    font-weight:900;
    padding:12px 0;
}

.note{
    font-size:12px;
    color:#444;
    margin:3px 0 6px;
}

.thanks{
    text-align:center;
    margin-top:10px;
    line-height:1.8;
    font-size:13px;
    font-weight:bold;
}

.qr{
    width:120px;
    margin-top:10px;
}

.footer{
    text-align:center;
    font-size:14px;
    font-weight:900;
    margin-top:5px;
}

</style>
</head>

<body>

<div class="receipt">

    <div class="center">
        <img src="logo.png" class="logo">
        <div class="title">سحايب ديرتي</div>
        <div class="sub">شركة مطاعم سحايب ديرتي </div>
    </div>

    <div class="black-box">
        فاتورةحجز مؤقته  
    </div>

    <div class="info-box">

    <div class="info-row">
        <span>رقم الفاتورة</span>
        <span>${invoiceNo}</span>
    </div>

    <div class="info-row">
        <span>اسم العميل</span>
        <span>${cName}</span>
    </div>

    <div class="info-row">
        <span>جوال العميل</span>
        <span>${cPhone}</span>
    </div>

    <div class="info-row">
        <span>عنوان العميل</span>
        <span>${document.getElementById("custAddress").value || "-"}</span>
    </div>

    <div class="info-row">
        <span>الوقت</span>
        <span>${timeText}</span>
    </div>

</div>

    <table>

        <thead>
            <tr>
                <th>الصنف</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
            </tr>
        </thead>

        <tbody>
    `;

    cart.forEach(i=>{

        content += `
        <tr>
            <td class="name">${i.name}</td>
            <td>${i.qty}</td>
            <td>${Number(i.price).toFixed(2)}</td>
            <td>${Number(i.price * i.qty).toFixed(2)}</td>
        </tr>
        `;

        if(i.note && i.note.trim()!==""){
            content += `
            <tr>
                <td colspan="4" style="text-align:right">
                    <div class="note">
                        ✦ ملاحظة: ${i.note}
                    </div>
                </td>
            </tr>
            `;
        }

    });

    if(orderType==="delivery"){

        let fee = parseFloat(document.getElementById("deliveryFee").value) || 0;

        content += `
        <tr>
            <td class="name">رسوم التوصيل</td>
            <td>1</td>
            <td>${fee.toFixed(2)}</td>
            <td>${fee.toFixed(2)}</td>
        </tr>
        `;
    }

    content += `

        </tbody>

    </table>

    <div class="total-box">

        <div class="total-head">
            الإجمالي النهائي
        </div>

        <div class="total-price">
            ${totalNumber.toFixed(2)} ر.س
        </div>

    </div>

    <div class="thanks">
        شكراً لكم 🌹<br>
        نتمنى لكم وجبة شهية 😋
    </div>

    <div class="center">
        <img src="qr.png" class="qr">
        <div class="footer">
            اطلب من جوالك 📲
        </div>
    </div>

</div>

<script>

window.onload = function(){

    setTimeout(function(){

        window.print();

        setTimeout(function(){

            window.close();

        },600);

    },300);

};

<\/script>

</body>
</html>
`;

    let w = window.open('', '', 'width=450,height=800');

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
