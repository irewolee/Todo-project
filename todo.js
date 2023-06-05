window.addEventListener("load", () => Run())

let itemIndex = 0;

// get html refs
let textInput = document.querySelector(".text-input")
let saveBtn = document.querySelector(".save-btn")
let todoParent = document.querySelector(".todo-parent")
let deleteAll = document.querySelector(".delete-btn")
let clearBtn = document.querySelector(".clear-btn")


let todoItem = {
    id: 0,
    text: "",
    isCompleted: false
};

// Function Definations Region
function Run() {
    Setup();
    let items = LoadFromStore();
    DisplayTodos(items, todoParent);
}

function AddOrCreate(ev) {
    let items = LoadFromStore()
    todoItem.text = textInput.value
    if (textInput.value.trim() === "") {
        alert("Please enter a value");
        return;
      }      
    todoItem.id = new Date().getTime() // let use epoch time as id
    items.push(todoItem)
    textInput.value = ""
    SaveToStore(items)
}


function LoadFromStore() {
    var items = JSON.parse(localStorage.getItem("todos"))
    if (!items) return []
    return items;
}

function SaveToStore(items) {
    localStorage.setItem("todos", JSON.stringify(items))
    DisplayTodos(items, todoParent)
}

   function RemoveItem(id) {
    let items = LoadFromStore()
    let filteredItems = items.filter(item => item.id !== id)
    items = filteredItems
    SaveToStore(items)
}


   function ToggleCompletedState(ev, id) {
    let todos = LoadFromStore()
    let filteredTodos = todos.filter(todo => todo.id == id)
    filteredTodos[0].isCompleted = ev.target.checked
    SaveToStore(todos)
}


function DisplayTodos(items, parent) {
    parent.innerHTML = null //clears screen before rendering 

    items.forEach(element => {
        let newTodoEl = document.createElement("li");
        let div = document.createElement("div")
        let subdiv = document.createElement('div')
        let tdtext = document.createElement("span")
        let checkbox = document.createElement("input")
        let removeBtn = document.createElement("button")

        subdiv.classList.add("sub-div")
        div.classList.add("flex")
        checkbox.classList.add("checkboxed")

        tdtext.innerText = element.text
        if (element.isCompleted) {
            tdtext.classList.add("mark-done")
        }

        checkbox.type = "checkbox"
        checkbox.checked = element.isCompleted
        checkbox.addEventListener('change', function (ev) { ToggleCompletedState(ev, element.id) }) // Todo

        removeBtn.innerText = "x"
        removeBtn.addEventListener('click', function (ev) { RemoveItem(element.id) })

        div.appendChild(checkbox);
        div.appendChild(tdtext);
        subdiv.appendChild(removeBtn);
        div.appendChild(subdiv);

        div.setAttribute("todo-id", element.id)
        div.addEventListener("drop", (ev) => drop(ev))

        newTodoEl.contentEditable = "true";
        newTodoEl.draggable = true
        newTodoEl.appendChild(div)
        newTodoEl.addEventListener("dragover", (ev) => allowDrop(ev))
        newTodoEl.addEventListener("dragstart", (ev) => drag(ev, element.id))

        parent.appendChild(newTodoEl)

    });
}

 function ClearDoneTodos() {
    let items = LoadFromStore()
    let filteredItems = items.filter(todo => !todo.isCompleted)
    SaveToStore(filteredItems)
}


function DeleteAllTodos() {
    localStorage.setItem("todos", JSON.stringify([]))
    window.location.reload()
}

function Setup() {
    saveBtn.onclick = AddOrCreate
    clearBtn.onclick = ClearDoneTodos
    deleteAll.onclick = DeleteAllTodos
}

var entke= document.getElementById("tdtext");
entke.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        document.getElementById("save-bttn").click();
    
    }});

// for drag and drop

function swap(src, dest, items) {
    let srcTodo = null;
    let srcIndex = 0;
    let destTodo = null;
    let destIndex = 0;

    // find and swap algorithm (bruteforce)
    for (let index = 0; index < items.length; index++) {
        const todo = items[index];
        if (todo.id == src) {
            srcTodo = todo
            srcIndex = index
        }
        if (todo.id == dest) {
            destTodo = todo
            destIndex = index
        }

    }
    items[srcIndex] = destTodo
    items[destIndex] = srcTodo

    SaveToStore(items)
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev, id) {
    ev.dataTransfer.setData("text", id);
}

function drop(ev) {
    ev.preventDefault();
    var src = ev.dataTransfer.getData("text");
    var dest = ev.target.getAttribute("todo-id")
    console.log(dest)

    if (dest && src) {// fixes drag and drop issues
        swap(+src, +dest, LoadFromStore())
    }
}