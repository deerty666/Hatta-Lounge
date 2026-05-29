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

let menu=(saved&&saved.items)?saved:defaultMenu;

let cart=[];
let openCategory=null;
let orderType="takeaway";

function saveMenu(){
localStorage.setItem("menu",JSON.stringify(menu));
}

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

function addToCart(item){

let found=cart.find(i=>i.id===item.id);

if(found){
found.qty++;
}else{
cart.push({...item,qty:1,note:""});
}

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

<input placeholder="ملاحظة"
value="${i.note||''}"
onchange="cart[${index}].note=this.value">

<hr>
`;

});

updateTotal();
}

function changeQty(i,d){
cart[i].qty+=d;

if(cart[i].qty<=0){
cart.splice(i,1);
}

renderCart();
}

function updateTotal(){

let total=cart.reduce((s,i)=>s+i.price*i.qty,0);

if(orderType==="delivery"){
total+=parseFloat(document.getElementById("deliveryFee").value)||0;
}

document.getElementById("total").textContent=total+" ر.س";
}

function setOrderType(t){

orderType=t;

document.getElementById("deliveryBox").style.display=
t==="delivery"?"block":"none";

updateTotal();
}

function clearCart(){

cart=[];

document.getElementById("custName").value="";
document.getElementById("custPhone").value="";
document.getElementById("custAddress").value="";
document.getElementById("custTime").value="";

renderCart();
}

function getTodayKey(){

let d=new Date();

return "invoices_"+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}

function saveInvoice(){

let invoices=JSON.parse(localStorage.getItem(getTodayKey()))||[];

invoices.push({
date:new Date().toLocaleString('ar-SA'),
customer:document.getElementById("custName").value,
total:document.getElementById("total").textContent,
payment:document.getElementById("paymentStatus").value
});

localStorage.setItem(getTodayKey(),JSON.stringify(invoices));

alert("تم حفظ الفاتورة");
}

function showTodayInvoices(){

let box=document.getElementById("todayInvoices");

box.style.display=
box.style.display==="none"?"block":"none";

let invoices=JSON.parse(localStorage.getItem(getTodayKey()))||[];

if(invoices.length===0){
box.innerHTML="لا توجد فواتير";
return;
}

let html="";

invoices.forEach(inv=>{

html+=`
<div class="invoice-box">
العميل: ${inv.customer}<br>
الإجمالي: ${inv.total}<br>
الدفع: ${inv.payment}<br>
الوقت: ${inv.date}
</div>
`;

});

box.innerHTML=html;
}

function clearTodayInvoices(){

if(confirm("مسح جميع الفواتير؟")){

localStorage.removeItem(getTodayKey());

document.getElementById("todayInvoices").innerHTML="";

alert("تم المسح");
}
}

function openAdmin(){
document.getElementById("admin").style.display="block";
renderAdmin();
}

function closeAdmin(){
document.getElementById("admin").style.display="none";
}

function renderAdmin(){

let list=document.getElementById("adminList");
let select=document.getElementById("catSelect");

list.innerHTML="";
select.innerHTML="";

menu.categories.forEach(cat=>{

let opt=document.createElement("option");

opt.value=cat;
opt.textContent=cat;

select.appendChild(opt);

list.innerHTML+=`
<div>
<input value="${cat}"
onchange="editCategory('${cat}',this.value)">
<button onclick="deleteCategory('${cat}')">حذف</button>
</div>
`;

});

menu.items.forEach(item=>{

list.innerHTML+=`
<div>
<input value="${item.name}"
onchange="editItemName(${item.id},this.value)">

<input type="number"
value="${item.price}"
onchange="editItemPrice(${item.id},this.value)">

<button onclick="deleteItem(${item.id})">حذف</button>
</div>
`;

});

}

function addCategory(){

let name=document.getElementById("newCat").value.trim();

if(!name)return;

menu.categories.push(name);

saveMenu();
renderMenu();
renderAdmin();
}

function addItem(){

let name=document.getElementById("newItemName").value;
let price=parseFloat(document.getElementById("newItemPrice").value);
let cat=document.getElementById("catSelect").value;

if(!name||!price)return;

menu.items.push({
id:Date.now(),
name,
price,
category:cat
});

saveMenu();
renderMenu();
renderAdmin();
}

function deleteCategory(cat){

menu.categories=
menu.categories.filter(c=>c!==cat);

menu.items=
menu.items.filter(i=>i.category!==cat);

saveMenu();
renderMenu();
renderAdmin();
}

function deleteItem(id){

menu.items=
menu.items.filter(i=>i.id!==id);

saveMenu();
renderMenu();
renderAdmin();
}

function editCategory(oldName,newName){

menu.categories=
menu.categories.map(c=>c===oldName?newName:c);

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

let item=menu.items.find(i=>i.id===id);

if(item){
item.name=newName;
saveMenu();
renderMenu();
}
}

function editItemPrice(id,newPrice){

let item=menu.items.find(i=>i.id===id);

if(item){
item.price=parseFloat(newPrice);
saveMenu();
renderMenu();
}
}

function printReceipt(){
window.print();
}

function sendToWhatsApp(){
alert("أضف كود الواتساب القديم هنا");
}

renderMenu();
renderCart();
