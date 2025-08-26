const pricesAPI = {
  drinks: 150,
  desserts: 250,
  rexPicks: 300,
  sides: 100,
  favorites: { 
    "Dino Nuggies and Milkshake": 425, 
    "Dino Nuggies": 300, 
    "Milkshake": 150 
  }
};

const cartItems = [];
let total = 0;

const autoDiscountCheckbox = document.getElementById('auto-discount');
const customDiscountCheckbox = document.getElementById('custom-discount-toggle');
const customInput = document.getElementById('custom-discount');
const customContainer = document.getElementById('custom-discount-container');

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const menuItem = button.parentElement;
    const itemName = menuItem.getAttribute('data-name');
    const itemKey = menuItem.getAttribute('data-key');

    const existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) existingItem.quantity += 1;
    else cartItems.push({ name: itemName, key: itemKey, quantity: 1 });

    updateCart();
  });
});

function toggleDiscountVisibility() {
  customContainer.classList.toggle('hidden', !customDiscountCheckbox.checked);
  updateCart();
}

autoDiscountCheckbox.addEventListener('change', updateCart);
customDiscountCheckbox.addEventListener('change', toggleDiscountVisibility);
customInput.addEventListener('input', updateCart);

function getDiscountRate() {
  let discount = 0;
  if (autoDiscountCheckbox.checked) discount = 10;
  if (customDiscountCheckbox.checked && customInput.value) discount = parseInt(customInput.value, 10) || 0;
  return discount;
}

function updateCart() {
  const cartList = document.getElementById('cart-items');
  const totalElement = document.getElementById('total');
  cartList.innerHTML = '';
  total = 0;

  cartItems.forEach((item, index) => {
    let price;
    if(item.key === "favorites") price = pricesAPI.favorites[item.name];
    else price = pricesAPI[item.key];
    const discountRate = getDiscountRate();
    const discountedPrice = price * (1 - discountRate / 100);

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${index})">-</button>
        <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" />
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
      <span>$${(discountedPrice * item.quantity).toFixed(2)}</span>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartList.appendChild(li);
    total += discountedPrice * item.quantity;
  });

  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

function updateQuantity(index, value) {
  const quantity = parseInt(value, 10);
  if (quantity > 0) {
    cartItems[index].quantity = quantity;
    updateCart();
  }
}

function increaseQuantity(index) {
  cartItems[index].quantity += 1;
  updateCart();
}

function decreaseQuantity(index) {
  if (cartItems[index].quantity > 1) {
    cartItems[index].quantity -= 1;
    updateCart();
  }
}

function removeItem(index) {
  cartItems.splice(index, 1);
  updateCart();
}

// Copy total
const copyTotalBtn = document.getElementById('copy-total-btn');
copyTotalBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(total.toFixed(2));
});
