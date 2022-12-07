import { baseUrl as apiUrl } from './api.js';

// In order to append path using the URL constructor - the "baseURL" must end with a '/'
const normalized = apiUrl.endsWith('/')
  ? apiUrl
  : apiUrl + '/'

const baseUrl = new URL('todo/', normalized);

export async function add(todo) {
  const response = await fetch(new URL('add', baseUrl), {
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
  const response = await fetch(new URL(`delete/${encodeURIComponent(id)}`, baseUrl), {
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
  const response = await fetch(new URL(`update/${encodeURIComponent(id)}`, baseUrl), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todoText, isDone }),
  })

  throwIfError(response)

  return await response.json()
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