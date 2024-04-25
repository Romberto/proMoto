window.addEventListener('load', function(){


    document.querySelector('.category').addEventListener('click', clickToCategory)
    document.querySelector('.category').addEventListener('submit', clickCategory)

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


// отрисовка формы добавления категории
  function renderFormAddCategory(){
        html = `
        <h3 class="text-center mb-3 pt-2">Добавить новый раздел</h3>
        <form method="post" enctype="multipart/form-data" id="form_add_category">
                    <input type="text" name="category_name" class="form-control w-100 mb-2" placeholder="название раздела" required/>
                    <input type="submit" value="Добавить" class="btn btn-primary btn-sm mb-2 form-add-category"/>
               </form>`
        document.querySelector('#modul_category .modul_content').innerHTML = html
    }


 // отрисовка формы изменения категории
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


    // отрисовка формы удаления категории
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

    // запросы на добавление категории и изменение категории и удаление раздела

     async function clickCategory(event){
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
                html = ``
                try {
                    let data = new FormData(event.target)
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

})