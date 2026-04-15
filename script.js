<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>POS - سحايب ديرتي</title>

<style>
body {font-family:Arial;margin:0;background:#f5f5f5;padding:10px;}
h2{text-align:center;}

.category-box {background:#fff;margin:8px 0;border-radius:10px;overflow:hidden;}
.category-header {padding:12px;background:#333;color:#fff;cursor:pointer;display:flex;justify-content:space-between;}
.items-grid {display:grid;grid-template-columns:repeat(2,1fr);gap:5px;padding:5px;}
.item-card {padding:10px;color:#fff;border-radius:8px;text-align:center;cursor:pointer;}

.cart-item {background:#fff;padding:10px;margin:5px 0;border-radius:8px;}

button {padding:6px 10px;border:none;border-radius:6px;margin:3px;cursor:pointer;}

#adminModal{
display:none;position:fixed;top:0;left:0;width:100%;height:100%;
background:rgba(0,0,0,0.5);justify-content:center;align-items:center;
}
#adminModal .box{
background:#fff;padding:15px;width:90%;max-width:400px;border-radius:10px;
}
</style>
</head>

<body>

<h2>سحايب ديرتي</h2>

<button onclick="openAdminModal()">⚙️ إدارة</button>

<div id="menuContainer"></div>

<h3>السلة</h3>
<div id="cart"></div>

<div>الإجمالي: <span id="grandTotal">0 ر.س</span></div>

<input id="custName" placeholder="اسم العميل">
<input id="custPhone" placeholder="الجوال">
<input id="custAddress" placeholder="الموقع">

<button onclick="printReceipt()">🖨️ طباعة</button>

<!-- الإدارة -->
<div id="adminModal">
<div class="box">

<h3>إدارة</h3>

<div id="adminCategoriesList"></div>

<input id="newCatName" placeholder="قسم جديد">
<button onclick="addCategory()">إضافة قسم</button>

<hr>

<select id="adminCatSelect"></select>

<input id="newItemNameAdmin" placeholder="اسم الصنف">
<input id="newItemPriceAdmin" placeholder="السعر">

<button onclick="addItemFromAdmin()">إضافة صنف</button>

<br><br>
<button onclick="closeAdminModal()">إغلاق</button>

</div>
</div>

<script>

let menu = JSON.parse(localStorage.getItem('menu')) || {
categories:["وجبات رئيسية","مشروبات"],
items:[]
};

let cart=[];

function saveMenu(){localStorage.setItem('menu',JSON.stringify(menu));}

function renderMenu(){
let c=document.getElementById('menuContainer');c.innerHTML='';

menu.categories.forEach(cat=>{
let box=document.createElement('div');
box.className='category-box';

box.innerHTML=`
<div class="category-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display==='grid'?'none':'grid'">
${cat}
</div>
<div class="items-grid" style="display:none"></div>
`;

let grid=box.querySelector('.items-grid');

menu.items.filter(i=>i.category===cat).forEach(item=>{
let card=document.createElement('div');
card.className='item-card';
card.style.background='#3498db';
card.innerHTML=`${item.name}<br>${item.price} ر.س`;
card.onclick=()=>addToCart(item);
grid.appendChild(card);
});

c.appendChild(box);
});
}

function addToCart(item){
cart.push({...item,qty:1});
renderCart();
}

function renderCart(){
let c=document.getElementById('cart');c.innerHTML='';
let total=0;

cart.forEach((item,i)=>{
total+=item.price*item.qty;

c.innerHTML+=`
<div class="cart-item">
${item.name} × ${item.qty} = ${item.price*item.qty}
<button onclick="removeItem(${i})">حذف</button>
</div>`;
});

document.getElementById('grandTotal').textContent=total.toFixed(2)+' ر.س';
}

function removeItem(i){
cart.splice(i,1);
renderCart();
}

//////////////////////////////////////////////////
// الإدارة
//////////////////////////////////////////////////

function openAdminModal(){
document.getElementById('adminModal').style.display='flex';
renderAdmin();
}

function closeAdminModal(){
document.getElementById('adminModal').style.display='none';
}

function renderAdmin(){
let list=document.getElementById('adminCategoriesList');
let select=document.getElementById('adminCatSelect');

list.innerHTML='';
select.innerHTML='';

menu.categories.forEach(cat=>{
list.innerHTML+=`${cat} <button onclick="deleteCategory('${cat}')">حذف</button><br>`;
select.innerHTML+=`<option>${cat}</option>`;
});
}

function addCategory(){
let name=document.getElementById('newCatName').value.trim();
if(!name)return;

menu.categories.push(name);
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

function addItemFromAdmin(){
let name=document.getElementById('newItemNameAdmin').value;
let price=parseFloat(document.getElementById('newItemPriceAdmin').value);
let cat=document.getElementById('adminCatSelect').value;

if(!name||!price)return;

menu.items.push({id:Date.now(),name,price,category:cat});
saveMenu();
renderMenu();
renderAdmin();
}

//////////////////////////////////////////////////
// الطباعة
//////////////////////////////////////////////////

function printReceipt(){

let total=cart.reduce((s,i)=>s+i.price*i.qty,0);

let html=`
<html><body style="width:72mm;font-family:Arial;direction:rtl;font-size:12px">

<div style="text-align:center">
<b>سحايب ديرتي</b><br>
${new Date().toLocaleString('ar-SA')}
</div>

<hr>

<div>
العميل: ${document.getElementById('custName').value||'-'}<br>
الجوال: ${document.getElementById('custPhone').value||'-'}<br>
الموقع: ${document.getElementById('custAddress').value||'-'}
</div>

<hr>

${cart.map(i=>`${i.name} × ${i.qty} = ${i.price*i.qty}`).join('<br>')}

<hr>

<b>الإجمالي: ${total.toFixed(2)} ر.س</b>

</body></html>
`;

let w=window.open('');
w.document.write(html);
w.print();
w.close();
}

renderMenu();

</script>

</body>
</html>
