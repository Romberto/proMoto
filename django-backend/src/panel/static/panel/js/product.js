window.addEventListener('load', function(){
 document.querySelector('.settings').addEventListener('click', clickBtnSettings);
 document.querySelector('.settings').addEventListener('submit', editProduct)



 // добавить новый продукт
 let addProductForm = document.querySelector('#product_form');
addProductForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    let data = new FormData(event.target);
    try {
        let response = await fetch('api/product/', {
            method: 'POST',
            body: data,
            headers: {
                'X-CSRFToken': csrf_token
            },
        });
        let result = await response.json();
        console.log(response);
        if (response.ok) {

            if (response.status === 201) {
                let message = `<p class="text-center alert alert-success">успешно создан ${data.get('productName')}</p>`;
                document.querySelector('#modul_product .modul_content').innerHTML = `<p class="text-center alert alert-danger">${message}</p>`;
            } else {
                let errorMessage = `ошибка создания ${data.get('productName')}`;
                document.querySelector('#modul_product .modul_content').innerHTML = `<p class="text-center alert alert-danger">${errorMessage}</p>`;
            }
        } else {
            throw new Error('Ошибка HTTP: ' + response.status);
        }
    } catch (error) {
        console.log('Произошла ошибка:', error);
        let errorMessage = `Произошла ошибка: ${error.message}`;
        document.querySelector('#modul_product .modul_content').innerHTML = `<p class="text-center alert alert-danger">${errorMessage}</p>`;
    } finally {
        setTimeout(() => {
            location.reload()
        }, 2000);
    }
});


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
        } else if(event.target.classList.contains('btn-product-remove')){
            idProduct = event.target.getAttribute('data-product')
            nameProduct = event.target.getAttribute('data-name')
            renderFormDeleteProduct(idProduct, nameProduct)
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
                <input type="file" class="form-control" name="image" id="product-image" />
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

    async function getAllCategory(){
    try{
        let response = await fetch('api/category/');
        let result = await response.json();
        return result
        }catch(error){
         console.log(error.message)
        }
    }

    // предупреждение о удаление продукта

    // отрисовка формы удаления категории
    function renderFormDeleteProduct(idProduct, nameProduct){
        html = `<h3 class="text-center mb-3 pt-2">Удалить  ${nameProduct} ?</h3>
        <p class='alert alert-danger'>Вы действительно хотите удалить ${nameProduct}?<p>
        <p class='alert alert-success'>для выходы нажмите на пустое место</p>
                <form method="post" enctype="multipart/form-data" id="form_delete_product" class="mb-2">
                    <input type="hidden" name="id_product" value="${idProduct}" />
                    <input type="submit" value="Удалить ?" data-productId ="${idProduct}" class="btn btn-danger btn-sm mb-2 form-delete-product"/>
                </form>`
        document.querySelector('.settings').innerHTML = html
    }

    async function editProduct(event){

        event.preventDefault()
        if(event.target.id === 'form_delete_product'){
            data = new FormData(event.target)
            let id = data.get('id_product')
            html = ``
            try{
                await deleteProduct(id)
                html = `p class="text-success text-center">${data.get("productName")} Запись удалена </p>`
                }
            catch(error){
                html = '<p class="text-danger">Что-то пошло не так</p>'
                console.log(error.message)
            }finally{
                document.querySelector('.settings').innerHTML = html
                    setTimeout(()=>{
                        document.querySelector('#modul_all_product').classList.remove('active');
                    },1000)
            }

        }else if(event.target.getAttribute('id') === 'form_settings'){


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
    }

    async function deleteProduct(id){
        response = await fetch(`api/product/${id}`,{
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrf_token
            },
        })
    }




})