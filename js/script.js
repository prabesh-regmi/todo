const newBtn = document.getElementById("newBtn");
const cancelBtn = document.getElementById("cancel");
const createBtn = document.getElementById("create");
const tableArea = document.getElementById("todo-table");
const modal = document.getElementById("modal");
const form = document.getElementById('form');
const todoHeading = document.getElementById('todo-heading');
const completedHeading = document.getElementById('completed-heading');
var notification=null;
localStorage.getItem('todo') || localStorage.setItem('todo', JSON.stringify([]));
var label = null;
var table = null;
var isEdit =null;

var localData = JSON.parse(localStorage.getItem('todo') || []);


createTable(getTodoTask());

todoHeading.addEventListener("click", () => {
    if(!todoHeading.classList.contains('active-todo-heading')){
        createTable(getTodoTask());
        todoHeading.classList.toggle('active-todo-heading');
        completedHeading.classList.toggle('active-todo-heading');
    }
    

});

completedHeading.addEventListener("click", () => {
    if(!completedHeading.classList.contains('active-todo-heading')){
        createCompleteTable(completedTodoTask());
        todoHeading.classList.toggle('active-todo-heading');
        completedHeading.classList.toggle('active-todo-heading');
    }
    

});


newBtn.addEventListener("click", () => {
    modal.classList.toggle('modal-show');

});

cancelBtn.addEventListener("click", () => {
    form.reset();

    label && label.remove();
    form.elements[0].classList.remove('error');
    form.elements[1].classList.remove('error');
    form.elements[2].classList.remove('error');
    modal.classList.toggle('modal-show');

});
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = event.target[0].value;
    const description = event.target[1].value;
    const date = event.target[2].value;
    const fields = [event.target[0], event.target[1], event.target[2]]
    var valid = true;
    label && label.remove();
    fields.forEach((field) => {
        field.classList.remove('error');
        if (valid) {
            if (field.value.length <= 0) {
                valid = false;
                getLabel("This field is required!");
                field.classList.add('error');
                field.parentNode.insertBefore(label, field.nextSibling);
            }
        }

    });
    if (new Date(event.target[2].value).getTime()< Date.now()){
        valid = false;
        getLabel("This date is not valid!");
        event.target[2].classList.add('error');
        event.target[2].parentNode.insertBefore(label, event.target[2].nextSibling);
    }

    
    if (valid) {
        if(isEdit){
            localData[isEdit].title=title;
            localData[isEdit].description=description;
            localData[isEdit].date=date;
            isEdit=false;
        }else{
            const newdata = {
                "id": `${Math.floor(Math.random()) * 9999 + Date.now()}`,
                "title": title,
                "description": description,
                "date": date,
                "complete": false
            }
    
            localData = [...localData, newdata];

        }
        localStorage.setItem('todo', JSON.stringify(localData));
        
        form.reset();
        createTable(getTodoTask())
        modal.classList.toggle('modal-show');
        isEdit? getNotification("Todo modefied"):getNotification("New todo created!");
        setTimeout(notification.classList.add('hide-opacity'),2000);
    }


});

function createTable(data){
    table && table.remove();
    table = document.createElement('table');
    const tr = document.createElement('tr')
    tableArea.appendChild(table);
    table.appendChild(tr);
    const snTh = document.createElement('th');
    snTh.innerHTML = "S.N";
    const titleTh = document.createElement('th');
    titleTh.innerHTML = "Title";
    const descriptionTh = document.createElement('th');
    descriptionTh.innerHTML = "Description";
    const dateTh = document.createElement('th');
    dateTh.innerHTML = 'Date';
    const actionTh = document.createElement('th');
    actionTh.innerHTML = 'Action';
    tr.appendChild(snTh);
    tr.appendChild(titleTh);
    tr.appendChild(descriptionTh);
    tr.appendChild(dateTh);
    tr.appendChild(actionTh);

    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        table.appendChild(tr);

        const snTd = document.createElement('td');
        snTd.innerHTML = `${index + 1}`;
        const titleTd = document.createElement('td');
        titleTd.innerHTML = item.title;
        const descriptionTd = document.createElement('td');
        descriptionTd.innerHTML = item.description;
        const dateTd = document.createElement('td');
        dateTd.innerHTML = item.date;
        const actionTd = document.createElement('td');
        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action-div');
        const editTag = document.createElement('a');
        editTag.classList.add('edit')
        editTag.innerHTML = 'Edit';
        actionDiv.appendChild(editTag)
        const completeTag = document.createElement('a');
        completeTag.innerHTML = '&#10004;';
        actionDiv.appendChild(completeTag)

        actionTd.appendChild(actionDiv);
        tr.appendChild(snTd);
        tr.appendChild(titleTd);
        tr.appendChild(descriptionTd);
        tr.appendChild(dateTd);
        tr.appendChild(actionTd);

        editTag.addEventListener("click",(e)=>{
            form.elements[0].value =item.title;
            form.elements[1].value =item.description;
            form.elements[2].value =item.date;
            modal.classList.toggle('modal-show');
            isEdit =localData.findIndex(i=>i.id===item.id);
        });
        completeTag.addEventListener("click",(e)=>{
            const completeIndex =localData.findIndex(i=>i.id===item.id);
            localData[completeIndex].complete=true;
            localStorage.setItem('todo', JSON.stringify(localData));
            createTable(getTodoTask())

        });
    });


}

function createCompleteTable(data){
    table && table.remove();
    table = document.createElement('table');
    const tr = document.createElement('tr')
    tableArea.appendChild(table);
    table.appendChild(tr);
    const snTh = document.createElement('th');
    snTh.innerHTML = "S.N";
    const titleTh = document.createElement('th');
    titleTh.innerHTML = "Title";
    const descriptionTh = document.createElement('th');
    descriptionTh.innerHTML = "Description";
    const dateTh = document.createElement('th');
    dateTh.innerHTML = 'Date';
    const actionTh = document.createElement('th');
    actionTh.innerHTML = 'Action';
    tr.appendChild(snTh);
    tr.appendChild(titleTh);
    tr.appendChild(descriptionTh);
    tr.appendChild(dateTh);
    tr.appendChild(actionTh);


    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        table.appendChild(tr);

        const snTd = document.createElement('td');
        snTd.innerHTML = `${index + 1}`;
        const titleTd = document.createElement('td');
        titleTd.innerHTML = item.title;
        const descriptionTd = document.createElement('td');
        descriptionTd.innerHTML = item.description;
        const dateTd = document.createElement('td');
        dateTd.innerHTML = item.date;

        const actionTd = document.createElement('td');
        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action-div');
        const deleteTag = document.createElement('a');
        deleteTag.classList.add('edit')
        deleteTag.innerHTML = 'Delete';
        deleteTag.style.marginTop="8px"
        actionDiv.appendChild(deleteTag)

        tr.appendChild(snTd);
        tr.appendChild(titleTd);
        tr.appendChild(descriptionTd);
        tr.appendChild(dateTd);
        tr.appendChild(actionDiv);

        deleteTag.addEventListener("click",(e)=>{

            const deleteIndex =localData.findIndex(i=>i.id===item.id);
            if (deleteIndex > -1) { 
                localData.splice(index, 1); 
              }
            localStorage.setItem('todo', JSON.stringify(localData));
            createCompleteTable (completedTodoTask())
        });
    });
}
    function getLabel(error) {
        label = document.createElement('label');
        label.className = 'label';
        label.innerHTML = error;
    }
    function deleteTodo(index){
        if (index > -1) { 
            localData.splice(index, 1);
          }
    }
    function getTodoTask(){
        return localData.filter(item => item.complete===false);

    }
    function completedTodoTask(){
        return localData.filter(item => item.complete===true);

    }

    function getNotification(message){
        notification&& notification.remove();
        notification=document.getElementById('notification');
        notification.classList.add('notification');
        const notificationHeading=document.createElement('p');
        notificationHeading.innerHTML=message;
        notification.appendChild(notificationHeading)
    }
