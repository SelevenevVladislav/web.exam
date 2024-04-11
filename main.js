async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка запроса');
        return await response.json();
    } catch (error) {
        alert(error);
        return null;
    }
}

async function createTable() {
    const data = await fetchAPI("http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=96e6fdc5-f83f-41ff-b78f-11f66d9e2a41");
    if (!data) return;
    const table1 = document.querySelector("#table1");
    const pagination = document.querySelector("#pagination");
    let currentPage = 1;
    const rowsPerPage = 10;

    function renderTable() {
        const start = (currentPage - 1) * rowsPerPage;
        const paginatedData = data.slice(start, start + rowsPerPage);
        table1.innerHTML = `
            <table class="table w-100 text-center table-light">
                <thead>
                    <tr>
                        <th>Название маршрута</th>
                        <th>Описание</th>
                        <th>Места посещения</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${paginatedData.map(marshrut => `
                        <tr>
                            <td>${marshrut.name}</td>
                            <td>${marshrut.description}</td>
                            <td>${marshrut.mainObject}</td>
                            <td><button class="btn btn-blue" data-id="${marshrut.id}">Выбрать</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        renderPagination(data.length, rowsPerPage);
    }

    function renderPagination(totalItems, rowsPerPage) {
        const totalPages = Math.ceil(totalItems / rowsPerPage);
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add('btn', 'btn-blue');
            button.addEventListener('click', () => {
                currentPage = i;
                renderTable();
            });
            pagination.appendChild(button);
        }
    }

    renderTable();
}

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('btn-blue') && e.target.dataset.id) {
        const clickedId = e.target.dataset.id;
        await addMarshrutName(clickedId);
        await showGuids(clickedId);
    }
});

async function addMarshrutName(clickedId) {
    const marshruts = await fetchAPI(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=96e6fdc5-f83f-41ff-b78f-11f66d9e2a41`);
    if (!marshruts) return;
    const marshrut = marshruts.find(m => m.id === clickedId);
    if (!marshrut) return;
    document.getElementById('marshrutIdData').textContent = marshrut.id;
    document.querySelector("#addNameMarshrut").innerHTML = `
        Доступные гиды по маршруту "${marshrut.name}"
        <div>
            <label>Опыт работы</label>
            <input class="text-dark-on-white widthGuid" maxlength="2">
            <input class="text-dark-on-white widthGuid" maxlength="2">
        </div>
    `;
}

async function showGuids(clickedId) {
    const guids = await fetchAPI(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${clickedId}/guides?api_key=96e6fdc5-f83f-41ff-b78f-11f66d9e2a41`);
    if (!guids) return;
    const table2 = document.querySelector("#gidsTable");
    table2.innerHTML = `
        <table class="table w-100 text-center table-light">
            <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Языки</th>
                    <th>Опыт работы</th>
                    <th>Стоимость услуг в час</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${guids.map(guid => `
                    <tr>
                        <td>${guid.name}</td>
                        <td>${guid.language}</td>
                        <td>${guid.workExperience}</td>
                        <td>${guid.pricePerHour}</td>
                        <td><button class="btn btn-blue" data-id="${guid.id}">Выбрать</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}


createTable();
