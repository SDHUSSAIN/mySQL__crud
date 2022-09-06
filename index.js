document.addEventListener('DOMContentLoaded',function(){
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

const addBtn = document.querySelector('#add-name-btn');

document.querySelector("table tbody").addEventListener('click',function(event){
    if(event.target.className==="delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className==="edit-row-btn"){
        editRowById(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function (){
    const searchValue = document.querySelector("#search-input").value ;

    fetch('http://localhost:5000/search/'+ searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

    searchValue = "";


}

function deleteRowById(id){
    fetch("http://localhost:5000/delete/" + id,{
        method:"DELETE"
    })
    .then(response => response.json())
    .then(data=>{
        if(data.success === true){
            location.reload();
        }
    });
    // fetch('http://localhost:5000/getAll')
    // .then(response => response.json())
    // .then(data => loadHTMLTable(data['data']));
}

function editRowById(id){
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id ;

}

updateBtn.onclick = function (){
    const updatedName = document.querySelector("#update-name-input");
    // console.log(updateBtn.dataset.id);
    fetch('http://localhost:5000/update',{
        method:"PATCH",
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({
            id:updateBtn.dataset.id,
            name:updatedName.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    })

}

addBtn.onclick = function(){
    const nameInput = document.querySelector("#name-input");
    const name = nameInput.value;
    if(name===""){
        alert("Please enter name");
        return;
    }
    nameInput.value = "";

    fetch("http://localhost:5000/insert",{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body: JSON.stringify({name:name})
    })
    .then(response =>response.json())
    .then(data => insertRowIntoTable(data['data']))
}

function insertRowIntoTable(data){
    const table = document.querySelector("table tbody");
    const isTableData = table.querySelector('.no-data');
    
    let tableHtml = "<tr>";
    tableHtml+=`<td>${data.id}</td>`;
    tableHtml+=`<td>${data.name}</td>`;
    tableHtml+=`<td>${new Date(data.created_at).toLocaleString()}</td>`;
    tableHtml+=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml+=`<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;  
    tableHtml+= "</tr>";

    if(isTableData){
        table.innerHTML = tableHtml;
    }else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }

}

function loadHTMLTable(data){
    const table = document.querySelector("table tbody");
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'> No Data Found</td></tr>" ;
        return;
    }

    let  tableHtml = "";
    data.forEach(({id,name,created_at}) => {
        tableHtml+="<tr>";
        tableHtml+=`<td>${id}</td>`;
        tableHtml+=`<td>${name}</td>`;
        tableHtml+=`<td>${new Date(created_at).toLocaleString()}</td>`;
        tableHtml+=`<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml+=`<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml+="<tr/>";
        
    });

    table.innerHTML = tableHtml;
    

}