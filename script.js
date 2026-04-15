// بيانات افتراضية
let defaultMenu = {
    categories: ["وجبات رئيسية","مشروبات"],
    items: [
        {id:1,name:"برجر",price:15,category:"وجبات رئيسية"},
        {id:2,name:"بيتزا",price:25,category:"وجبات رئيسية"},
        {id:3,name:"عصير",price:8,category:"مشروبات"}
    ]
};

let menu = JSON.parse(localStorage.getItem("menu")) || defaultMenu;
let cart=[];
let openCategory=null;
let orderType="takeaway";

// حفظ
function saveMenu(){
    localStorage.setItem("menu",JSON.stringify(menu));
}

// القائمة
function renderMenu(){
    let c=document.getElementById("menuContainer");
    c.innerHTML="";

    menu.categories.forEach(cat=>{
        let box=document.createElement("div");
        box.className="category";

        let title=document.createElement("div");
        title.className="category-title";
        title.textContent=cat;
        title.onclick=()=>toggleCategory(cat);

        let items=document.createElement("div");
        items.style.display=openCategory===cat?"block":"none";

        menu.items.filter(i=>i.category===cat).forEach(item=>{
            let d=document.createElement("div");
            d.className="item";
            d.textContent=item.name+" - "+item.price;
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

// السلة
function addToCart(item){
    cart.push({...item,qty:1});
    renderCart();
}

function renderCart(){
    let c=document.getElementById("cartItems");
    c.innerHTML="";
    let total=0;

    cart.forEach((i,index)=>{
        total+=i.price*i.qty;
        c.innerHTML+=`
        ${i.name} × ${i.qty}
        <button onclick="changeQty(${index},1)">+</button>
        <button onclick="changeQty(${index},-1)">-</button>
        <br>`;
    });

    updateTotal();
}

function changeQty(i,d){
    cart[i].qty+=d;
    if(cart[i].qty<=0) cart.splice(i,1);
    renderCart();
}

function updateTotal(){
    let total=cart.reduce((s,i)=>s+i.price*i.qty,0);

    if(orderType==="delivery"){
        total+=parseFloat(document.getElementById("deliveryFee").value)||0;
    }

    document.getElementById("total").textContent=total+" ر.س";
}

// نوع الطلب
function setOrderType(t){
    orderType=t;

    document.getElementById("deliveryBox").style.display=
        t==="delivery"?"block":"none";

    updateTotal();
}

// واتساب
function sendToWhatsApp(){
    let phone=document.getElementById("custPhone").value;

    if(phone.startsWith("0")) phone="966"+phone.substring(1);

    let text="🧾 طلب جديد\n\n";

    cart.forEach(i=>{
        text+=`${i.name} × ${i.qty}\n`;
    });

    text+=`\nالإجمالي: ${document.getElementById("total").textContent}`;
    text+=`\n\nاطلب من هنا:\nhttps://deerty666.github.io/menu.html?branch=branch1`;

    window.open("https://wa.me/"+phone+"?text="+encodeURIComponent(text));
}

// طباعة
function printReceipt(){
    let html=document.getElementById("printArea").innerHTML;

    document.body.innerHTML="<div style='width:72mm'>"+html+"</div>";
    window.print();
    location.reload();
}

// مسح
function clearCart(){
    cart=[];
    renderCart();
}

// الإدارة
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

        list.innerHTML+=`<b>${cat}</b>
        <button onclick="deleteCategory('${cat}')">حذف</button><br>`;
    });
}

function addCategory(){
    let name=document.getElementById("newCat").value;
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

function addItem(){
    let name=document.getElementById("newItemName").value;
    let price=parseFloat(document.getElementById("newItemPrice").value);
    let cat=document.getElementById("catSelect").value;

    if(!name||!price)return;

    menu.items.push({id:Date.now(),name,price,category:cat});
    saveMenu();
    renderMenu();
    renderAdmin();
}

// تشغيل
renderMenu();
