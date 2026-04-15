let menu = {
    categories: ["وجبات", "مشروبات"],
    items: [
        {id:1, name:"برجر", price:15, category:"وجبات"},
        {id:2, name:"بيتزا", price:25, category:"وجبات"},
        {id:3, name:"عصير", price:8, category:"مشروبات"}
    ]
};

let cart = [];
let openCategory = null;

/* القائمة */
function renderMenu(){
    let container = document.getElementById('menuContainer');
    container.innerHTML = '';

    menu.categories.forEach(cat => {

        let box = document.createElement('div');
        box.innerHTML = `<h3 onclick="toggleCategory('${cat}')">${cat}</h3>`;

        let items = document.createElement('div');
        items.style.display = openCategory===cat?'block':'none';

        menu.items.filter(i=>i.category===cat).forEach(item=>{
            let d = document.createElement('div');
            d.innerHTML = `${item.name} - ${item.price}`;
            d.onclick = ()=>addToCart(item);
            items.appendChild(d);
        });

        box.appendChild(items);
        container.appendChild(box);
    });
}

function toggleCategory(cat){
    openCategory = openCategory===cat?null:cat;
    renderMenu();
}

/* السلة */
function addToCart(item){
    cart.push(item);
    renderCart();
}

function renderCart(){
    let c=document.getElementById('cart');
    c.innerHTML='';

    let total=0;

    cart.forEach(i=>{
        total+=i.price;
        c.innerHTML+=`${i.name} <br>`;
    });

    document.getElementById('grandTotal').textContent=total+" ر.س";
}

/* واتساب */
function sendToWhatsApp(){
    let phone=document.getElementById('custPhone').value;

    let text="طلب:\n";
    cart.forEach(i=>text+=i.name+"\n");

    text+=`\nالإجمالي: ${document.getElementById('grandTotal').textContent}`;
    text+=`\nhttps://deerty666.github.io/menu.html?branch=branch1`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`);
}

document.addEventListener('DOMContentLoaded', renderMenu);
