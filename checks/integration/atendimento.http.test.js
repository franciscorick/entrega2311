const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/db');

describe('fluxo da API no PostgreSQL real', () => {
  const token = `Teste-${Date.now()}`;
  let productId;
  let orderId;

  afterAll(async () => {
    if (orderId) await pool.query('DELETE FROM orders WHERE id=$1', [orderId]);
    if (productId) await pool.query('DELETE FROM products WHERE id=$1', [productId]);
    await pool.end();
  });

  test('saúde confirma banco conectado', async () => {
    const response = await request(app).get('/health').expect(200);
    expect(response.body.database).toBe('connected');
  });

  test('cria produto, pedido, muda status, consulta, cancela e cobre erros', async () => {
    const created = await request(app).post('/api/products').send({ name: token, description: 'Produto de teste', price: 6.25, category: 'Teste', available: true }).expect(201);
    productId = created.body.id;
    const rejectedProduct = await request(app).post('/api/products').send({ name: 'Inválido', price: -2, category: 'Teste' }).expect(400);
    expect(rejectedProduct.body.error).toBeDefined();

    const order = await request(app).post('/api/orders').send({ customerName: token, items: [{ productId, quantity: 2 }] }).expect(201);
    orderId = order.body.id;
    expect(Number(order.body.total)).toBe(12.5);
    await request(app).patch(`/api/orders/${orderId}/status`).send({ status: 'EM_PREPARO' }).expect(200);
    await request(app).get(`/api/orders/${orderId}`).expect(200).expect(({ body }) => expect(body.status).toBe('EM_PREPARO'));
    await request(app).patch(`/api/orders/${orderId}/status`).send({ status: 'CANCELADO' }).expect(200);
    await request(app).get('/api/orders').expect(200).expect(({ body }) => expect(body.some((item) => item.id === orderId)).toBe(true));
    await request(app).post('/api/orders').send({ customerName: token, items: [] }).expect(400);
    await request(app).get('/api/orders/99999999').expect(404);
    await request(app).patch('/api/orders/99999999/status').send({ status: 'PRONTO' }).expect(404);
  });

  test('não cria pedido com produto indisponível', async () => {
    const response = await request(app).post('/api/products').send({ name: `${token}-indisponível`, description: '', price: 2, category: 'Teste', available: false }).expect(201);
    const result = await request(app).post('/api/orders').send({ customerName: token, items: [{ productId: response.body.id, quantity: 1 }] }).expect(400);
    expect(result.body.error).toMatch(/indisponível/i);
    await pool.query('DELETE FROM products WHERE id=$1', [response.body.id]);
  });
});
