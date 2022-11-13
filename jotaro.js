const genDiv = (c) => {
  return `
<div class="cat" data-id=${c.id} onclick="previewHandler(${c.id})">
  <div class="admin__btns" onclick="event.stopPropagation()">
    <span onclick="deleteCat(event, ${c.id})">del</span>
    <span onclick="editCatHandler(${c.id})">edit</span>
  </div>
  <div class="cat__header">
    <span>Имя: ${c.name}</span>
    <span>Возраст: ${c.age}</span>
  </div>
  <div class="cat__photo">
    <img src=${c.img_link}>
  </div>
  <div class="cat__footer">
    <div class="cat__desc">
     Описание: ${c.description}
    </div>
    <div class="cat__rate">
      Рейтинг: ${c.rate}
    </div>
    <div class="cat__fav">
      Любимый: ${c.favourite ? 'Да' : 'Нет'}
    </div>
  </div>
</div>
`;
};

const createNewCat = (e) => {
  e.preventDefault();

  fetch('http://sb-cats.herokuapp.com/api/2/nesa402610/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(newCat)
  })
    .then(r => r.json())
    .then(c => {
      if (c.message !== 'ok') return;
      catsArr.push(newCat);
      cats.insertAdjacentHTML('beforeend', genDiv(newCat));
      modalCreate.classList.replace('active', '');
    });
};
const updateCat = (e) => {
  e.preventDefault();
  fetch('http://sb-cats.herokuapp.com/api/2/nesa402610/update/' + dataToUpd.id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(dataToUpd)
  })
    .then((r) => {
      modalEdit.classList.toggle('active');
    });

};

const fetchCats = () => {
  fetch('http://sb-cats.herokuapp.com/api/2/nesa402610/show')
    .then(r => r.json())
    .then(r => {
      catsArr = r.data;
      let divs = catsArr.map(c => genDiv(c)).join('');
      cats.insertAdjacentHTML('beforeend', divs);
    });
};

const deleteCat = (e, id) => {
  e.target.parentElement.parentElement.remove();
  fetch('http://sb-cats.herokuapp.com/api/2/nesa402610/delete/' + id, {
    method: 'DELETE'
  });

};

const editCatHandler = (id) => {
  modalToggle('modalEdit');
  const cat = catsArr.filter(c => c.id === id)[0];
  dataToUpd.id = cat.id;
  modalEdit.insertAdjacentHTML('beforeend', `
    <div class="modal__body" onclick="event.stopPropagation()">
    <form id="form" onsubmit="updateCat(event)">
      <label>
        Возраст
        <input type="text" id="age" name="age" value=${cat.age} onchange="dataToUpd = {...dataToUpd, age: event.target.value}">
      </label>
      <label>
        Оценка
        <input type="text" id="rate" name="rate" value=${cat.rate} onchange="dataToUpd = {...dataToUpd, rate: event.target.value}">
      </label>
      <label>
        Описание
        <input type="text"
               id="description"
               name="description"
               value='${cat.description}'
               onchange="dataToUpd = {...dataToUpd, description: event.target.value}">
      </label>
      <label>
        Любимый?
        <input type="checkbox"
               id="favourite"
               name="favourite"
               checked=${cat.favourite}
               onchange="dataToUpd = {...dataToUpd, favourite: event.target.checked}">
      </label>
      <label>
        Фотка
        <input type="text" id="img_link" name="img_link" value='${cat.img_link}' onchange="dataToUpd = {...dataToUpd, img_link: event.target.value}">
      </label>
      <button>Обновить</button>
    </form>
    </div>
    `);

};