const DELIVERY_CHARGE=150, WHATSAPP="8801648664796"; // MAX AQUA WhatsApp
const products=[
{id:1,name:"Blue Moscow Guppy",cat:"Guppy",price:350,old:450,icon:"🐠",img:"photo/susmita.jpg"},
{id:2,name:"Galaxy Betta",cat:"Betta",price:600,old:750,icon:"🐡",img:"https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=700&q=80"},
{id:3,name:"Red Cherry Shrimp",cat:"Shrimp",price:150,old:200,icon:"🦐",img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80"},
{id:4,name:"Yellow Cherry Shrimp",cat:"Shrimp",price:150,old:180,icon:"🦐",img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80"},
{id:5,name:"Balloon Molly",cat:"Molly",price:250,old:300,icon:"🐟",img:"https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=700&q=80"},
{id:6,name:"Sunset Platy",cat:"Platy",price:200,old:250,icon:"🐠",img:"https://images.unsplash.com/photo-1520302519878-0c0b7f8d7f6a?auto=format&fit=crop&w=700&q=80"},
{id:7,name:"Red Dragon Guppy",cat:"Guppy",price:450,old:550,icon:"🐟",img:"https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=700&q=80"},
{id:8,name:"Koi Betta",cat:"Betta",price:650,old:800,icon:"🐡",img:"https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=700&q=80"},
{id:9,name:"Black Moscow Guppy",cat:"Guppy",price:400,old:500,icon:"🐠",img:"https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=700&q=80"},
{id:10,name:"Blue Dream Shrimp",cat:"Shrimp",price:120,old:150,icon:"🦐",img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80"}
];
let cart=JSON.parse(localStorage.getItem("maxAquaCart")||"[]");
let wish=JSON.parse(localStorage.getItem("maxAquaWishlist")||"[]");
const money=n=>"৳"+Number(n).toLocaleString("en-BD");
function save(){localStorage.setItem("maxAquaCart",JSON.stringify(cart))}
function saveWish(){localStorage.setItem("maxAquaWishlist",JSON.stringify(wish))}
function renderProducts(filter="all",q=""){
 const grid=document.getElementById("productGrid");
 const list=products.filter(p=>(filter==="all"||p.cat===filter)&&p.name.toLowerCase().includes(q.toLowerCase()));
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-img"><span class="badge">SALE</span><button class="wish ${wish.includes(p.id)?"active":""}" onclick="toggleWish(${p.id})">${wish.includes(p.id)?"♥":"♡"}</button><img src="${p.img}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" alt="${p.name}"><span class="fallback" style="display:none">${p.icon}</span></div><div class="product-body"><small>${p.cat.toUpperCase()}</small><h3>${p.name}</h3><div class="stars">★★★★★ <small>(12)</small></div><div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div><div class="actions"><button onclick="add(${p.id})">Add Cart</button><button class="order" onclick="buyNow(${p.id})">Order Now</button></div></div></article>`).join("")||'<div class="empty" style="grid-column:1/-1">কোনো পণ্য পাওয়া যায়নি।</div>';
}
function add(id,qty=1){const x=cart.find(i=>i.id===id);x?x.qty+=qty:cart.push({id,qty});save();renderCart();openCart()}
function change(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();renderCart()}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length)box.innerHTML='<div class="empty">🛒<br>Cart খালি</div>';
 else box.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-row"><div class="mini">${p.icon}</div><div><b>${p.name}</b><br><small>${money(p.price)} × ${i.qty}</small><div class="qty"><button onclick="change(${p.id},-1)">−</button> ${i.qty} <button onclick="change(${p.id},1)">+</button></div></div><b>${money(p.price*i.qty)}</b></div>`}).join("");
 const sub=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 document.getElementById("subtotal").textContent=money(sub);
 document.getElementById("grandTotal").textContent=money(sub+(cart.length?DELIVERY_CHARGE:0));
 document.getElementById("cartCount").textContent=cart.reduce((s,i)=>s+i.qty,0);
 document.getElementById("wishCount").textContent=wish.length;
}
function openCart(){document.getElementById("cartDrawer").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("show")}
function toggleWish(id){wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];saveWish();renderProducts(activeFilter,document.getElementById("search").value)}
let activeFilter="all";
function selectFilter(f){activeFilter=f;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===f));renderProducts(f,document.getElementById("search").value);document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function buyNow(id){cart=[];add(id);closeCart();setTimeout(openOrder,100)}
function openOrder(){
 if(!cart.length)return alert("আগে একটি পণ্য নির্বাচন করুন।");
 const sub=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 document.getElementById("orderSummary").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div>${p.name} × ${i.qty} — <b>${money(p.price*i.qty)}</b></div>`}).join("")+`<hr><b>Subtotal: ${money(sub)}</b><br>Delivery: ${money(DELIVERY_CHARGE)}<br><b>Total: ${money(sub+DELIVERY_CHARGE)}</b>`;
 document.getElementById("orderModal").classList.add("show")
}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>selectFilter(b.dataset.filter)));
document.getElementById("search").addEventListener("input",e=>renderProducts(activeFilter,e.target.value));
document.getElementById("searchBtn").onclick=()=>{document.getElementById("products").scrollIntoView({behavior:"smooth"})};
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("cartShade").onclick=closeCart;
document.getElementById("checkoutBtn").onclick=()=>{if(!cart.length)return alert("Cart খালি।");closeCart();openOrder()};
document.getElementById("closeOrder").onclick=()=>document.getElementById("orderModal").classList.remove("show");
document.getElementById("wishlistBtn").onclick=()=>alert(wish.length?`Wishlist-এ ${wish.length}টি পণ্য আছে।`:"Wishlist খালি।");
document.getElementById("orderForm").addEventListener("submit",e=>{
 e.preventDefault();
 const name=document.getElementById("customerName").value.trim(),phone=document.getElementById("customerPhone").value.trim(),address=document.getElementById("customerAddress").value.trim();
 if(!/^01[3-9]\d{8}$/.test(phone))return alert("সঠিক বাংলাদেশি মোবাইল নম্বর দিন।");
 const sub=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0), id="MX"+Date.now().toString().slice(-8);
 const items=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} × ${i.qty} = ${money(p.price*i.qty)}`}).join("\n");
 const order={id,date:new Date().toLocaleString("bn-BD"),name,phone,address,items:cart.map(i=>({id:i.id,qty:i.qty})),subtotal:sub,delivery:DELIVERY_CHARGE,total:sub+DELIVERY_CHARGE};
 const orders=JSON.parse(localStorage.getItem("maxAquaOrders")||"[]");orders.unshift(order);localStorage.setItem("maxAquaOrders",JSON.stringify(orders));
 const msg=`MAX AQUA — NEW ORDER\nOrder ID: ${id}\n\n${items}\n\nProduct Total: ${money(sub)}\nDelivery: ${money(DELIVERY_CHARGE)}\nTotal: ${money(sub+DELIVERY_CHARGE)}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}`;
 window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank");
 cart=[];save();renderCart();document.getElementById("orderModal").classList.remove("show");e.target.reset();alert(`Order saved successfully!\nOrder ID: ${id}`);
});
renderProducts();renderCart();