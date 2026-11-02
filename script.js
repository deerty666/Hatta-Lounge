// تحديد رقم الكاشير لكل جهاز
let CASHIER_ID = localStorage.getItem("deerty_cashier_id");

if (!CASHIER_ID) {
  CASHIER_ID = prompt("أدخل رقم الكاشير لهذا الجهاز (1 أو 2 أو 3):");

  if (["1", "2", "3"].includes(CASHIER_ID)) {
    localStorage.setItem("deerty_cashier_id", CASHIER_ID);
  } else {
    CASHIER_ID = "1";
    localStorage.setItem("deerty_cashier_id", CASHIER_ID);
  }
}
let defaultMenu = {
  categories: [
    "شوايه",
    "مظبي",
    "مندي",
    "مضغوط مقلوبه",
    "لحم مندي",
    "حاشي+برمه",
    "مشويات",
    "رز وجريش",
    "ببسي",
    "مقبلات",
    "كنافة",
    "ايدامات",
    "تأمين",
    "قسم 14 - المشروبات",
    "قسم 15 - الحلويات"
  ],

  items: [
    // القسم الأول
    { id: 1, name: "حبة شواية شعبي", price: 48, category: "شوايه" },
    { id: 2, name: "نص شواية شعبي", price: 24, category: "شوايه" }, 
     { id: 3, name: "حبة شواية بشاور", price: 50, category: "شوايه" },
     { id: 4, name: "نص شواية بشاور", price: 25, category: "شوايه" },
     { id: 5, name: "حبة شوايةرزمندي", price: 50, category: "شوايه" },
     { id: 6, name: "نص شواية رزمندي", price: 25, category: "شوايه" },
     { id: 7, name: "حبة شواية مثلوثه", price: 50, category: "شوايه" },
     { id: 8, name: "نص شواية مثلوثه", price: 25, category: "شوايه" },
     { id: 9, name: "نص شواية ساده", price: 17, category: "شوايه" },
    { id: 10, name: "ربع شوايه", price: 15, category: "شوايه" },

    // القسم الثاني
    { id: 11, name: "حبة مظبي شعبي", price: 48, category: "مظبي" },
    { id: 12, name: "نص مظبي شعبي", price: 24, category: "مظبي" },
     { id: 13, name: "حبة مظبي يشاور", price: 50, category: "مظبي" },
     { id: 14, name: "نص مظبي بشاور", price: 25, category: "مظبي" },
     { id: 15, name: "حبة مظبي رزمندي", price: 50, category: "مظبي" },
     { id: 16, name: "نص مظبي رز مندي", price: 25, category: "مظبي" },
     { id: 17, name: "حبة مظبي مثلوثه", price: 50, category: "مظبي" },
     { id: 18, name: "نص مظبي مثلوثه", price: 25, category: "مظبي" },
    { id: 19, name: "نص مظبي ساده", price: 17, category: "مظبي" },

    // القسم الثالث
    { id: 20, name: "حبة مندي شعبي", price: 48, category: "مندي" },
    { id: 21, name: "نص مندي شعبي", price: 24, category: "مندي" },
    { id: 22, name: "حبة مندي بشاور", price: 50, category: "مندي" },
    { id: 23, name: "نص مندي بشاور", price: 25, category: "مندي" },
    { id: 24, name: "حبة مندي رز مندي", price: 50, category: "مندي" },
    { id: 25, name: "نص مندي رزمندي", price: 25, category: "مندي" },
    { id: 26, name: "حبة مندي مثلوثه", price: 50, category: "مندي" },
    { id: 27, name: "نص مندي مثلوثه", price: 25, category: "مندي" },
    { id: 28, name: "نص مندي سادة", price: 25, category: "مندي" },
    { id: 29, name: "ربع دجاج مندي", price: 15, category: "مندي" },

    // القسم الرابع
    { id: 30, name: "حبة مضغوط", price: 50, category: "مضغوط مقلوبه" },
    { id: 31, name: "نص مضغوط", price: 25, category: "مضغوط مقلوبه" },
    { id: 32, name: "حبة زربيان", price: 50, category: "مضغوط مقلوبه" },
    { id: 33, name: "نص زربيان", price: 25, category: "مضغوط مقلوبه" },
    { id: 34, name: "حبة مقلويه", price: 50, category: "مضغوط مقلوبه" },
    { id: 35, name: "نص مقلوبه", price: 25, category: "مضغوط مقلوبه" },
    { id: 36, name: "حبة مدفون شعبي", price: 48, category: "مضغوط مقلوبه" },
    { id: 37, name: "نص مدفون شعبي", price: 24, category: "مضغوط مقلوبه" },
    { id: 38, name: "حبة مدفون بشاور", price: 50, category: "مضغوط مقلوبه" },
    { id: 39, name: "نص مدفون بشاور", price: 25, category: "مضغوط مقلوبه" },

    // القسم الخامس
    { id: 40, name: "تيس مندي كامل رز شعبي", price: 1500, category: "لحم مندي" },
    { id: 41, name: "تيس مندي كامل رز بشاور", price: 1550, category: "لحم مندي" },
    { id: 42, name: "تيس مندي كامل رز مندي", price: 1550, category: "لحم مندي" },
    { id: 43, name: "نص تيس مندي رز شعبي", price: 750, category: "لحم مندي" },
    { id: 44, name: "نص تيس رز بشاور", price: 775, category: "لحم مندي" },
    { id: 45, name: "نص تيس رز مندي", price: 775, category: "لحم مندي" },
    { id: 46, name: "ربع تيس مندي رز شعبي", price: 375, category: "لحم مندي" },
    { id: 47, name: "ربع تيس رز بشاور", price: 388, category: "لحم مندي" },
    { id: 48, name: "ربع تيس رز مندي", price: 388, category: "لحم مندي" },
    { id: 49, name: "نفر لحم مندي رز شعبي", price: 100, category: "لحم مندي" },
    { id: 50, name: "نفر لحم مندي رز بشاور", price: 100, category: "لحم مندي" },
    { id: 51, name: "نفر لحم رز مندي", price: 100, category: "لحم مندي" },

    // القسم السادس
    { id: 55, name: "نفر حاشي رز شعبي", price: 50, category: "حاشي+برمه" },
    { id: 56, name: "نفر حاشي رز بشاور", price: 53, category: "حاشي+برمه" },
    { id: 57, name: "نفر حاشي رز مندي", price: 53, category: "حاشي+برمه" },
    { id: 58, name: "نفر برمة رز بشاور", price: 68, category: "حاشي+برمه" },
    { id: 59, name: "نفر برمة رز شعبي", price: 68, category: "حاشي+برمه" },
    { id: 60, name: " نفر برمة رز مندي", price: 68, category: "حاشي+برمه" },

    // القسم السابع
    { id: 61, name: "كيلو مشكل مشاوي", price: 130, category: "مشويات" },
    { id: 62, name: "نص كيلو مشكل مشاوي", price: 70, category: "مشويات" },
    { id: 63, name: "نفر مشكل مشاوي", price: 35, category: "مشويات" },
    { id: 64, name: "كيلو مشكل لحم", price: 152, category: "مشويات" },
    { id: 65, name: "نص مشكل لحم", price: 76, category: "مشويات" },
    { id: 66, name: "نفر مشكل لحم", price: 38, category: "مشويات" },
    { id: 67, name: "كيلو مشكل دجاج", price: 120, category: "مشويات" },
    { id: 68, name: "نص كيلو مشكل دجاج", price: 60, category: "مشويات" },
    { id: 69, name: "نفر مشكل دجاج", price: 30, category: "مشويات" },
    { id: 70, name: "كيلو كباب لحم", price: 150, category: "مشويات" },
    { id: 71, name: "نص كيلو كباب لحم", price: 76, category: "مشويات" },
    { id: 72, name: "نفر كباب لحم", price: 38, category: "مشويات" },
    { id: 73, name: "كيلو كباب دجاج", price: 120, category: "مشويات" },
    { id: 74, name: "نص كيلو كباب دجاج", price: 60, category: "مشويات" },
    { id: 75, name: "نفر كباب دجاج", price: 30, category: "مشويات" },
    { id: 76, name: "كيلو اوصل لحم", price: 180, category: "مشويات" },
    { id: 77, name: "نص كيلو اوصل لحم", price: 90, category: "مشويات" },
    { id: 78, name: "نفر اوصل لحم", price: 45, category: "مشويات" },
    { id: 79, name: "كيلو شيش طاوق", price: 120, category: "مشويات" },
    { id: 80, name: "نص كيلو شيش طاوق", price: 60, category: "مشويات" },
    { id: 81, name: "نفر شيش طاوق", price: 30, category: "مشويات" },

    // القسم الثامن
    { id: 82, name: "جريش كبير", price: 10, category: "رز وجريش" },
    { id: 83, name: "جريش صغير", price: 5, category: "رز وجريش" },
    { id: 84, name: "حريش مع قرصان كبير", price: 10, category: "رز وجريش" },
    { id: 85, name: "جريش مع قرصان صغير", price: 5, category: "رز وجريش" },
    { id: 86, name: "قرصان كبير", price: 10, category: "رز وجريش" },
    { id: 87, name: "قرصان صغير", price: 5, category: "رز وجريش" },
    { id: 88, name: "نفر رز شعبي", price: 9, category: "رز وجريش" },
    { id: 89, name: "نفر رز بشاور", price: 10, category: "رز وجريش" },
    { id: 90, name: "نفر رز مندي", price: 10, category: "رز وجريش" },
    { id: 91, name: "نفر رز مثلوثه", price: 11, category: "رز وجريش" },

    // القسم التاسع
    { id: 92, name: "ببسي صغير", price: 50, category: "ببسي" },
    { id: 93, name: "حمضيات صغير", price: 75, category: "ببسي" },
    { id: 94, name: "سفن صغير", price: 100, category: "ببسي" },
    { id: 95, name: "ببسي وسط", price: 50, category: "ببسي" },
    { id: 96, name: "حمضيات وسط", price: 75, category: "ببسي" },
    { id: 97, name: "سفن وسط", price: 100, category: "ببسي" },
    { id: 98, name: "ببسي كبير", price: 50, category: "ببسي" },
    { id: 99, name: "حمضيات كبير", price: 75, category: "ببسي" },
    { id: 100, name: "سفن كبير", price: 100, category: "ببسي" },
    { id: 101, name: "لبن مراعي صغير", price: 50, category: "ببسي" },
    { id: 102, name: "لبن مراعي وسط", price: 75, category: "ببسي" },
    { id: 103, name: "لبن مراعي كبير", price: 100, category: "ببسي" },
    { id: 104, name: "لبن القريه", price: 50, category: "ببسي" },
    { id: 105, name: "زبادي", price: 100, category: "ببسي" },

    // القسم العاشر
    { id: 106, name: "مشكل مقبلات", price: 10, category: "مقبلات" },
    { id: 107, name: "سلطه خضرا", price: 5, category: "مقبلات" },
    { id: 108, name: "خيار لبن", price: 7, category: "مقبلات" },
    { id: 109, name: "تبوله", price: 7, category: "مقبلات" },
    { id: 110, name: "حمص", price: 7, category: "مقبلات" },
    { id: 111, name: "ورق عنب", price: 7, category: "مقبلات" },
    { id: 112, name: "طحينه ", price: 3, category: "مقبلات" },
    { id: 113, name: "سلطة حار", price: 3, category: "مقبلات" },
    { id: 114, name: "متبل", price: 3, category: "مقبلات" },

    // القسم الحادي عشر
    { id: 115, name: "كنافه قشطه", price: 10, category: "كنافة" },
    { id: 116, name: "كنافه نوتيلا ", price: 12, category: "كنافة" },
    { id: 117, name: "كنافة جلاكس", price: 12, category: "كنافة" },
    { id: 118, name: " حلا دراق ٥", price: 5, category: "كنافة" },
    { id: 119, name: "حلا دراق٦", price: 6, category: "كنافة" },

    // القسم الثاني عشر
    { id: 120, name: "مشكل خضار", price: 10, category: "ايدامات" },
    { id: 121, name: "مشكل فرن", price: 10, category: "ايدامات" },
    { id: 122, name: "مسقع ", price: 12, category: "ايدامات" },
    { id: 123, name: "بامية", price: 10, category: "ايدامات" },
    { id: 124, name: "ملوخية", price: 10, category: "ايدامات" },
    { id: 125, name: "شوربة ", price: 8, category: "ايدامات" },

    // القسم الثالث عشر
    { id: 126, name: "صحن تأمين ", price: 20, category: "تأمين" },
    { id: 127, name: "صحن تامين", price: 30, category: "تأمين" },
    { id: 128, name: "صحن تأمين ", price: 50, category: "تأمين" },

   
    // القسم الخامس عشر
    { id: 83, name: "صنف 1", price: 5, category: "قسم 15 - الحلويات" },
    { id: 84, name: "صنف 2", price: 10, category: "قسم 15 - الحلويات" },
    { id: 85, name: "صنف 3", price: 15, category: "قسم 15 - الحلويات" }
  ]
};

let saved = null;

try {
  saved = JSON.parse(localStorage.getItem("menu"));
} catch (e) {
  localStorage.removeItem("menu");
}

let menu = (
  saved &&
  Array.isArray(saved.categories) &&
  Array.isArray(saved.items) &&
  saved.items.length > 0
) ? saved : defaultMenu;

let cart = [], openCategory = null, orderType = "takeaway";

function saveMenu() { localStorage.setItem("menu", JSON.stringify(menu)); }

/* 📂 القائمة الذكية المحدثة */
function renderMenu() {
  let c = document.getElementById("menuContainer");
  c.innerHTML = "";

  // 1️⃣ إذا لم يتم اختيار قسم: اعرض الأقسام الرئيسية فقط بأزرار كبيرة
  if (!openCategory) {
    menu.categories.forEach(cat => {
      let box = document.createElement("div");
      box.className = "category-title"; // تأكد من وجود التنسيق الزرقاء الكبير في الـ CSS
      box.textContent = cat;
      box.style.cursor = "pointer";
      box.onclick = () => toggleCategory(cat);
      c.appendChild(box);
    });
  } 
  // 2️⃣ إذا اختار الكاشير قسماً: اخفِ الأقسام واعرض أصناف هذا القسم مع زر الرجوع
  else {
    // زر الرجوع للقائمة الرئيسية
    let backBtn = document.createElement("div");
    backBtn.className = "category-title";
    backBtn.style.background = "#d9534f"; // لون أحمر أو مميز للرجوع
    backBtn.textContent = "🔙 رجوع للأقسام الرئيسية";
    backBtn.style.cursor = "pointer";
    backBtn.onclick = () => toggleCategory(null);
    c.appendChild(backBtn);

    // عرض الأصناف التابعة للقسم المفتوح
    menu.items.filter(i => i.category === openCategory).forEach(item => {
      let d = document.createElement("div");
      d.className = "item";
      d.textContent = item.name + " - " + item.price + " ر.س";
      d.style.cursor = "pointer";
      d.onclick = () => addToCart(item);
      c.appendChild(d);
    });
  }
}

function toggleCategory(cat) {
  openCategory = cat;
  renderMenu();
}

/* 🛒 السلة */
function addToCart(item) {
  cart.push({ ...item, qty: 1, note: "" });
  renderCart();
}

function renderCart() {
  let c = document.getElementById("cartItems");
  c.innerHTML = "";

  cart.forEach((i, index) => {
    let total = i.price * i.qty;

    c.innerHTML += `
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

    <input placeholder="ملاحظة" value="${i.note || ''}"
    onchange="cart[${index}].note=this.value" style="width:100%;margin-bottom:5px">

    <hr>
    `;
  });

  updateTotal();
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  renderCart();
}

function getTotalNumber() {
  let total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (orderType === "delivery") {
    total += parseFloat(document.getElementById("deliveryFee").value) || 0;
  }
  return total;
}

function updateTotal() {
  document.getElementById("total").textContent = getTotalNumber() + " ر.س";
}

function setOrderType(t) {
  orderType = t;
  document.getElementById("deliveryBox").style.display = t === "delivery" ? "block" : "none";
  updateTotal();
}

/* 🗑️ جديد */
function clearCart() {
  cart = [];

  document.getElementById("custName").value = "";
  document.getElementById("custPhone").value = "";
  document.getElementById("custAddress").value = "";
  document.getElementById("custTime").value = "";

  let pay = document.getElementById("paymentStatus");
  if (pay) pay.value = "غير مدفوع";

  orderType = "takeaway";

  let box = document.getElementById("deliveryBox");
  if (box) box.style.display = "none";

  let fee = document.getElementById("deliveryFee");
  if (fee) fee.value = 5;

  renderCart();
  updateTotal();
}

/* 💾 حفظ فواتير اليوم */
function getTodayKey() {
  let d = new Date();
  return "invoices_" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function saveInvoice() {
  if (cart.length === 0) {
    alert("السلة فاضية");
    return;
  }

  let invoices = JSON.parse(localStorage.getItem(getTodayKey())) || [];

  let invoice = {
    id: Date.now(),
    invoiceNo: invoices.length + 1,
    cashierId: localStorage.getItem("deerty_cashier_id") || "1",
    date: new Date().toLocaleString('ar-SA'),
    name: document.getElementById("custName").value || "-",
    phone: document.getElementById("custPhone").value || "-",
    address: document.getElementById("custAddress").value || "-",
    payment: document.getElementById("paymentStatus") ? document.getElementById("paymentStatus").value : "غير مدفوع",
    orderType: orderType,
    deliveryFee: orderType === "delivery" ? parseFloat(document.getElementById("deliveryFee").value) || 0 : 0,
    items: JSON.parse(JSON.stringify(cart)),
    total: getTotalNumber()
  };

  invoices.push(invoice);
  localStorage.setItem(getTodayKey(), JSON.stringify(invoices));

  alert("تم حفظ الفاتورة ✅");
  showTodayInvoices(true);
}

function showTodayInvoices(forceOpen = false) {
  let box = document.getElementById("todayInvoices");
  if (!box) return;

  let invoices = JSON.parse(localStorage.getItem(getTodayKey())) || [];

  if (forceOpen) {
    box.style.display = "block";
  } else {
    box.style.display = box.style.display === "none" ? "block" : "none";
  }

  if (box.style.display === "none") return;

  if (invoices.length === 0) {
    box.innerHTML = "<h3>لا توجد فواتير محفوظة اليوم</h3>";
    return;
  }

  let html = "<h3>فواتير اليوم</h3>";

  invoices.forEach((inv, index) => {
    html += `
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

  let totalDay = invoices.reduce((s, i) => s + Number(i.total), 0);
  html += `<h2>إجمالي اليوم: ${totalDay.toFixed(2)} ر.س</h2>`;

  box.innerHTML = html;
}

function loadInvoice(index) {
  let invoices = JSON.parse(localStorage.getItem(getTodayKey())) || [];
  let inv = invoices[index];
  if (!inv) return;

  cart = JSON.parse(JSON.stringify(inv.items));
  orderType = inv.orderType || "takeaway";

  document.getElementById("custName").value = inv.name || "";
  document.getElementById("custPhone").value = inv.phone || "";
  document.getElementById("custAddress").value = inv.address || "";

  if (document.getElementById("paymentStatus")) {
    document.getElementById("paymentStatus").value = inv.payment || "غير مدفوع";
  }

  document.getElementById("deliveryBox").style.display = orderType === "delivery" ? "block" : "none";
  document.getElementById("deliveryFee").value = inv.deliveryFee || 5;

  renderCart();
  alert("تم استرجاع الفاتورة ✅");
}

function deleteInvoice(index) {
  if (!confirm("حذف هذه الفاتورة؟")) return;

  let invoices = JSON.parse(localStorage.getItem(getTodayKey())) || [];
  invoices.splice(index, 1);
  localStorage.setItem(getTodayKey(), JSON.stringify(invoices));

  showTodayInvoices(true);
}

function clearTodayInvoices() {
  if (confirm("هل تريد مسح فواتير اليوم؟")) {
    localStorage.removeItem(getTodayKey());
    let box = document.getElementById("todayInvoices");
    if (box) box.innerHTML = "";
    alert("تم مسح فواتير اليوم ✅");
  }
}

/* 📲 واتساب */
function sendToWhatsApp() {
  if (cart.length === 0) {
    alert("السلة فاضية");
    return;
  }

  let inputPhone = document.getElementById("custPhone").value.trim();
  let phone = inputPhone.replace(/\D/g, '');

  if (phone === "") {
    alert("اكتب رقم الواتساب");
    return;
  }

  if (phone.startsWith("05")) phone = "966" + phone.substring(1);
  else if (phone.startsWith("5")) phone = "966" + phone;
  else if (!phone.startsWith("966")) phone = "966" + phone;

  let name = document.getElementById("custName").value.trim() || "لم يحدد";
  let address = document.getElementById("custAddress").value.trim() || "لم يحدد";
  let driverPhone = document.getElementById("driverPhone").value.trim();
  let time = document.getElementById("custTime").value;
  let timeText = time ? new Date(time).toLocaleString('ar-SA') : "-";
  let paymentStatus = document.getElementById("paymentStatus") ? document.getElementById("paymentStatus").value : "غير مدفوع";

  let type = orderType === "delivery" ? "🚗 توصيل" : "🏠 استلام";

  let text = `🧾 *مطعم ديرتي - تفاصيل الطلب*\n\n`;
  text += `👤 *العميل:* ${name}\n`;
  text += `📦 *نوع الطلب:* ${type}\n`;
  text += `💳 *حالة الدفع:* ${paymentStatus}\n`;
  text += `📍 *العنوان:* ${address}\n`;
  if (orderType === "delivery" && driverPhone) {
  text += `📞 *رقم المندوب:* ${driverPhone}\n`;
}
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

  if (orderType === "delivery") {
    let fee = parseFloat(document.getElementById("deliveryFee").value) || 0;
    text += `🚚 *رسوم التوصيل:* ${fee} ر.س\n\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *الإجمالي النهائي: ${document.getElementById("total").textContent}*\n\n`;
  text += `💙 شكراً لتعاملكم معنا\n`;
  text += `نتمنى لكم وجبة شهية 😋 🌟\n\n`;
  text += `📱 *خل ديرتي دايم معك*\n`;
text += `📲 حمّل التطبيق الآن للأندرويد 👇\n`;
text += `https://play.google.com/store/apps/details?id=com.deerty.app&pcampaignid=web_share\n\n`;

text += `🍎 *عندك آيفون؟ أو تبي تطلب بدون تحميل التطبيق؟*\n`;
text += `🌐 اطلب مباشرة من الموقع 👇\n`;
text += `https://deerty666.github.io/`;
  let url = "https://api.whatsapp.com/send?phone=" + phone + "&text=" + encodeURIComponent(text);
  window.open(url, '_blank');
}

/* 🖨️ الطباعة الحرارية 80mm */
function printReceipt() {
  if (cart.length === 0) {
    alert("السلة فاضية");
    return;
  }

  let cName = document.getElementById("custName").value || "-";
  let cPhone = document.getElementById("custPhone").value || "-";
  let cAddress = document.getElementById("custAddress").value || "-";
  let cTime = document.getElementById("custTime").value;
  let paymentStatus = document.getElementById("paymentStatus") ? document.getElementById("paymentStatus").value : "غير مدفوع";

  let timeText = cTime ? new Date(cTime).toLocaleString('ar-SA') : new Date().toLocaleString('ar-SA');
  let totalNumber = getTotalNumber();
  let invoiceNo = Math.floor(100000 + Math.random() * 900000);

  let content = `
  <html>
  <head>
  <meta charset="UTF-8">
  <style>
  @page{size:80mm auto;margin:0}
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;width:80mm;direction:rtl;background:#fff;font-family:Tahoma,Arial,sans-serif;color:#111;}
  .receipt{width:68mm;margin:0 auto;padding:1.5mm;}
  .center{text-align:center}
  .logo{width:190px;max-height:100px;object-fit:contain;}
  .title{font-size:17px;font-weight:900;margin:0;}
  .sub{font-size:9px;margin:0;}
  .phone{font-size:11px;font-weight:bold;margin:1px 0 3px;}
  .black-box{background:#111;color:#fff;text-align:center;font-size:13px;font-weight:900;padding:3px;border-radius:3px;margin-bottom:4px;}
  .info-box{border:1px solid #111;border-radius:4px;padding:2px 5px;margin-bottom:4px;}
  .info-row{display:flex;justify-content:space-between;gap:5px;padding:1px 0;border-bottom:1px dashed #aaa;font-size:10px;font-weight:bold;}
  .info-row:last-child{border-bottom:none}
  table{width:100%;border-collapse:collapse;}
  th{background:#111;color:#fff;padding:4px 2px;font-size:13px;}
  td{padding:4px 2px;border-bottom:1px dashed #bbb;text-align:center;font-size:13px;}
  .name{text-align:right;max-width:65px;word-break:break-word;}
  .note{font-size:9px;color:#333;}
  .total-box{margin-top:4px;border:1px solid #111;border-radius:4px;overflow:hidden;}
  .total-head{background:#111;color:#fff;text-align:center;padding:3px;font-size:12px;font-weight:900;}
  .total-price{text-align:center;font-size:20px;font-weight:900;padding:4px 0;}
  .thanks{text-align:center;margin-top:3px;line-height:1.3;font-size:10px;font-weight:bold;}
  .qr{width:60px;margin-top:3px;}
  .footer{text-align:center;font-size:10px;font-weight:900;}
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
  <div class="info-row">
  <span>رقم الكاشير</span>
  <span>${CASHIER_ID}</span>
</div>
  <div class="info-row"><span>اسم العميل</span><span>${cName}</span></div>
  <div class="info-row"><span>الجوال</span><span>${cPhone}</span></div>
  <div class="info-row"><span>العنوان</span><span>${cAddress}</span></div>
  <div class="info-row"><span>الوقت</span><span>${timeText}</span></div>
  <div class="info-row"><span>حالة الدفع</span><span>${paymentStatus}</span></div>
  </div>
  <table>
  <thead>
  <tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
  </thead>
  <tbody>
  `;

  cart.forEach(i => {
    content += `
    <tr>
    <td class="name">${i.name}</td>
    <td>${i.qty}</td>
    <td>${Number(i.price).toFixed(2)}</td>
    <td>${Number(i.price * i.qty).toFixed(2)}</td>
    </tr>
    `;

    if (i.note && i.note.trim() !== "") {
      content += `
      <tr><td colspan="4" style="text-align:right"><div class="note">✦ ${i.note}</div></td></tr>
      `;
    }
  });

  if (orderType === "delivery") {
    let fee = parseFloat(document.getElementById("deliveryFee").value) || 0;
    content += `
    <tr><td class="name">رسوم التوصيل</td><td>1</td><td>${fee.toFixed(2)}</td><td>${fee.toFixed(2)}</td></tr>
    `;
  }

  content += `
  </tbody>
  </table>
  <div class="total-box">
  <div class="total-head">الإجمالي النهائي</div>
  <div class="total-price">${totalNumber.toFixed(2)} ر.س</div>
  </div>
  <div class="thanks">شكراً لكم 🌹<br>نتمنى لكم وجبة شهية 😋</div>
  <div class="center"><img src="qr.png" class="qr"><div class="footer">اطلب من جوالك 📲</div></div>
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

  let w = window.open('', '', 'width=420,height=620');
  w.document.open();
  w.document.write(content);
  w.document.close();
}

function openAdmin() {
  document.getElementById("admin").style.display = "block";
  renderAdmin();
}

function closeAdmin() {
  document.getElementById("admin").style.display = "none";
}

/* 🛠️ الإدارة المحدثة لتحديث الشاشة تلقائياً */
function renderAdmin() {
  let list = document.getElementById("adminList");
  let select = document.getElementById("catSelect");

  list.innerHTML = "";
  select.innerHTML = "";

  list.innerHTML += `<h3>الأقسام</h3>`;
  list.innerHTML += `<div class="admin-grid">`;

  menu.categories.forEach(cat => {
    let opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);

    list.innerHTML += `
    <div class="admin-card">
    <input value="${cat}" onchange="editCategory('${cat}', this.value)">
    <button onclick="deleteCategory('${cat}')">❌ حذف</button>
    </div>
    `;
  });

  list.innerHTML += `</div>`;
  list.innerHTML += `<hr><h3>الأصناف</h3>`;
  list.innerHTML += `<div class="admin-item-grid">`;

  menu.items.forEach(item => {
    list.innerHTML += `
    <div class="admin-card">
    <label>اسم الصنف</label>
    <input value="${item.name}" onchange="editItemName(${item.id}, this.value)">
    <label>السعر</label>
    <input type="number" value="${item.price}" onchange="editItemPrice(${item.id}, this.value)">
    <button onclick="deleteItem(${item.id})">❌ حذف</button>
    </div>
    `;
  });

  list.innerHTML += `</div>`;
}

function editCategory(oldName, newName) {
  newName = newName.trim();
  if (!newName) return;

  menu.categories = menu.categories.map(c => c === oldName ? newName : c);
  menu.items.forEach(item => {
    if (item.category === oldName) item.category = newName;
  });

  saveMenu();
  renderMenu();
  renderAdmin();
}

function editItemName(id, newName) {
  newName = newName.trim();
  if (!newName) return;

  let item = menu.items.find(i => i.id === id);
  if (item) {
    item.name = newName;
    saveMenu();
    renderMenu();
    renderAdmin();
  }
}

function editItemPrice(id, newPrice) {
  newPrice = parseFloat(newPrice);
  if (!newPrice) return;

  let item = menu.items.find(i => i.id === id);
  if (item) {
    item.price = newPrice;
    saveMenu();
    renderMenu();
    renderAdmin();
  }
}

function addCategory() {
  let name = document.getElementById("newCat").value.trim();
  if (!name) return;

  menu.categories.push(name);
  document.getElementById("newCat").value = "";

  saveMenu();
  renderMenu();
  renderAdmin();
}

function deleteCategory(cat) {
  menu.categories = menu.categories.filter(c => c !== cat);
  menu.items = menu.items.filter(i => i.category !== cat);

  saveMenu();
  if (openCategory === cat) openCategory = null; // العودة للرئيسية إذا حُذف القسم المفتوح
  renderMenu();
  renderAdmin();
}

function addItem() {
  let name = document.getElementById("newItemName").value.trim();
  let price = parseFloat(document.getElementById("newItemPrice").value);
  let cat = document.getElementById("catSelect").value;

  if (!name || !price) return;

  menu.items.push({
    id: Date.now(),
    name,
    price,
    category: cat
  });

  document.getElementById("newItemName").value = "";
  document.getElementById("newItemPrice").value = "";

  saveMenu();
  renderMenu();
  renderAdmin();
}

function deleteItem(id) {
  menu.items = menu.items.filter(i => i.id !== id);

  saveMenu();
  renderMenu();
  renderAdmin();
}

// تشغيل النظام عند التحميل لأول مرة
renderMenu();
renderCart();
