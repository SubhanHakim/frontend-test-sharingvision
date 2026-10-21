import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

process.env.DB_FILE = ':memory:';
const { default: app } = await import('./app.js');

let server;
let base;
before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    base = `http://localhost:${server.address().port}/article`;
    resolve();
  });
}));
after(() => server.close());

const send = (path, method, body) =>
  fetch(base + path, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });

test('create, detail, list, update, trash, delete', async () => {
  const created = await send('/', 'POST', { title: 'Hello', content: 'World', category: 'Tech', status: 'publish' });
  assert.equal(created.status, 201);
  const { id } = await created.json();

  assert.equal((await (await send(`/${id}`)).json()).title, 'Hello');

  const list = await send('/10/0?status=publish');
  assert.equal(list.headers.get('X-Total-Count'), '1');
  assert.equal((await list.json()).length, 1);

  const trashed = await send(`/${id}`, 'PUT', { status: 'thrash' });
  assert.equal((await trashed.json()).title, 'Hello');
  assert.equal((await (await send('/10/0?status=publish')).json()).length, 0);

  const patched = await send(`/${id}`, 'PATCH', { title: 'Patched' });
  assert.equal((await patched.json()).title, 'Patched');

  assert.equal((await send(`/${id}`, 'DELETE')).status, 204);
  assert.equal((await send(`/${id}`)).status, 404);
});

test('validation rejects bad input', async () => {
  assert.equal((await send('/', 'POST', { title: '', content: 'x', category: 'y' })).status, 400);
  assert.equal((await send('/', 'POST', { title: 'a', content: 'b', category: 'c', status: 'nope' })).status, 400);
  assert.equal((await send('/abc/0')).status, 400);
});
