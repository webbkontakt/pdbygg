    window.addEventListener('scroll', function () {
    const header = document.getElementById('myHeader');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  window.addEventListener('scroll', function () {
    const logga = document.getElementById('logga');
    if (window.scrollY > 50) {
      logga.classList.add('scrolled');
    } else {
      logga.classList.remove('scrolled');
    }
  });

  //cookies//

  const overlay = document.getElementById('cookie-overlay');
const banner = document.getElementById('cookie-banner');
const settings = document.getElementById('cookie-settings');
const acceptAll = document.getElementById('accept-all');
const customize = document.getElementById('customize');
const saveSettings = document.getElementById('save-settings');

// Kontrollera om användaren redan har gjort ett val
const cookiesAccepted = localStorage.getItem('cookiesAccepted');

if (!cookiesAccepted) {
  // Visa popup
  overlay.style.display = 'block';
  banner.classList.remove('hidden');
  document.body.classList.add('cookie-blocked');
} else {
  // Döljer allting om val finns
  overlay.style.display = 'none';
  banner.classList.add('hidden');
  settings.style.display = 'none';
  document.body.classList.remove('cookie-blocked');
}

acceptAll.addEventListener('click', () => {
  localStorage.setItem('cookiesAccepted', JSON.stringify({
    essential: true,
    analytics: true,
    marketing: true
  }));
  stängBanner();
});

customize.addEventListener('click', () => {
  banner.classList.add('hidden');
  settings.style.display = 'block';
});

saveSettings.addEventListener('click', () => {
  const analytics = document.getElementById('analytics').checked;
  const marketing = document.getElementById('marketing').checked;

  localStorage.setItem('cookiesAccepted', JSON.stringify({
    essential: true,
    analytics: analytics,
    marketing: marketing
  }));
  stängBanner();
});

function stängBanner() {
  overlay.style.display = 'none';
  banner.classList.add('hidden');
  settings.style.display = 'none';
  document.body.classList.remove('cookie-blocked');
}

const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.2 // 20% av elementet synligt triggar animationen
});

fadeEls.forEach(el => observer.observe(el));

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
let isAnimating = false;
let slideInterval = setInterval(() => changeSlide(1), 5000);

function changeSlide(direction) {
  if (isAnimating) return;
  isAnimating = true;

  const current = slides[currentSlide];
  current.classList.remove('active');
  current.classList.add('exit-left');

  currentSlide = (currentSlide + direction + slides.length) % slides.length;

  const next = slides[currentSlide];
  next.classList.remove('exit-left');
  next.classList.add('active');
  next.style.transform = `translateX(${direction === 1 ? '100%' : '-100%'})`;
  next.style.opacity = '0';

  // Force reflow to restart transition
  void next.offsetWidth;

  next.style.transform = 'translateX(0)';
  next.style.opacity = '1';

  setTimeout(() => {
    current.classList.remove('exit-left');
    isAnimating = false;
  }, 1000); // matchar CSS transition
}

function toggleMeny() {
    const meny = document.getElementById("meny");
    meny.classList.toggle("visad");
}
window.addEventListener('scroll', function() {
    const meny = document.getElementById('meny');
    if (meny.classList.contains('visad')) {
        meny.classList.remove('visad');
    }
});




function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, imageUrl, stripePriceId) {

  const cart = getCart();

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      imageUrl: imageUrl.endsWith('.png') ? imageUrl : imageUrl + '.png',
      quantity: 1,
      stripePriceId: stripePriceId   // 🟢 Spara ID:t här!
    });
  }

  setCart(cart);
  updateCartCount();
}




// Uppdatera antalet produkter i kundvagnen
function updateCartCount() {
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElement.textContent = totalItems;
  }
}



// Ladda och visa produkter i kundvagnen (på cart.html)
function loadCart() {
  const cart = getCart();
  const table = document.getElementById('cart-items');
  const tbody = table.querySelector('tbody');
  const totalElement = document.getElementById('total');

  if (!tbody || !totalElement) return;

  tbody.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const row = document.createElement('tr');

    // Bild
    const imgCell = document.createElement('td');
    const img = document.createElement('img');
    const correctSrc = item.imageUrl.startsWith('bilder/') ? item.imageUrl : 'bilder/' + item.imageUrl;
    img.src = item.imageUrl || 'bilder/toaborste1.png';
    img.alt = item.name;
    img.style.width = '120px';
    img.style.height = '150px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '5px';

    // 🟢 Här loggar vi vad src faktiskt blev
    console.log("Bildens src som sätts:", img.src);

    imgCell.appendChild(img);

    // Namn
    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;

    // Antal
    const qtyCell = document.createElement('td');

// container för knappar och display
const qtyContainer = document.createElement('div');
qtyContainer.className = 'qty-container';

// minus-knapp
const minusBtn = document.createElement('button');
minusBtn.className = 'qty-btn minus';
minusBtn.innerHTML = '<i class="fa-solid fa-minus"></i>';

// antal-display
const qtyDisplay = document.createElement('span');
qtyDisplay.className = 'qty-display';
qtyDisplay.textContent = item.quantity;

// plus-knapp
const plusBtn = document.createElement('button');
plusBtn.className = 'qty-btn plus';
plusBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';

// knapparnas funktionalitet
minusBtn.addEventListener('click', () => {
  if (item.quantity > 1) {
    item.quantity--;
    setCart(cart);
    loadCart();
  }
});

plusBtn.addEventListener('click', () => {
  item.quantity++;
  setCart(cart);
  loadCart();
});

// lägg till i containern
qtyContainer.append(minusBtn, qtyDisplay, plusBtn);
qtyCell.appendChild(qtyContainer);

    // Pris per styck
    const priceCell = document.createElement('td');
    priceCell.textContent = `${item.price} kr`;

    // Totalt
    const totalCell = document.createElement('td');
    totalCell.textContent = `${item.price * item.quantity} kr`;

    // Lägg till alla celler till raden
    row.appendChild(imgCell);
    row.appendChild(nameCell);
    row.appendChild(qtyCell);
    row.appendChild(priceCell);
    row.appendChild(totalCell);

    tbody.appendChild(row);

    totalPrice += item.price * item.quantity;
  });

  totalElement.textContent = `Totalt: ${totalPrice} kr`;
}

function flyToCart(imageElement) {
  const cartLink = document.querySelector('a[href="cart.html"]');
  const imgRect = imageElement.getBoundingClientRect();
  const cartRect = cartLink.getBoundingClientRect();

  const flyImg = imageElement.cloneNode(true);
  flyImg.style.position = 'fixed';
  flyImg.style.left = imgRect.left + 'px';
  flyImg.style.top = imgRect.top + 'px';
  flyImg.style.width = imgRect.width + 'px';
  flyImg.style.height = imgRect.height + 'px';
  flyImg.style.zIndex = 1000;
  flyImg.style.transition = 'all 1s ease-in-out';
  flyImg.style.pointerEvents = 'none';
  flyImg.style.opacity = 1;

  document.body.appendChild(flyImg);

  // Trigger animation
  setTimeout(() => {
    flyImg.style.left = cartRect.left + 'px';
    flyImg.style.top = cartRect.top + 'px';
    flyImg.style.width = '30px';
    flyImg.style.height = '30px';
    flyImg.style.opacity = 0.5;
  }, 10);

  flyImg.addEventListener('transitionend', () => {
    flyImg.remove();
  });
}

function handleAddToCart(button, name, price, imageUrl, stripePriceId) {
    addToCart(name, price, imageUrl, stripePriceId);


  const productDiv = button.closest('.kraftborsten');
  const productImg = productDiv.querySelector('img');

  if (productImg) {
    flyToCart(productImg);
  }
}


async function goToCheckout() {
    try {
        const cart = getCart(); // hämtar kundvagnen från localStorage
        if (cart.length === 0) {
            alert("Din kundvagn är tom!");
            return;
        }

        // Ladda Stripe med din public key
        const stripe = Stripe("publickey");

        // Skicka kundvagnen till servern
        const response = await fetch("http://localhost:3000/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart })
        });

        const data = await response.json();

        if (!data.id) {
            console.error("Inget sessionId mottaget:", data);
            alert("Oops, betalningen kunde inte startas!");
            return;
        }

        // Skicka användaren till Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: data.id
        });

        if (result.error) {
            console.error(result.error.message);
            alert("Stripe fel: " + result.error.message);
        }

    } catch (error) {
        console.error("Checkout error:", error);
        alert("Kunde inte prata med servern!");
    }
}









// Töm kundvagnen (cart.html)
function clearCart() {
  localStorage.removeItem('cart');
  location.reload();
}



// Kör efter att sidan är laddad

// Bild snurrtest

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadCart();

});




