// بيانات افتراضية (ما تخرب أبداً)
let defaultMenu = {
    categories: ["وجبات رئيسية", "مشروبات"],
    items: [
        {id:1, name:"برجر", price:15, category:"وجبات رئيسية"},
        {id:2, name:"بيتزا", price:25, category:"وجبات رئيسية"},
        {id:3, name:"عصير", price:8, category:"مشروبات"}
    ]
};

// تحميل أو إنشاء البيانات
let saved = JSON.parse(localStorage.getItem('menu'));
let menu = (saved && saved.items && saved.items.length > 0)
    ? saved
    : defaultMenu;

let cart = [];
let openCategory = null;

// حفظ
function saveMenu(){
    localStorage.setItem('menu', JSON.stringify(menu));
}

// عرض القائمة
function renderMenu(){
    let container = document.getElementById("menuContainer");
    container.innerHTML = "";

    menu.categories.forEach(cat => {

        let box = document.createElement("div");
        box.className = "category";

        let title = document.createElement("div");
        title.className = "category-title";
        title.textContent = cat;
        title.onclick = () => toggleCategory(cat);

        let itemsDiv = document.createElement("div");
        itemsDiv.className = "items";
        itemsDiv.style.display = openCategory === cat ? "block" : "none";

        let items = menu.items.filter(i => i.category === cat);

        items.forEach(item => {
            let d = document.createElement("div");
            d.className = "item";
            d.textContent = item.name + " - " + item.price + " ر.س";
            d.onclick = () => addToCart(item);
            itemsDiv.appendChild(d);
        });

        box.appendChild(title);
        box.appendChild(itemsDiv);
        container.appendChild(box);
    });
}

function toggleCategory(cat){
    openCategory = openCategory === cat ? null : cat;
    renderMenu();
}

// السلة
function addToCart(item){
    cart.push(item);
    renderCart();
}

function renderCart(){
    let c = document.getElementById("cartItems");
    c.innerHTML = "";

    let total = 0;

    cart.forEach(i=>{
        total += i.price;
        c.innerHTML += i.name + "<br>";
    });

    document.getElementById("total").textContent = total + " ر.س";
}

// واتساب
function sendToWhatsApp(){
    let phone = document.getElementById("custPhone").value.trim();

    if(!phone){
        alert("اكتب رقم الجوال");
        return;
    }

    if(phone.startsWith("0")) phone = "966" + phone.substring(1);

    let text = "🧾 طلب جديد\n\n";

    cart.forEach(i=>{
        text += i.name + "\n";
    });

    text += "\nالإجمالي: " + document.getElementById("total").textContent;
    text += "\n\nاطلب من هنا:\nhttps://deerty666.github.io/menu.html?branch=branch1";

    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text));
}

// مسح
function clearCart(){
    cart = [];
    renderCart();
}

// تشغيل
renderMenu();
