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
function sendToWhatsApp(){

let inputPhone=document.getElementById("custPhone").value.trim();
let phone=inputPhone.replace(/\D/g,'');

if(phone.startsWith("05")) phone="966"+phone.substring(1);
else if(phone.startsWith("5")) phone="966"+phone;
else if(!phone.startsWith("966")) phone="966"+phone;

let type=orderType==="delivery" ? "🚗 توصيل" : "🏠 استلام";

let time=document.getElementById("custTime").value;
let timeText=time ? new Date(time).toLocaleString('ar-SA') : "-";

let text=`🧾 طلب حجز - سحايب ديرتي\n\n`;

text+=`📦 نوع الطلب: ${type}\n`;
text+=`👤 العميل: ${document.getElementById("custName").value||"-"}\n`;
text+=`📞 الجوال: ${inputPhone}\n`;
text+=`📍 العنوان: ${document.getElementById("custAddress").value||"-"}\n`;
text+=`⏰ الموعد: ${timeText}\n`;

text+=`\n━━━━━━━━━━━━\n`;

cart.forEach(i=>{
let total=i.price*i.qty;
text+=`▪️ ${i.name} × ${i.qty} = ${total} ر.س\n`;
if(i.note) text+=`📝 ${i.note}\n`;
text+=`\n`;
});

if(orderType==="delivery"){
let fee=parseFloat(document.getElementById("deliveryFee").value)||0;
text+=`🚚 رسوم التوصيل: ${fee} ر.س\n`;
}

text+=`━━━━━━━━━━━━\n`;
text+=`💰 الإجمالي: ${document.getElementById("total").textContent}\n`;

text+=`━━━━━━━━━━━━\n`;
text+=`📲 https://deerty666.github.io/menu.html?branch=branch1`;

let url="https://wa.me/"+phone+"?text="+encodeURIComponent(text);
window.location.href=url;
}

/* الطباعة */
function printReceipt(){

const qr="https://deerty666.github.io/menu.html?branch=branch1";

let content=`
<div style="width:72mm;font-family:tahoma;direction:rtl;text-align:right">

<div style="text-align:center">
<img src="logo.png" style="width:70px"><br>
<b>سحايب ديرتي</b><br>
حجز مسبق<br>
📞 0112020203
</div>

<hr>

👤 ${document.getElementById("custName").value||"-"}<br>
📞 ${document.getElementById("custPhone").value||"-"}<br>
📍 ${document.getElementById("custAddress").value||"-"}<br>

${document.getElementById("custTime").value ?
"⏰ "+new Date(document.getElementById("custTime").value).toLocaleString('ar-SA')+"<br>" : ""}

<hr>
`;

cart.forEach(i=>{
let total=i.price*i.qty;

content+=`
<div style="display:flex;justify-content:space-between">
<span>${i.name} × ${i.qty}</span>
<span>........ ${total} ر.س</span>
</div>
<div style="border-bottom:1px dashed #000;margin:4px 0;"></div>
${i.note ? `<div style="font-size:11px">📝 ${i.note}</div>` : ""}
`;
});

content+=`
<hr>
<div style="text-align:center;font-size:18px;font-weight:bold">
${document.getElementById("total").textContent}
</div>

<hr>

<div style="text-align:center">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qr)}">
</div>

<div style="text-align:center;font-size:12px">
شكراً لثقتكم ❤️
</div>

</div>
`;

let w=window.open('','','width=300,height=600');
w.document.write(content);
w.document.close();
w.print();
w.close();
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
