import { getAll, deleteTodo, update, add } from './server';

const todoList = document.getElementById('todo-list')
const todoText = document.getElementById('todo-text')

if (!todoList) {
  throw new Error('Could not find todo list')
}

if (!todoText) {
  throw new Error('Could not find todo text')
}

const all = await getAll()
const items = all.map(todoItem)

todoList.append(...items)

Object.assign(window, {
  addTodo: asEventHandler(async function addTodo() {
    const todoData = todoText.value
    todoText.value = ''

    const todo = await add({
      todoText: todoData,
      isDone: false,
    })

    todoList.appendChild(todoItem(todo))
  }),

  toggleCheck: asEventHandler(async function toggleCheck(ev) {
    if (ev.target.tagName === 'LI') {
      const wasChecked = ev.target.classList.contains(checked)
      const todo = todoByElement.get(ev.target)

      if (!todo) {
        throw new Error('Could not find todo data')
      }

      todo.isDone = !wasChecked
      const updatedTodo = await update(todo)
      todoByElement.set(ev.target, updatedTodo)

      ev.target.classList.toggle('checked');
    }
  }),
})

function asEventHandler(fn) {
  return function (...args) {
    Promise.resolve(fn.apply(this, args))
      .catch(err => console.error(err))
  }
}

const todoByElement = new WeakMap()

function todoItem(todo) {
  const { id, todoText, isDone } = todo

  const closeButton = document.createElement('span')
  closeButton.appendChild(document.createTextNode('\u00D7'))
  closeButton.className = 'close'
  closeButton.onclick = asEventHandler(async function removeTodo() {
    await deleteTodo(id)
    item.remove()
  })

  const item = document.createElement('li')
  item.
    item.appendChild(document.createTextNode(todoText))
  item.appendChild(closeButton)

  if (isDone) {
    item.classList.add('checked')
  }

  todoByElement.set(item, todo)

  return item
}