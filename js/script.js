document.addEventListener('DOMContentLoaded', () => {

    const search = document.querySelector('.search'),
        cartBtn = document.querySelector('#cart'),
        wishListBtn = document.querySelector('#wishlist'),
        goodsWrapper = document.querySelector('.goods-wrapper'),
        cart = document.querySelector('.cart');



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

    goodsWrapper.appendChild(createGoodsCard(1, 'Darts', 200, 'img/temp/archer.jpg'));
    goodsWrapper.appendChild(createGoodsCard(2, 'Flamingo', 300, 'img/temp/flamingo.jpg'));
    goodsWrapper.appendChild(createGoodsCard(3, 'Socks', 30, 'img/temp/socks.jpg'));

    const closeCart = event => {
        let target = event.target;

        if(target === cart || target.classList.contains('cart-close')) {
            cart.style.display = '';
        }
    };

    const openCart = () => {
        cart.style.display = 'flex';
    };

    cartBtn.addEventListener('click', openCart);
    cart.addEventListener('click', closeCart);

});