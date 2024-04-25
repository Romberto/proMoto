window.addEventListener('load', function(){
    const ADD_CATEGORY = document.querySelector("#add_category")
    const NEW_PRODUCT = document.querySelector('#new_product')
    const ADD_TO_MENU = document.querySelector('#all_product')
    const LIST_MODAL = [ADD_CATEGORY, NEW_PRODUCT, ADD_TO_MENU]


    openModul()
    closeModul()
    document.querySelector('.settings').addEventListener('change', handleCheckboxChange);

    function openModul(){
        LIST_MODAL.forEach(element => {
            element.addEventListener('click', function(event){
                openModulWindow(event.target.id)
            })
        })
    }


        // Открытие модальных окон
    function openModulWindow(button_id){
        if (button_id === 'add_category'){
            document.querySelector('#modul_category').classList.add('active')
            renderCategory()
        } else if(button_id === 'new_product'){
            document.querySelector('#modul_product').classList.add('active')
        }else if(button_id === 'all_product'){
            document.querySelector('#modul_all_product').classList.add('active')
            renderAllProduct()
        }
    }

   // закрытие модальных окон
    function closeModul(){
        let modul = document.querySelectorAll('.modul')
        modul.forEach(element => {
            element.addEventListener('click', function(event){
                event.stopPropagation()
                if(event.target.classList.contains('modul')){
                    if(this.id === 'modul_all_product'){
                        changesInTheMenuComposition()
                    }else{
                        this.classList.remove('active')

                    }

                }
            })
        })
    }

    // отрисовка окна с разделами( категориями ) меню

    async function renderCategory(){
        html = `<h3 class="text-center mb-2 pt-2">Разделы меню</h3>
        <button id="add_category" class="btn btn-primary btn-sm mb-2 js_open_form_add_category">Добавить раздел меню</button>`

        try{
            let category = await getAllCategory()
            if (category.length === 0){
                html += `<p>разделов пока нет</p><p>добавте их с помощью кнопки "Добавить разделы в меню"</p>`
            }else{
                html += `<ul class='ps-0'>`
                category.forEach(element => {
                    html += `<li class="d-flex justify-content-between align-items-center mb-2 pe-1 ps-1" style="background: #e3e7eb;">
                        <p>${element.category_name}</p>
                        <button class="btn btn_category" data-category="${element.category_name}" data-id="${element.id}" data-is_employ="${element.is_employ}"></button>
                    </li>`
                })
                html += `</ul>`
            }
        }catch (error) {
            console.log(error.message)
            html += `<div class="alert alert-danger" role="alert">Что-то пошло не так</div>`
        }finally{
         document.querySelector('#modul_category .modul_content').innerHTML = html
        }
    }

    // получить все категории
    async function getAllCategory(){
       try {
           let response = await fetch(`api/category/?ordering=id`)
           let result = await response.json()
           return result
       }catch (error) {
           console.log(error.message)
       }
    }


    async function renderAllProduct(){
        let changeList = []
        localStorage.setItem('changeList', JSON.stringify(changeList));
        let allProduct = await getAllProduct()
        let html = `<h3 class="text-center mb-3 pt-2">Все продукты</h3>`
        if(allProduct && allProduct.length > 0){
            html += `<div class="product-list d-flex flex-column w-100">`
                        allProduct.forEach(element => {
                            html += `<div class="product-item d-flex align-items-center justify-content-between mb-1" style="background: #e3e7eb;">
                                    <p class="item-name w-75">${element.productName}</p>`
                                    if(element.is_employ){
                                    html +=`<div class="form-check form-switch">
                                      <input class="form-check-input is_employ" type="checkbox" role="switch" id="${element.id}" checked>
                                    </div>`

                                    }else{
                                       html +=`<div class="form-check form-switch">
                                            <input class="form-check-input is_employ" type="checkbox" role="switch" id="${element.id}">
                                        </div>`
                                    }
                                     html += `<button type="button" data-product="${element.id}" class="btn btn_setting"></button>`
                            html +=`</div>`
                        })
             html += `</div>`
        }
        else{
            html += `<h3 class="text-center">Нет продуктов</h3>
            <p>Для добавления нового продукта нажмите на кнопку "Добавить продукт" в главном меню</p>`

        }

        document.querySelector('#modul_all_product .modul_content').innerHTML = html
    }

    // сохроняет изменения в составе меню
    async function changesInTheMenuComposition() {
    let changeList = JSON.parse(localStorage.getItem('changeList'));
    let html = ``;
    if (changeList && changeList.length > 0) {
        let data = new FormData();
        data.append('csrfmiddlewaretoken', csrf_token);
        data.append('changeList', JSON.stringify(changeList));
        try {
            html = `<h3 class="text-center text-success mb-3 pt-2">Изменения сохранены</h3>`
            let response = await fetch('api/changeMenu/', {
                method: 'POST',
                body: data
            });

            let result = await response.json();
        } catch (error) {
            console.log(error)
            html = `<h3 class="text-center text-danger mb-3 pt-2">Ошибка сохранения</h3>`
        } finally {
            document.querySelector('#modul_all_product .modul_content').innerHTML = html;
            setTimeout(() => {
                document.querySelector('#modul_all_product').classList.remove('active');

            }, 750);
        }
    } else {
        document.querySelector('#modul_all_product').classList.remove('active');
    }
}

    // получаем название и id всех продуктов

    async function getAllProduct(){
        try{
            let response = await fetch('api/product/?ordering=id')
            let result = await response.json()
            return result
        }catch(error){
        console.log(error.message)
        }
    }

    // изменение состояния чекбокса
    function handleCheckboxChange(event) {
    if (event.target.classList.contains('is_employ')) {
        let retrievedList = JSON.parse(localStorage.getItem('changeList'));
        var index = retrievedList.indexOf(event.target.id);
        if (index !== -1) {
            retrievedList.splice(index, 1); // Удалить элемент из массива по индексу
        } else {
            retrievedList.push(event.target.id); // Добавить элемент в конец массива
        }
        localStorage.setItem('changeList', JSON.stringify(retrievedList));
        }
    }



})