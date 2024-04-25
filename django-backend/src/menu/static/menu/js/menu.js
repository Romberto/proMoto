window.addEventListener('load', function() {


function getSwiper(){
let swiper = new Swiper('.swiper', {
              // Optional parameters
              direction: 'vertical',
              loop: true,


              // Navigation arrows
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },

              // And if we need scrollbar
              scrollbar: {
                el: '.swiper-scrollbar',
              },
            });
      return swiper
}



let menu = document.querySelector('.menu')
menu.addEventListener('click', openModul)

// открыть окно с длюдами по категориям
async function openModul(event){
if(event.target.classList.contains('js_btn_category')){
    let categoryId = event.target.getAttribute('data-id')
    let products = await getProductByCategory(categoryId) // получить все продукты определённой категории
    getSwiper()
    await renderSlideProduct(products) // отрисовывать продукты
    let menuContent = document.querySelector('.menu-content')
    menuContent.classList.add('active')
}

}

// взять все продукты определённой категории
async function getProductByCategory(categoryId){
    let response = await fetch(`admin/api/product/?category=${categoryId}`)
    let result = await response.json();
    return result
}

// отрисовывать продукты
function renderSlideProduct(products){
html = ``
    if(products && products.length > 0){
    products.forEach(element => {
        html += `<div class="swiper-slide">
        <div class="slide_container">
        <div class="slide_img d-inline">
            <img src="${element.image}" alt="foto-product">
        </div>
        <div class="slide_text">
            <h3 class="p-1 mb-2 bg-light">${element.productName}</h3>
            <p class="fs-4 mb-2 ps-1 position-relative fw-bold fs-4 w-100 p-2 bg-warning text-dark">${element.price}</p>
            <p class="p-1">${element.productDescription}</p>
        </div>
    </div>
    </div>
        </div>`
    })
    }else{
        html = `<h3 class="text-center text-danger">Список пуст</h3>`
    }

    document.querySelector('.swiper-wrapper').innerHTML = html
}

// закрыть окно с длюдами по категориям
function closeModul(event){
    let menu = document.querySelector('.menu-content')
    if(event.target.classList.contains('menu-content')){
        event.target.classList.remove('active')
    }else if(event.target.classList.contains('menu-close')){
        menu.classList.remove('active')
    }
}
async function getAllCategory(){
       try {
           let response = await fetch('admin/api/category/?is_employ=True')
           let result = await response.json()
           return result
       }catch (error) {
           console.log(error.message)
       }
    }

async function renderCategory(){
    let categories = await getAllCategory()

    html = ``
    categories.forEach(element => {
        html += `<li class="menu-item w-100 mb-3">
        <button class="btn btn-warning btn-lg w-100 js_btn_category" data-id="${element.id}">${element.category_name}</button>
       </li>`
    })
    document.querySelector('.menu').innerHTML = html
}

 document.querySelector('.menu-content').addEventListener('click', closeModul)
 document.querySelector
 renderCategory()






});