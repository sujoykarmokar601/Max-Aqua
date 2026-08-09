$(function(){
  let cart=JSON.parse(localStorage.getItem("maxAquaCart")||"[]");

  function save(){localStorage.setItem("maxAquaCart",JSON.stringify(cart));}
  function renderCart(){
    let total=0,count=0,$box=$("#cartItems");
    $box.empty();
    if(!cart.length){$box.html('<div class="empty-cart">Your cart is empty.</div>')}
    cart.forEach((x,i)=>{
      total+=x.price*x.qty; count+=x.qty;
      $box.append(`<div class="d-flex justify-content-between align-items-center border-bottom py-3">
        <div><b>${x.name}</b><br><small>৳${x.price} × ${x.qty}</small></div>
        <button class="btn btn-sm text-danger remove" data-i="${i}"><i class="bi bi-trash"></i></button>
      </div>`);
    });
    $("#cartCount").text(count); $("#cartTotal").text(total.toLocaleString());
  }

  $(document).on("click",".add-cart",function(){
    const name=$(this).data("name"),price=Number($(this).data("price"));
    const found=cart.find(x=>x.name===name);
    found?found.qty++:cart.push({name,price,qty:1});
    save();renderCart();
    $("#toast .toast-body").text(name+" added to cart.");
    bootstrap.Toast.getOrCreateInstance(document.getElementById("toast")).show();
  });

  $(document).on("click",".remove",function(){
    cart.splice(Number($(this).data("i")),1);save();renderCart();
  });

  function filterProducts(category,search=""){
    $(".product").each(function(){
      const matchCat=category==="all"||$(this).data("category")===category;
      const matchSearch=$(this).data("name").toLowerCase().includes(search.toLowerCase());
      $(this).toggle(matchCat&&matchSearch);
    });
  }

  $(".filter").click(function(){
    $(".filter").removeClass("active");$(this).addClass("active");
    filterProducts($(this).data("filter"),$("#navSearch").val());
  });

  $(".category-card").click(function(){
    const cat=$(this).data("filter");
    $(".filter").removeClass("active").filter(`[data-filter="${cat}"]`).addClass("active");
    filterProducts(cat,$("#navSearch").val());
    document.querySelector("#shop").scrollIntoView({behavior:"smooth"});
  });

  $("#navSearch").on("input",function(){
    const active=$(".filter.active").data("filter")||"all";
    filterProducts(active,$(this).val());
    if($(this).val()) document.querySelector("#shop").scrollIntoView({behavior:"smooth"});
  });

  $(document).on("click",".quick-view",function(){
    $("#modalName").text($(this).data("name"));$("#modalPrice").text($(this).data("price"));
    bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal")).show();
  });

  $("#themeBtn").click(function(){
    $("body").toggleClass("dark");
    $(this).find("i").toggleClass("bi-moon-fill bi-sun-fill");
  });

  $("#contactForm").submit(function(e){
    e.preventDefault();
    alert("Thanks! MAX AQUA will contact you soon.");
    this.reset();
  });

  renderCart();
});

/* =========================
   MAX AQUA ORDER NOW SYSTEM
   Change this number to your WhatsApp business number.
   Format: country code + number, without + or spaces.
   Example Bangladesh: 8801XXXXXXXXX
   ========================= */
const MAX_AQUA_WHATSAPP = "8801648664796";
let selectedOrder = {name:"", price:0};
let lastOrderMessage = "";

function updateOrderTotal(){
  const qty = Math.max(1, Number($("#orderQty").val()) || 1);
  $("#orderQty").val(qty);
  $("#summaryQty").text(qty);
  $("#orderTotal").text((selectedOrder.price * qty).toLocaleString());
}

$(document).on("click",".order-now",function(){
  selectedOrder.name = $(this).data("name");
  selectedOrder.price = Number($(this).data("price"));

  $("#orderProductName").text(selectedOrder.name);
  $("#summaryProduct").text(selectedOrder.name);
  $("#orderProductPrice").text(selectedOrder.price.toLocaleString());
  $("#orderQty").val(1);
  updateOrderTotal();

  bootstrap.Modal.getOrCreateInstance(document.getElementById("orderModal")).show();
});

$(document).on("input","#orderQty",updateOrderTotal);

$("#orderForm").on("submit",function(e){
  e.preventDefault();

  const name = $("#customerName").val().trim();
  const phone = $("#customerPhone").val().trim();
  const address = $("#customerAddress").val().trim();
  const area = $("#deliveryArea").val();
  const payment = $("#paymentMethod").val();
  const email = $("#customerEmail").val().trim();
  const note = $("#orderNote").val().trim();
  const qty = Math.max(1, Number($("#orderQty").val()) || 1);
  const total = selectedOrder.price * qty;

  if(!name || !phone || !address || !area || !payment){
    alert("Please complete all required fields.");
    return;
  }

  if(!/^01[3-9]\d{8}$/.test(phone)){
    alert("Please enter a valid Bangladesh mobile number, e.g. 017XXXXXXXX.");
    return;
  }

  const orderId = "MX" + Date.now().toString().slice(-8);

  lastOrderMessage =
`🐟 *MAX AQUA — NEW ORDER*
━━━━━━━━━━━━━━━━
🆔 Order ID: ${orderId}

📦 *Product:* ${selectedOrder.name}
🔢 *Quantity:* ${qty}
💰 *Product Total:* ৳${total.toLocaleString()}

👤 *Customer:* ${name}
📱 *Phone:* ${phone}
📧 *Email:* ${email || "Not provided"}
📍 *Delivery Area:* ${area}
🏠 *Address:* ${address}
💳 *Payment:* ${payment}
📝 *Note:* ${note || "None"}

Please confirm the order and delivery charge.
Thank you — MAX AQUA`;

  $("#orderForm")[0].reset();
  $("#orderQty").val(1);
  bootstrap.Modal.getOrCreateInstance(document.getElementById("orderModal")).hide();

  $("#successText").text("Order " + orderId + " is ready to send to MAX AQUA.");
  setTimeout(function(){
    bootstrap.Modal.getOrCreateInstance(document.getElementById("orderSuccessModal")).show();
  },300);
});

$("#sendWhatsApp").on("click",function(){
  if(MAX_AQUA_WHATSAPP.includes("X")){
    alert("First open script.js and replace MAX_AQUA_WHATSAPP with your real WhatsApp number.");
    return;
  }
  const url = "https://wa.me/" + MAX_AQUA_WHATSAPP + "?text=" + encodeURIComponent(lastOrderMessage);
  window.open(url,"_blank");
});

/* MAX AQUA: ALL OPTIONS FUNCTIONAL */
let wishlist=JSON.parse(localStorage.getItem("maxAquaWishlist")||"[]");
function saveWishlist(){localStorage.setItem("maxAquaWishlist",JSON.stringify(wishlist));}
function renderWishlist(){ $("#wishlistCount").text(wishlist.length); const b=$("#wishlistItems").empty(); if(!wishlist.length){b.html('<div class="empty-cart">Your wishlist is empty.</div>');return;} wishlist.forEach((p,i)=>b.append(`<div class="wishlist-row"><div><b>${p.name}</b><br><small>৳${Number(p.price).toLocaleString()}</small></div><div><button class="btn btn-sm btn-aqua wish-cart" data-i="${i}">Add to Cart</button> <button class="btn btn-sm text-danger wish-remove" data-i="${i}"><i class="bi bi-trash"></i></button></div></div>`));}
function syncWish(){$(".wishlist-btn").each(function(){let on=wishlist.some(x=>x.name===$(this).data("name"));$(this).toggleClass("active",on).find("i").toggleClass("bi-heart-fill",on).toggleClass("bi-heart",!on);});}
$(document).on("click",".wishlist-btn",function(e){e.stopPropagation();let n=$(this).data("name"),p=Number($(this).data("price")),i=wishlist.findIndex(x=>x.name===n);i>=0?wishlist.splice(i,1):wishlist.push({name:n,price:p});saveWishlist();renderWishlist();syncWish();});
$(".wishlist-open").on("click",function(){renderWishlist();bootstrap.Modal.getOrCreateInstance(document.getElementById("wishlistModal")).show();});
$(document).on("click",".wish-remove",function(){wishlist.splice(Number($(this).data("i")),1);saveWishlist();renderWishlist();syncWish();});
$(document).on("click",".wish-cart",function(){let p=wishlist[Number($(this).data("i"))];if(!p)return;let f=cart.find(x=>x.name===p.name);f?f.qty++:cart.push({name:p.name,price:Number(p.price),qty:1});save();renderCart();});
$("#checkout").off("click").on("click",function(){if(!cart.length){alert("Your cart is empty.");return;}let total=0,b=$("#checkoutSummary").empty();cart.forEach(x=>{total+=x.price*x.qty;b.append(`<div class="checkout-line"><span>${x.name} × ${x.qty}</span><b>৳${(x.price*x.qty).toLocaleString()}</b></div>`);});$("#coTotal").text(total.toLocaleString());bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("cartPanel")).hide();setTimeout(()=>bootstrap.Modal.getOrCreateInstance(document.getElementById("checkoutModal")).show(),250);});
$("#checkoutForm").on("submit",function(e){e.preventDefault();let n=$("#coName").val().trim(),ph=$("#coPhone").val().trim(),ad=$("#coAddress").val().trim(),area=$("#coArea").val(),pay=$("#coPayment").val(),note=$("#coNote").val().trim();if(!/^01[3-9]\d{8}$/.test(ph)){alert("Please enter a valid Bangladesh mobile number.");return;}let total=cart.reduce((s,x)=>s+x.price*x.qty,0),id="MX"+Date.now().toString().slice(-8),items=cart.map(x=>`• ${x.name} × ${x.qty} = ৳${(x.price*x.qty).toLocaleString()}`).join("\n");lastOrderMessage=`🐟 *MAX AQUA — CART ORDER*\n━━━━━━━━━━━━━━━━\n🆔 Order ID: ${id}\n\n${items}\n\n💰 *Total:* ৳${total.toLocaleString()}\n👤 *Customer:* ${n}\n📱 *Phone:* ${ph}\n📍 *Area:* ${area}\n🏠 *Address:* ${ad}\n💳 *Payment:* ${pay}\n📝 *Note:* ${note||"None"}\n\nPlease confirm the order and delivery charge.`;bootstrap.Modal.getOrCreateInstance(document.getElementById("checkoutModal")).hide();cart=[];save();renderCart();$("#successText").text("Order "+id+" is ready to send to MAX AQUA.");setTimeout(()=>bootstrap.Modal.getOrCreateInstance(document.getElementById("orderSuccessModal")).show(),300);});
renderWishlist();syncWish();
