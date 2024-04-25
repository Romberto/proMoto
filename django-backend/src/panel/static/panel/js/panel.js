window.addEventListener('load', function(){
    const ADD_CATEGORY = document.querySelector("#add_category")
    const NEW_PRODUCT = document.querySelector('#new_product')
    const ADD_TO_MENU = document.querySelector('#all_product')
    const LIST_MODAL = [ADD_CATEGORY, NEW_PRODUCT, ADD_TO_MENU]


    function openModul(){
        LIST_MODAL.forEach(element => {
            element.addEventListener('click', function(event){
                event.preventDefault()
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
           let response = await fetch(`api/category/`)
           let result = await response.json()
           return result
       }catch (error) {
           console.log(error.message)
       }
    }

    // клики в поле Категории (Разделы меню)
    function clickToCategory(event){

        // клик по кнопке "Добавить разделы в меню"
        if (event.target.classList.contains('js_open_form_add_category')){
            renderFormAddCategory()


        } // клик по кнопке "настройки раздела"
         else if (event.target.classList.contains('btn_category')){
            nameCategory = event.target.getAttribute('data-category')
            idCategory = event.target.getAttribute('data-id')
            is_employ = event.target.getAttribute('data-is_employ')
            renderCategorySetting(idCategory, nameCategory, is_employ)
        } // клик по кнопке "Удалить раздел"
        else if (event.target.classList.contains('js_open_form_delete_category')){
            idCategory = event.target.getAttribute('data-id')
            nameCategory = event.target.getAttribute('data-category')
            renderFormDeleteCategory(idCategory, nameCategory)
        }
    }

    async function renderCategorySetting(idCategory, nameCategory, is_employ){
        html = `
        <h3 class="text-center mb-3 pt-2">Изменить раздел ${nameCategory}</h3>
        <form method="post" enctype="multipart/form-data" id="form_update_category" class="mb-2">
                    <input type="hidden" name="csrfmiddlewaretoken" value="${csrf_token}" />
                    <input type="hidden" name="id_category" value="${idCategory}" />
                    <input type="text" name="category_name" class="form-control w-100 mb-2" placeholder="название раздела" required value="${nameCategory}"/>
                    <div class="form-check form-switch mb-2">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Отображать в меню</label>`
                    console.log(is_employ)
                    if (is_employ === 'true'){
                          html += `<input class="form-check-input is_employ" name="is_employ" type="checkbox" id="flexSwitchCheckDefault" checked>`

                    }else{
                        html += `<input class="form-check-input is_employ" name="is_employ" type="checkbox"  id="flexSwitchCheckDefault">`
                    }


                    html += `</div><input type="submit" value="Изменить" class="btn btn-primary btn-sm mb-2 form-update-category"/>
               </form>
                <button id="delete_category" class="btn btn-danger btn-sm mb-2 js_open_form_delete_category" data-id="${idCategory}" data-category='${nameCategory}'>Удалить раздел</button>`


        document.querySelector('#modul_category .modul_content').innerHTML = html
    }

    function renderFormDeleteCategory(idCategory, nameCategory){
        html = `<h3 class="text-center mb-3 pt-2">Удалить раздел ${nameCategory} ?</h3>
        <p class='alert alert-danger'>так же удалятся все продукты, входящие в этот раздел<p>
        <p class='alert alert-success'>для выходы нажмите на пустое место</p>
                <form method="post" enctype="multipart/form-data" id="form_delete_category" class="mb-2">
                    <input type="hidden" name="csrfmiddlewaretoken" value="${csrf_token}" />
                    <input type="hidden" name="id_category" value="${idCategory}" />
                    <input type="submit" value="Удалить ?" class="btn btn-danger btn-sm mb-2 form-delete-category"/>
                </form>`

        document.querySelector('#modul_category .modul_content').innerHTML = html
    }




// submit формы добавления нового и изменения старого раздела в меню
    async function getNewCategory(event){
        // форма для добавления нового раздела в меню
            if (event.target.id === 'form_add_category'){
            event.preventDefault()


            html = ``
            try{
                let data = new FormData(event.target)
                let response = await fetch('api/category/', {
                    method: 'POST',
                    body: JSON.stringify({'category_name': data.get('category_name')}),
                    headers: {
                         'X-CSRFToken': csrf_token,
                         'Content-Type': 'application/json'
                    },
                })
                let result = await response.json()
                html = `<h3 class="text-center text-success">Добавлен новый раздел ${data.get('category_name')}<h3>`

            }catch(error){
                html = `h3<div class="text-center text-danger" role="alert">Что-то пошло не так</div>`
                console.log(error.message)

            }finally{
                document.querySelector('#modul_category .modul_content').innerHTML = html

                setTimeout(()=>{
                    document.querySelector('#modul_category').classList.remove('active')

                },1000)
            }
            // если форма изменения раздела
        }else if (event.target.id === 'form_update_category'){
            event.preventDefault()
            let data = new FormData(event.target)
            html = ``
            const categoryId = data.get('id_category')
            const categoryName = data.get('category_name')
            let is_employ = data.get('is_employ')
            try{
                if (!is_employ){
                    is_employ = false
                }else{
                    is_employ = true
                }
                let response = await fetch(`api/category/${categoryId}/`, {
                    method: 'PUT',
                    body: JSON.stringify({'category_name': data.get('category_name'), 'is_employ': is_employ}),
                    headers: {
                         'X-CSRFToken': csrf_token,
                         'Content-Type': 'application/json'
                    },
                })
                let result = await response.json()
                html = `<h3 class="text-center text-success">Изменение ${categoryName}<h3>`
            } catch (error) {
                html = `h3<div class="text-center text-danger" role="alert">Что-то пошло не так</div>`
                console.log(error.message)
            } finally{
                document.querySelector('#modul_category .modul_content').innerHTML = html
                setTimeout(()=>{
                    document.querySelector('#modul_category').classList.remove('active')
                },1000)
            }
        }

        // если форма удаления раздела
        else if (event.target.id === 'form_delete_category'){
            event.preventDefault()
            console.log(data)
            html = ``
            try {
                let response = await fetch(`api/category/${data.get('id_category')}/`, {
                    method: 'DELETE',
                    headers: {
                         'X-CSRFToken': csrf_token,
                         'Content-Type': 'application/json'
                    },
                })
                html = `<h3 class="text-center text-success">Удален раздел <h3>`
            } catch (error) {
                console.log(error.message)
                html = `h3<div class="text-center text-danger" role="alert">Что-то пошло не так</div>`
            }finally{
                document.querySelector('#modul_category .modul_content').innerHTML = html

                setTimeout(()=>{
                    document.querySelector('#modul_category').classList.remove('active')
                },2000)
            }
        }

    }

    // форма удаления продукта

    function renderFormDeleteProduct(idProduct, nameProduct){
        html = `<h3 class="text-center mb-3 pt-2">Удалить ${nameProduct} ?</h3>
        <p class='alert alert-danger'>Внимание удаление продкта ${nameProduct}<p>
        <p class='alert alert-success'>для отмены нажмите на пустое место</p>
                <form method="post" enctype="multipart/form-data" id="form_delete_product" class="mb-2">
                    <input type="hidden" name="id_product" value="${idProduct}" />
                    <input type="submit" value="Удалить ?" class="btn btn-danger btn-sm mb-2 form-delete-category"/>
                </form>`
        console.log(document.querySelector('#modul_product .modul_content'))
        document.querySelector('#modul_product .modul_content').innerHTML = html
    }



    // клик по кнопке "Добавить разделы в меню"

    function renderFormAddCategory(){
        html = `
        <h3 class="text-center mb-3 pt-2">Добавить новый раздел</h3>
        <form method="post" enctype="multipart/form-data" id="form_add_category">
                    <input type="text" name="category_name" class="form-control w-100 mb-2" placeholder="название раздела" required/>
                    <input type="submit" value="Добавить" class="btn btn-primary btn-sm mb-2 form-add-category"/>
               </form>`
        document.querySelector('#modul_category .modul_content').innerHTML = html
    }

    document.querySelector('.category').addEventListener('click', clickToCategory)
    document.querySelector('.category').addEventListener('submit', getNewCategory)




    //ajax для добавления нового продукта
    let addProductForm = document.querySelector('#product_form')
    addProductForm.addEventListener('submit', async function(event){
    event.preventDefault()
    let data = new FormData($('#product_form')[0])
    data.append("csrfmiddlewaretoken", csrf_token)
    try {
    let response = await fetch('api/add_product/', {
    method: 'POST',
    body: data
    });
    let result = await response.json();
    document.querySelector('#message_product').innerHTML = result.message
    }catch (error) {
        console.log(error.message)
        document.querySelector('#message_product').innerHTML = error.message
    }finally {
    setTimeout(() => {
        document.querySelector('#modul_product').classList.remove('active')
        document.querySelector('#message_product').innerHTML = ''
            },2000)
        }
    })

    // получаем название и id всех продуктов

    async function getAllProduct(){
        try{
            let response = await fetch('api/product/')
            let result = await response.json()
            return result
        }catch(error){
        console.log(error.message)
        }
    }
 // один продукт

 async function getProductById(id){
 try{
    let response = await fetch(`api/product/${id}/`);
    let result = await response.json();
    return result
 }
 catch(error){
 console.log(error.message)
 }

 }

// отрисовывает модальное окно "Все продукты" при клике на кнопку "Все продукты"

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


// клик по кнопкам в окне "Все продукты"

    async function clickBtnSettings(){

            // клик по кнопке настройки
        if (event.target.classList.contains('btn_setting')) {
            id = event.target.getAttribute('data-product')
            try{
                let data = await getProductById(id)
                await openSettings(data)
            }catch (error) {
                console.log(error)
            }


        }
        // если клик по кнопке "Сохранить изменения"
        else if(event.target.classList.contains('save-change-settings')) {
            event.preventDefault();


            let html = ''
            try{
                let form = document.querySelector('#form_settings')
                let id = form.querySelector('input[name="id"]').value
                let inputImage = form.querySelector('input[name="image"]').files[0];
                let productName = form.querySelector('input[name="productName"]').value
                let category = form.querySelector('select').value
                let price = form.querySelector('input[name="price"]').value
                let productDescription = form.querySelector('textarea[name="productDescription"]').value
                let is_employ = form.querySelector('input[name="checkbox_switch"]').checked
                let data = new FormData()
                data.append('id', id)
                data.append('productName', productName)
                data.append('category', category )
                data.append('price', price)
                data.append('productDescription', productDescription)
                if(inputImage){
                    data.append('image', inputImage)
                }
                data.append('is_employ', is_employ)

                let response = await fetch(`api/product/${id}/`,{
                    method: 'PATCH',
                    body: data,
                    headers: {
                         'X-CSRFToken': csrf_token,
                    },
                    })
                if(response.status===200){
                    html = '<h3 class="text-center text-success">Изменения сохранены</h3>'
                }else{
                    html = '<h3 class="text-center text-danger">Ошибка сохранения</h3>'
                }


                }catch(error){
                    html = '<h3 class="text-center text-danger">Ошибка сохранения</h3>'
                    console.log(error)
                }finally{
                    document.querySelector('#modul_all_product .modul_content').innerHTML = html
                    setTimeout(()=>{
                        document.querySelector('#modul_all_product').classList.remove('active');
                    },2000)
                }

        }
        // если клик по кнопке удалить продукт
        else if(event.target.classList.contains('btn-product-remove')){
            let idProduct = event.target.getAttribute('data-product')
            let nameProduct = event.target.getAttribute('data-name')
            let html = ``
            renderFormDeleteProduct(idProduct, nameProduct)

        }

    }

// удаление продукта

async function removeProduct(id){
    let data = new FormData()
    data.append("csrfmiddlewaretoken", csrf_token)
    let response = await fetch(`api/product/${id}`, {
                    method: 'DELETE',
                    headers: {
                         'X-CSRFToken': csrf_token,
                    },
                });

}



 // отрисовывает модальное окно "Настройки продукта"
    async function openSettings(data){
        categories = await getAllCategory()
        html = `<h3 class='text-center mb-2 pt-1'>${data.productName}</h3>`
        html += `<form id="form_settings" method="post" enctype="multipart/form-data">
            <input type="hidden" name="id" value="${data.id}">
            <div class="form-group mb-2">
                 <input type="text" class="form-control w-75" name="productName" placeholder="название позиции"  required value="${data.productName}">
            </div>
            <div class="form-group mb-2">
                <select class="form-select" id="category" name="category" required>
                    <option disabled>Выберите категорию</option>
                     ${categories.map(element => `<option value="${element.id}" ${element.id == data.category ? 'selected' : ''}>${element.category_name}</option>`).join('')}

                </select>
            </div>
            <div class="form-group mb-2 d-flex align-items-end">

                <input type="number" name="price" class="form-control w-75 me-2" id="product-form-price" placeholder="цена в рублях" required value="${data.price}">
                <label for="product-form-price">руб.</label>
            </div>
            <div class="form-group mb-2">
                <textarea class="form-control" rows="2" name="productDescription" placeholder="краткое описание блюда" required>${data.productDescription}</textarea>
            </div>
            <div class="form-group mb-2">
                <input type="file" class="form-control" name="image" id="product-image" placeholder="загрузите фото" data-image="${data.image}" required>
            </div>
            <div class="form-check form-switch mb-4">
                <label for="checkbox_switch">Включен в меню</label>`
                    if(data.is_employ){
                    html += `<input class="form-check-input" type="checkbox" role="switch" id="checkbox_switch" name='checkbox_switch' checked>`
                    }else{
                    html += `<input class="form-check-input" type="checkbox" role="switch" id="checkbox_switch" name='checkbox_switch'>`
                    }
            html += `</div>
            <input type='submit' value='Сохранить изменения' class="btn btn-info save-change-settings mb-3">
            </form>
            <button class="btn btn-danger btn-product-remove mb-2" data-product="${data.id}" data-name="${data.productName}">удалить</button>
            `
        document.querySelector('#modul_all_product .modul_content').innerHTML = html
    }




    document.querySelector('.settings').addEventListener('click', clickBtnSettings);
    document.querySelector('.settings').addEventListener('change', handleCheckboxChange);
    openModul()
    closeModul()




})