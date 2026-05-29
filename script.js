let defaultMenu={
categories:["وجبات","مشروبات"],
items:[
{id:1,name:"برجر",price:15,category:"وجبات"},
{id:2,name:"بيتزا",price:25,category:"وجبات"},
{id:3,name:"عصير",price:8,category:"مشروبات"}
]
};

let saved=null;
try{
  saved=JSON.parse(localStorage.getItem("menu"));
}catch(e){
  localStorage.removeItem("menu");
}

let menu=(saved&&saved.items&&saved.items.length>0)?saved:defaultMenu;

let cart=[],openCategory=null,orderType="takeaway";

function saveMenu(){localStorage.setItem("menu",JSON.stringify(menu));}

/* القائمة */
function renderMenu(){
let c=document.getElementById("menuContainer");
c.innerHTML="";

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

function toggleCategory(cat){
openCategory=openCategory===cat?null:cat;
renderMenu();
}

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

function getTotalNumber(){
let total=cart.reduce((s,i)=>s+i.price*i.qty,0);
if(orderType==="delivery"){
total+=parseFloat(document.getElementById("deliveryFee").value)||0;
}
return total;
}

function updateTotal(){
document.getElementById("total").textContent=getTotalNumber()+" ر.س";
}

function setOrderType(t){
orderType=t;
document.getElementById("deliveryBox").style.display=t==="delivery"?"block":"none";
updateTotal();
}

/* جديد */
function clearCart(){
cart=[];

document.getElementById("custName").value="";
document.getElementById("custPhone").value="";
document.getElementById("custAddress").value="";
document.getElementById("custTime").value="";

let pay=document.getElementById("paymentStatus");
if(pay) pay.value="غير مدفوع";

orderType="takeaway";

let box=document.getElementById("deliveryBox");
if(box) box.style.display="none";

let fee=document.getElementById("deliveryFee");
if(fee) fee.value=5;

renderCart();
updateTotal();
}

/* حفظ فواتير اليوم */
function getTodayKey(){
let d=new Date();
return "invoices_"+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}

function saveInvoice(){
if(cart.length===0){
alert("السلة فاضية");
return;
}

let invoices=JSON.parse(localStorage.getItem(getTodayKey()))||[];

let invoice={
id:Date.now(),
invoiceNo:invoices.length+1,
date:new Date().toLocaleString('ar-SA'),
name:document.getElementById("custName").value || "-",
phone:document.getElementById("custPhone").value || "-",
address:document.getElementById("custAddress").value || "-",
payment:document.getElementById("paymentStatus") ? document.getElementById("paymentStatus").value : "غير مدفوع",
orderType:orderType,
deliveryFee:orderType==="delivery" ? parseFloat(document.getElementById("deliveryFee").value)||0 : 0,
items:JSON.parse(JSON.stringify(cart)),
total:getTotalNumber()
};

invoices.push(invoice);
localStorage.setItem(getTodayKey(),JSON.stringify(invoices));

alert("تم حفظ الفاتورة ✅");
showTodayInvoices(true);
}

function showTodayInvoices(forceOpen=false){
let box=document.getElementById("todayInvoices");
if(!box)return;

let invoices=JSON.parse(localStorage.getItem(getTodayKey()))||[];

if(forceOpen){
box.style.display="block";
}else{
box.style.display=box.style.display==="none"?"block":"none";
}

if(box.style.display==="none")return;

if(invoices.length===0){
box.innerHTML="<h3>لا توجد فواتير محفوظة اليوم</h3>";
return;
}

let html="<h3>فواتير اليوم</h3>";

invoices.forEach((inv,index)=>{
html+=`
<div class="invoice-box">
<b>فاتورة رقم: ${inv.invoiceNo}</b><br>
العميل: ${inv.name}<br>
الجوال: ${inv.phone}<br>
الدفع: <b>${inv.payment}</b><br>
الإجمالي: <b>${Number(inv.total).toFixed(2)} ر.س</b><br>
الوقت: ${inv.date}<br>
<button onclick="loadInvoice(${index})">استرجاع</button>
<button onclick="deleteInvoice(${index})">حذف</button>
</div>
`;
});

let totalDay=invoices.reduce((s,i)=>s+Number(i.total),0);
html+=`<h2>إجمالي اليوم: ${totalDay.toFixed(2)} ر.س</h2>`;

box.innerHTML=html;
}

function loadInvoice(index){
let invoices=JSON.parse(localStorage.getItem(getTodayKey()))||[];
let inv=invoices[index];
if(!inv)return;

cart=JSON.parse(JSON.stringify(inv.items));
orderType=inv.orderType || "takeaway";

document.getElementById("custName").value=inv.name || "";
document.getElementById("custPhone").value=inv.phone || "";
document.getElementById("custAddress").value=inv.address || "";

if(document.getElementById("paymentStatus")){
document.getElementById("paymentStatus").value=inv.payment || "غير مدفوع";
}

document.getElementById("deliveryBox").style.display=orderType==="delivery"?"block":"none";
document.getElementById("deliveryFee").value=inv.deliveryFee || 5;

renderCart();
alert("تم استرجاع الفاتورة ✅");
}

function deleteInvoice(index){
if(!confirm("حذف هذه الفاتورة؟"))return;

let invoices=JSON.parse(localStorage.getItem(getTodayKey()))||[];
invoices.splice(index,1);
localStorage.setItem(getTodayKey(),JSON.stringify(invoices));

showTodayInvoices(true);
}

function clearTodayInvoices(){
if(confirm("هل تريد مسح فواتير اليوم؟")){
localStorage.removeItem(getTodayKey());
let box=document.getElementById("todayInvoices");
if(box) box.innerHTML="";
alert("تم مسح فواتير اليوم ✅");
}
}

/* واتساب نفس النظام القديم */
function sendToWhatsApp(){
if(cart.length===0){
alert("السلة فاضية");
return;
}

let inputPhone=document.getElementById("custPhone").value.trim();
let phone=inputPhone.replace(/\D/g,'');

if(phone===""){
alert("اكتب رقم الواتساب");
return;
}

if(phone.startsWith("05")) phone="966"+phone.substring(1);
else if(phone.startsWith("5")) phone="966"+phone;
else if(!phone.startsWith("966")) phone="966"+phone;

let name=document.getElementById("custName").value.trim() || "لم يحدد";
let address=document.getElementById("custAddress").value.trim() || "لم يحدد";
let time=document.getElementById("custTime").value;
let timeText=time ? new Date(time).toLocaleString('ar-SA') : "-";
let paymentStatus=document.getElementById("paymentStatus") ? document.getElementById("paymentStatus").value : "غير مدفوع";

let type=orderType==="delivery" ? "🚗 توصيل" : "🏠 استلام";

let text=`🧾 *مطعم ديرتي - تفاصيل الطلب*\n\n`;
text+=`👤 *العميل:* ${name}\n`;
text+=`📦 *نوع الطلب:* ${type}\n`;
text+=`💳 *حالة الدفع:* ${paymentStatus}\n`;
text+=`📍 *العنوان:* ${address}\n`;
text+=`⏰ *الموعد:* ${timeText}\n`;
text+=`━━━━━━━━━━━━━━━━━━\n\n`;

cart.forEach(i=>{
let total=i.price*i.qty;
text+=`▪️ *${i.name}*\n`;
text+=`   العدد: ${i.qty} × ${i.price} = ${total} ر.س\n`;
if(i.note && i.note.trim()!==""){
text+=`📝 ملاحظة: ${i.note}\n`;
}
text+=`\n`;
});

if(orderType==="delivery"){
let fee=parseFloat(document.getElementById("deliveryFee").value)||0;
text+=`🚚 *رسوم التوصيل:* ${fee} ر.س\n\n`;
}

text+=`━━━━━━━━━━━━━━━━━━\n`;
text+=`💰 *الإجمالي النهائي: ${document.getElementById("total").textContent}*\n\n`;
text+=`💙 شكراً لتعاملكم معنا\n`;
text+=`نتمنى لكم وجبة شهية 😋 🌟\n\n`;
text+=`📱 *خل ديرتي دايم معك*\n`;
text+=`وثبت التطبيق الآن 👇\n`;
text+=`https://deerty666.github.io/menu.html?branch=branch1`;

let url="https://api.whatsapp.com/send?phone="+phone+"&text="+encodeURIComponent(text);
window.open(url,'_blank');
}

/* الطباعة الحرارية 80mm */
function printReceipt(){
if(cart.length===0){
alert("السلة فاضية");
return;
}

let cName=document.getElementById("custName").value || "-";
let cPhone=document.getElementById("custPhone").value || "-";
let cAddress=document.getElementById("custAddress").value || "-";
let cTime=document.getElementById("custTime").value;
let paymentStatus=document.getElementById("paymentStatus") ? document.getElementById("paymentStatus").value : "غير مدفوع";

let timeText=cTime ? new Date(cTime).toLocaleString('ar-SA') : new Date().toLocaleString('ar-SA');
let totalNumber=getTotalNumber();
let invoiceNo=Math.floor(100000 + Math.random() * 900000);

let content=`
<html>
<head>
<meta charset="UTF-8">
<style>
@page{size:80mm auto;margin:0}
*{box-sizing:border-box}

html,body{
margin:0;
padding:0;
width:80mm;
direction:rtl;
background:#fff;
font-family:Tahoma,Arial,sans-serif;
color:#111;
}

.receipt{
width:68mm;
margin:0 auto;
padding:1.5mm;
}

.center{text-align:center}

.logo{
width:190px;
max-height:100px;
object-fit:contain;
}

.title{
font-size:17px;
font-weight:900;
margin:0;
}

.sub{
font-size:9px;
margin:0;
}

.phone{
font-size:11px;
font-weight:bold;
margin:1px 0 3px;
}

.black-box{
background:#111;
color:#fff;
text-align:center;
font-size:13px;
font-weight:900;
padding:3px;
border-radius:3px;
margin-bottom:4px;
}

.info-box{
border:1px solid #111;
border-radius:4px;
padding:2px 5px;
margin-bottom:4px;
}

.info-row{
display:flex;
justify-content:space-between;
gap:5px;
padding:1px 0;
border-bottom:1px dashed #aaa;
font-size:10px;
font-weight:bold;
}

.info-row:last-child{border-bottom:none}

table{
width:100%;
border-collapse:collapse;
}

th{
background:#111;
color:#fff;
padding:4px 2px;
font-size:13px;
}

td{
padding:4px 2px;
border-bottom:1px dashed #bbb;
text-align:center;
font-size:13px;
}

.name{
text-align:right;
max-width:65px;
word-break:break-word;
}

.note{
font-size:9px;
color:#333;
}

.total-box{
margin-top:4px;
border:1px solid #111;
border-radius:4px;
overflow:hidden;
}

.total-head{
background:#111;
color:#fff;
text-align:center;
padding:3px;
font-size:12px;
font-weight:900;
}

.total-price{
text-align:center;
font-size:20px;
font-weight:900;
padding:4px 0;
}

.thanks{
text-align:center;
margin-top:3px;
line-height:1.3;
font-size:10px;
font-weight:bold;
}

.qr{
width:60px;
margin-top:3px;
}

.footer{
text-align:center;
font-size:10px;
font-weight:900;
}
</style>
</head>

<body>
<div class="receipt">

<div class="center">
<img src="logo.png" class="logo">
<div class="title">سحايب ديرتي</div>
<div class="sub">شركة مطاعم سحايب ديرتي</div>
<div class="phone">📞 0112020203</div>
</div>

<div class="black-box">فاتورة حجز مؤقتة</div>

<div class="info-box">
<div class="info-row"><span>رقم الفاتورة</span><span>${invoiceNo}</span></div>
<div class="info-row"><span>اسم العميل</span><span>${cName}</span></div>
<div class="info-row"><span>الجوال</span><span>${cPhone}</span></div>
<div class="info-row"><span>العنوان</span><span>${cAddress}</span></div>
<div class="info-row"><span>الوقت</span><span>${timeText}</span></div>
<div class="info-row"><span>حالة الدفع</span><span>${paymentStatus}</span></div>
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
content+=`
<tr>
<td class="name">${i.name}</td>
<td>${i.qty}</td>
<td>${Number(i.price).toFixed(2)}</td>
<td>${Number(i.price*i.qty).toFixed(2)}</td>
</tr>
`;

if(i.note && i.note.trim()!==""){
content+=`
<tr>
<td colspan="4" style="text-align:right">
<div class="note">✦ ${i.note}</div>
</td>
</tr>
`;
}
});

if(orderType==="delivery"){
let fee=parseFloat(document.getElementById("deliveryFee").value)||0;
content+=`
<tr>
<td class="name">رسوم التوصيل</td>
<td>1</td>
<td>${fee.toFixed(2)}</td>
<td>${fee.toFixed(2)}</td>
</tr>
`;
}

content+=`
</tbody>
</table>

<div class="total-box">
<div class="total-head">الإجمالي النهائي</div>
<div class="total-price">${totalNumber.toFixed(2)} ر.س</div>
</div>

<div class="thanks">
شكراً لكم 🌹<br>
نتمنى لكم وجبة شهية 😋
</div>

<div class="center">
<img src="qr.png" class="qr">
<div class="footer">اطلب من جوالك 📲</div>
</div>

</div>

<script>
window.onload=function(){
setTimeout(function(){
window.print();
setTimeout(function(){window.close();},600);
},300);
};
<\/script>

</body>
</html>
`;

let w=window.open('','','width=420,height=620');
w.document.open();
w.document.write(content);
w.document.close();
}

/* الإدارة */
function renderAdmin(){
let list=document.getElementById("adminList");
let select=document.getElementById("catSelect");

list.innerHTML="";
select.innerHTML="";

list.innerHTML+=`<h3>الأقسام</h3>`;
list.innerHTML+=`<div class="admin-grid">`;

menu.categories.forEach(cat=>{
let opt=document.createElement("option");
opt.value=cat;
opt.textContent=cat;
select.appendChild(opt);

list.innerHTML+=`
<div class="admin-card">
<input value="${cat}" onchange="editCategory('${cat}', this.value)">
<button onclick="deleteCategory('${cat}')">❌ حذف</button>
</div>
`;
});

list.innerHTML+=`</div>`;

list.innerHTML+=`<hr><h3>الأصناف</h3>`;
list.innerHTML+=`<div class="admin-item-grid">`;

menu.items.forEach(item=>{
list.innerHTML+=`
<div class="admin-card">
<input value="${item.name}" onchange="editItemName(${item.id}, this.value)">
<input type="number" value="${item.price}" onchange="editItemPrice(${item.id}, this.value)">
<button onclick="deleteItem(${item.id})">❌ حذف</button>
</div>
`;
});

list.innerHTML+=`</div>`;
}

function editCategory(oldName,newName){
newName=newName.trim();
if(!newName)return;

menu.categories=menu.categories.map(c=>c===oldName?newName:c);

menu.items.forEach(item=>{
if(item.category===oldName){
item.category=newName;
}
});

saveMenu();
renderMenu();
renderAdmin();
}

function editItemName(id,newName){
newName=newName.trim();
if(!newName)return;

let item=menu.items.find(i=>i.id===id);
if(item){
item.name=newName;
saveMenu();
renderMenu();
renderAdmin();
}
}

function editItemPrice(id,newPrice){
newPrice=parseFloat(newPrice);
if(!newPrice)return;

let item=menu.items.find(i=>i.id===id);
if(item){
item.price=newPrice;
saveMenu();
renderMenu();
renderAdmin();
}
}

function addCategory(){
let name=document.getElementById("newCat").value.trim();
if(!name)return;

menu.categories.push(name);
document.getElementById("newCat").value="";

saveMenu();
renderMenu();
renderAdmin();
}

function deleteCategory(cat){
menu.categories=menu.categories.filter(c=>c!==cat);
menu.items=menu.items.filter(i=>i.category!==cat);

saveMenu();
renderMenu();
renderAdmin();
}

function addItem(){
let name=document.getElementById("newItemName").value.trim();
let price=parseFloat(document.getElementById("newItemPrice").value);
let cat=document.getElementById("catSelect").value;

if(!name||!price)return;

menu.items.push({
id:Date.now(),
name,
price,
category:cat
});

document.getElementById("newItemName").value="";
document.getElementById("newItemPrice").value="";

saveMenu();
renderMenu();
renderAdmin();
}

function deleteItem(id){
menu.items=menu.items.filter(i=>i.id!==id);

saveMenu();
renderMenu();
renderAdmin();
}

renderMenu();
renderCart();
