import { baseUrl } from './api';

const baseUrl = new URL(baseUrl, 'todo');

export async function add(todo) {
  const response = await fetch({
    url: new URL('add', baseUrl),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });

  throwIfError(response)

  const responseTodo = await response.json()

  return responseTodo
}

export async function deleteTodo(id) {
  const response = fetch({
    url: new URL(`delete/${encodeURIComponent(id)}`, baseUrl),
    method: 'DELETE',
  })

  throwIfError(response)
}

export async function getAll() {
  const response = await fetch(new URL('get-all', baseUrl));

  throwIfError(response)

  const todoList = response.json()

  return todoList
}

export async function update({ id, todoText, isDone }) {
  const response = await fetch({
    url: new URL(`update/${encodeURIComponent(id)}`),
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todoText, isDone }),
  })

  throwIfError(response)
}

function throwIfError(response) {
  if (!response.ok) {
    throw Object.assign(new Error(response.statusText), {
      status: response.status,
      statusText: response.statusText,
      response,
    })
  }
}