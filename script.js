// База данных продукции VIP VINO (без лишних позиций)
const productsData = [
    { id: 1, name: "Classico", category: "wine", descRu: "Натуральное сухое вино (красное/белое).", descUz: "To'q yoqut rang yoki nozik somonrang vino.", specs: "креп. 12%", price: 47040 },
    { id: 2, name: "Tradizione", category: "wine", descRu: "Натуральное полусухое вино.", descUz: "Qizil va oq uzumning yumshoq, yengil ta'mi.", specs: "креп. 11%, сах. 25г", price: 47040 },
    { id: 3, name: "Incontro", category: "wine", descRu: "Натуральное полусладкое вино.", descUz: "U qizil-yoqut rangga ega va yoqimli shirin ta'mli.", specs: "креп. 10.5%, сах. 50г", price: 47040 },
    { id: 4, name: "Emozioni", category: "wine", descRu: "Полусладкое вино с богатым ароматом.", descUz: "Aromatli, yoqimli ta'm xarakterdir.", specs: "креп. 10.5%, сах. 80г", price: 47040 },
    { id: 5, name: "Nabucco Strawberry", category: "wine", descRu: "Розовое полусладкое с соком клубники.", descUz: "Qulupnay ta'mli maxsus vino.", specs: "креп. 11%, сах. 50г", price: 47040 },
    { id: 6, name: "Buonsecco Asti Moscato", category: "sparkling", descRu: "Белое полусладкое газированное вино.", descUz: "Bayan Shirey, Rkasiteli, Risling, Muskat.", specs: "9.0% • 0.75 л", price: 54880 },
    { id: 7, name: "Buonsecco Asti", category: "sparkling", descRu: "Полусладкое игристое шампанское.", descUz: "Maxsus oq shampan vinosi.", specs: "11% • 0.75 л", price: 54880 },
    { id: 8, name: "Buonsecco Rose", category: "sparkling", descRu: "Газированное розовое сухое вино.", descUz: "Pushti gazlangan quruq vino.", specs: "11% • 0.75 л", price: 38080 }
];

let cart = [];

document.addEventListener("DOMContentLoaded", function() {
    // Имитация Skeleton загрузки (1.2 секунды)
    setTimeout(() => {
        const tableSkeleton = document.getElementById('tableSkeleton');
        const priceTable = document.getElementById('priceTable');
        const cardsSkeleton = document.getElementById('cardsSkeleton');
        const catalogGrid = document.getElementById('catalogGrid');

        if (tableSkeleton) tableSkeleton.style.display = 'none';
        if (priceTable) {
            priceTable.classList.remove('hidden-content');
            renderTable(productsData);
        }

        if (cardsSkeleton) cardsSkeleton.style.display = 'none';
        if (catalogGrid) {
            catalogGrid.classList.remove('hidden-content');
            renderCards(productsData);
        }
    }, 1200);

    // Управление фильтрами каталога
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.getAttribute('data-filter');
            
            if (filter === 'all') {
                renderTable(productsData);
                renderCards(productsData);
            } else {
                const filtered = productsData.filter(p => p.category === filter);
                renderTable(filtered);
                renderCards(filtered);
            }
        });
    });

    // Управление корзиной (Модальное окно)
    const cartTrigger = document.getElementById('cartTrigger');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.getElementById('closeCartBtn');

    if (cartTrigger) {
        cartTrigger.addEventListener('click', () => {
            cartModal.classList.remove('hidden-content');
            updateCartModalUI();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.add('hidden-content');
        });
    }
});

// Рендер таблицы
function renderTable(data) {
    const tbody = document.getElementById('priceTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${item.name}</b></td>
            <td>${item.descRu}</td>
            <td>${item.specs}</td>
            <td class="price">${item.price.toLocaleString()}</td>
            <td><button class="btn-buy" onclick="addToCart(${item.id})">В корзину</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Рендер карточек
function renderCards(data) {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.innerHTML = `
            <h3 class="card-title">${item.name}</h3>
            <div class="badge-container">
                <span class="badge">${item.specs}</span>
            </div>
            <p class="desc-ru">${item.descRu}</p>
            <p class="desc-uz">${item.descUz}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <span class="price" style="font-size: 1.1rem;">${item.price.toLocaleString()} сум</span>
                <button class="btn-buy" onclick="addToCart(${item.id})">Заказать</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Добавление в корзину
window.addToCart = function(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    alert(`Товар "${product.name}" успешно добавлен в корзину!`);
};

// Обновление счетчика товаров
function updateCartCount() {
    const countSpan = document.getElementById('cartCount');
    if (countSpan) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        countSpan.textContent = totalCount;
    }
}

// Обновление содержимого модального окна корзины
function updateCartModalUI() {
    const listContainer = document.getElementById('cartItemsList');
    const totalPriceSpan = document.getElementById('cartTotalPrice');
    if (!listContainer || !totalPriceSpan) return;

    if (cart.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #666;">Корзина пуста</p>';
        totalPriceSpan.textContent = '0';
        return;
    }

    listContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <b>${itemTotal.toLocaleString()} сум</b>
        `;
        listContainer.appendChild(row);
    });

    totalPriceSpan.textContent = total.toLocaleString();
}
