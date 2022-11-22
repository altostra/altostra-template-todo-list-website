import { apiHost } from 'api';

const baseUrl = new URL(`https://${apiHost}/todo`);

Object.assign(window, {
  async add(todo) {
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
  },

  async deleteTodo(id) {
    const response = fetch({
      url: new URL(`delete/${encodeURIComponent(id)}`, baseUrl),
      method: 'DELETE',
    })

    throwIfError(response)
  },

  async getAll() {
    const response = await fetch(new URL('get-all', baseUrl));

    throwIfError(response)

    const todoList = response.json()

    return todoList
  },

  async update({ id, todoText, isDone }) {
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
});

function throwIfError(response) {
  if (!response.ok) {
    throw Object.assign(new Error(response.statusText), {
      status: response.status,
      statusText: response.statusText,
      response,
    })
  }
}