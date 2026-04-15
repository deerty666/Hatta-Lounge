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
function addToCart(item){cart.push({...item,qty:1,note:""});renderCart();}

function renderCart(){
let c=document.getElementById("cartItems");c.innerHTML="";

cart.forEach((i,index)=>{
c.innerHTML+=`
${i.name} × ${i.qty}
<input placeholder="ملاحظة" value="${i.note||''}" onchange="cart[${index}].note=this.value">
<button onclick="changeQty(${index},1)">+</button>
<button onclick="changeQty(${index},-1)">-</button><br>
`;
});

updateTotal();
}

function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);renderCart();}

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

/* واتساب */
function sendToWhatsApp(){
let phone=document.getElementById("custPhone").value.trim().replace(/\D/g,'');

if(phone.startsWith("05")) phone="966"+phone.substring(1);
if(phone.startsWith("5")) phone="966"+phone;
if(!phone.startsWith("966")) phone="966"+phone;

let text="🧾 حجز مسبق - سحايب ديرتي\n\n";

text+=`👤 ${document.getElementById("custName").value||"-"}\n`;
text+=`📞 ${phone}\n`;
text+=`📍 ${document.getElementById("custAddress").value||"-"}\n`;

let time=document.getElementById("custTime").value;
if(time) text+=`⏰ ${new Date(time).toLocaleString('ar-SA')}\n`;

text+="\n━━━━━━━━━━━━\n";

cart.forEach(i=>{
text+=`▫️ ${i.name} × ${i.qty}\n`;
if(i.note) text+=`📝 ${i.note}\n`;
});

text+=`\n💰 ${document.getElementById("total").textContent}`;
text+=`\n━━━━━━━━━━━━\n`;
text+=`📲 https://deerty666.github.io/menu.html?branch=branch1`;

window.location.href="https://wa.me/"+phone+"?text="+encodeURIComponent(text);
}

/* الطباعة */
function printReceipt(){

const qr="https://deerty666.github.io/menu.html?branch=branch1";

let content=`
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
<div style="display:flex;justify-content:space-between;">
<span>${i.name} × ${i.qty}</span>
<span>${total} ر.س</span>
</div>
<div style="border-bottom:1px dotted #000;margin:3px 0;"></div>
${i.note ? `<div>📝 ${i.note}</div>` : ""}
`;
});

content+=`
<hr>
<div style="text-align:center;font-size:18px">
${document.getElementById("total").textContent}
</div>

<hr>

<div style="text-align:center">
<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qr)}">
</div>

<div style="text-align:center;font-size:12px">
شكراً لثقتكم ❤️
</div>
`;

document.getElementById("printArea").innerHTML=content;
window.print();
location.reload();
}

function clearCart(){cart=[];renderCart();}

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
menu.categories.push(name);saveMenu();renderMenu();renderAdmin();
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
