import { getAll, deleteTodo, update, add } from './server.js';

let todoList
let todoInput

export async function loadAll() {
  todoList = document.getElementById('todo-list')
  todoInput = document.getElementById('todo-text')

  if (!todoList) {
    throw new Error('Could not find todo list')
  }

  if (!todoInput) {
    throw new Error('Could not find todo text')
  }

  const all = await getAll()
  const items = all.map(todoItem)
  todoList.append(...items)
}

export const addTodo = asEventHandler(async function addTodo() {
  const todoText = todoInput.value
  todoInput.value = ''
  document.querySelector('.add-btn').disabled = true

  const todo = await add({
    todoText,
    isDone: false,
  })
  todoList.appendChild(todoItem(todo))
})

export function onKeyUp() {
  document.querySelector('.add-btn').disabled = !todoInput.value.length
}

function asEventHandler(fn) {
  return function (...args) {
    Promise.resolve(fn.apply(this, args))
      .catch(err => console.error(err))
  }
}

const todoByElement = new Map()

function todoItem(todo) {
  const { id, todoText, isDone } = todo

  const closeButton = document.createElement('span')
  closeButton.appendChild(document.createTextNode('\u00D7'))
  closeButton.className = 'close'
  closeButton.onclick = asEventHandler(async function removeTodo(event) {
    await deleteTodo(id);
    item.remove();
    event.stopPropagation();
  })

  const checkbox = document.createElement('input')
  checkbox.type = "checkbox";
  checkbox.value = todoText;
  checkbox.name = todoText;
  checkbox.id = id;
  if (isDone) {
    checkbox.checked = true;
  }


  const label = document.createElement('label')
  label.htmlFor = id;
  label.appendChild(document.createTextNode(todoText));

  const item = document.createElement('li')

  item.appendChild(checkbox)
  item.appendChild(label)
  item.appendChild(closeButton)

  item.onclick = asEventHandler(async function toggleCheck() {
    const todo = todoByElement.get(id)

    if (!todo) {
      throw new Error('Could not find todo data')
    }

    todo.isDone = !todo.isDone
    const updatedTodo = await update(todo)
    todoByElement.set(id, updatedTodo)
    item.children[0].toggleAttribute('checked');
  })

  todoByElement.set(id, todo)

  return item
}