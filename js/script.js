document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'),
        cartBtn = document.querySelector('#cart'),
        wishListBtn = document.querySelector('#wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart'),
        category = document.querySelector('.category');

    const loading = () => {
        goodsWrapper.innerHTML = `
        <div id="spinner"><div class="spinner-loading"><div><div><div></div>
        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>
        `
    };

    const createGoodsCard = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist" data-goods-id="${id}"></button>
                            </div>
                            <div class="card-body justify-content-between">
                                <a href="#" class="card-title">${title}</a>
                                <div class="card-price">${price} $</div>
                                <div>
                                    <button class="card-add-cart" data-goods-id="${id}">Add to Cart</button>
                                </div>
                           </div>
                        </div>`;

       return card;
    };

    const renderCard = items => {
        goodsWrapper.textContent = '';

        if (items.length) {
            items.forEach(({id, title, price, imgMin}) => goodsWrapper.append(createGoodsCard(id, title, price, imgMin)));
        } else {
            goodsWrapper.textContent = '❌ Sorry there are no goods on your search';
        }
    };

    const closeCart = event => {
        let target = event.target;

        if(target === cart ||
            target.classList.contains('cart-close') ||
            event.keyCode === 27) {

            cart.style.display = '';
            document.removeEventListener('keyup', closeCart);
        }
    };

    const openCart = event => {
        event.preventDefault();
        cart.style.display = 'flex';
        document.addEventListener('keyup', closeCart);
    };

    const getGoods = (handler, filter) => {
        loading();
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };

    //random sort of goods in the obtained array (place of cards)
    const randomSort = item => item.sort(() => Math.random() - 0.5);

    const chooseCategory = event => {
        event.preventDefault();
        const target = event.target;

        if(target.classList.contains('category-item')){
            const category = target.dataset.category;

            getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
        }
    };

    const searchGoods = event => {
        event.preventDefault();

        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();

        if(inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
        } else {
            search.classList.add('error');
            setTimeout(() => {
                search.classList.remove('error');
            }, 2000)
        }

        input.value = '';
    };


    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);
    category.addEventListener('click', chooseCategory);
    search.addEventListener('submit', searchGoods);

    getGoods(renderCard, randomSort);

});