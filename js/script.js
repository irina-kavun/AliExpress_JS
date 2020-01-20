document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'),
        cartBtn = document.querySelector('#cart'),
        wishListBtn = document.querySelector('#wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart'),
        category = document.querySelector('.category'),
        cartCounter = cartBtn.querySelector('.counter'),
        wishListCounter = wishListBtn.querySelector('.counter'),
        cartWrapper = document.querySelector('.cart-wrapper');

//create empty array of goods for the wishlist and object of the goods-item
    const wishList = [];
    const goodsinCart = {};

//spinner and its functioning
    const loading = (functionName) => {
        const spinner = `
        <div id="spinner"><div class="spinner-loading"><div><div><div></div>
        </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>
        `;

        if(functionName === 'renderCard') {
            goodsWrapper.innerHTML = spinner;
        };

        if(functionName === 'renderCart') {
            cartWrapper.innerHTML = spinner;
        };
    };

    //request to the server
    const getGoods = (handler, filter) => {
        loading(handler.name);
        fetch('db/db.json')
            .then(response => response.json())
            .then(filter)
            .then(handler);
    };

    //card generating
    const createGoodsCard = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        card.innerHTML = `<div class="card">
                            <div class="card-img-wrapper">
                                <img class="card-img-top" src="${img}" alt="">
                                <button class="card-add-wishlist ${wishList.includes(id) ? 'active' : ''}" 
                                data-goods-id="${id}"></button>
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

    // render goods in the cart
    const createGoodsCart = (id, title, price, img) => {
        const card = document.createElement('div');
        card.className = 'goods';
        card.innerHTML = `
    <div class="goods-img-wrapper">
        <img class="goods-img" src="${img}" alt="">
    </div>
    <div class="goods-description">
        <h2 class="goods-title">${title}</h2>
        <p class="goods-price">${price} $</p>
    </div>
    <div class="goods-price-count">
        <div class="goods-trigger">
            <button class="goods-add-wishlist ${wishList.includes(id) ? 'active' : ''}" 
            data-goods-id="${id}"></button>
            <button class="goods-delete" data-goods-id="${id}"></button>
        </div>
        
        <div class="goods-count">${goodsinCart[id]}</div>
    </div>`;

        return card;
    };

    //render of cards and goodsCart
    const renderCard = items => {
        goodsWrapper.textContent = '';

        if (items.length) {
            items.forEach(({id, title, price, imgMin}) => goodsWrapper.append(createGoodsCard(id, title, price, imgMin)));
        } else {
            goodsWrapper.textContent = '❌ Sorry there are no goods on your search';
        }
    };

    const renderCart = items => {
        cartWrapper.textContent = '';

        if (items.length) {
            items.forEach(({id, title, price, imgMin}) => cartWrapper.append(createGoodsCart(id, title, price, imgMin)));
        } else {
            cartWrapper.innerHTML = '<div id="cart-empty">Your cart in empty</div>';
        }
    };

    //calculations
    const calcTotalPrice = goods => {
        let sum = goods.reduce((acc, item) => {
            return acc + item.price * goodsinCart[item.id];
        }, 0);

        //alternative method
        // let sum = 0;
        // for (const item of goods) {
        //     sum += item.price * goodsinCart[item.id];
        // }
        cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
    };

    const checkCount = () => {
        wishListCounter.textContent = wishList.length;
        cartCounter.textContent = Object.keys(goodsinCart).length;
    };

    //Filtering
    const showCardBasket = goods => {
        const basketGoods = goods.filter(item => goodsinCart.hasOwnProperty(item.id));
        calcTotalPrice(basketGoods);
        return basketGoods;
    };

    //random sort of goods in the obtained array (place of cards)
    const randomSort = item => item.sort(() => Math.random() - 0.5);

    const showWishlist = () => {
        getGoods(renderCard, goods => goods.filter(item => wishList.includes(item.id)))
    };


    //storage
    const getCookie = name => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    };

    const cookieQuery = get => {
        if (get) {
            if (getCookie('goodsBasket')) {
                Object.assign(goodsinCart, JSON.parse(getCookie('goodsBasket')));
            }
        } else {
            document.cookie = `goodsBasket =${JSON.stringify(goodsinCart)}; max-age=86400e3`
        }
        checkCount();
    };

    const storageQuery = get => {
        if(get) {
            if(localStorage.getItem('wishList')) {
                wishList.push(...JSON.parse(localStorage.getItem('wishList')));
            }
            checkCount();

        } else {
            localStorage.setItem('wishList', JSON.stringify(wishList));
        }
    };


    //events
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
        getGoods(renderCart, showCardBasket);
    };

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

    const toggleWishList = (id, elem) => {
        //check if the element is in the wishlist
        if (wishList.includes(id)) {
            wishList.splice(wishList.indexOf(id), 1);
            elem.classList.remove('active');

        } else {
            wishList.push(id);
            elem.classList.add('active');
        }

        checkCount();
        storageQuery();
    };

    // check if the good item with id is available in the cart - add another one,
    // if not  - add in to the cart
    const addToCart = id => {
        if (goodsinCart[id]) {
            goodsinCart[id] += 1;
        } else {
            goodsinCart[id] = 1
        }
        checkCount();
        cookieQuery();
    };

    const removeGoods = id => {
        delete goodsinCart[id];
        checkCount();
        cookieQuery();
        getGoods(renderCart, showCardBasket)
    };

   //handlers
    const handlerGoods = event => {
        const target = event.target;

        if (target.classList.contains('card-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }

        if (target.classList.contains('card-add-cart')) {
            addToCart(target.dataset.goodsId);
        }
    };

    const cartHandler = event => {
        const target = event.target;

        if (target.classList.contains('goods-add-wishlist')) {
            toggleWishList(target.dataset.goodsId, target);
        }

        if (target.classList.contains('goods-delete')) {
            removeGoods(target.dataset.goodsId);
        }
    };

    //initialization
    {
        getGoods(renderCard, randomSort);
        storageQuery(true);
        cookieQuery(true);

        cartBtn.addEventListener('click', openCart);
        cart.addEventListener('click', closeCart);
        category.addEventListener('click', chooseCategory);
        search.addEventListener('submit', searchGoods);
        goodsWrapper.addEventListener('click', handlerGoods);
        cartWrapper.addEventListener('click', cartHandler);
        wishListBtn.addEventListener('click', showWishlist);
    }

});