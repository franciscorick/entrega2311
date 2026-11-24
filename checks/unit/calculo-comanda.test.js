const { calculateTotal, buildOrder } = require('../../src/services/order-service');

describe('regras de pedido', () => {
  test('calcula total com centavos sem receber valor do cliente', () => {
    expect(calculateTotal([{ price: '4.50', quantity: 2 }, { price: '3.25', quantity: 1 }])).toBe(12.25);
  });
  test('recusa pedido sem itens', async () => {
    await expect(buildOrder({}, {}, { customerName: 'Ana', items: [] })).rejects.toMatchObject({ status: 400 });
  });
  test('recusa quantidade menor que um', async () => {
    const productRepo = { getProductsByIds: jest.fn() };
    await expect(buildOrder(productRepo, {}, { customerName: 'Ana', items: [{ productId: 1, quantity: 0 }] })).rejects.toMatchObject({ status: 400 });
  });
  test('recusa produto indisponível', async () => {
    const productRepo = { getProductsByIds: jest.fn().mockResolvedValue([{ id: 1, name: 'Suco', price: 4, available: false }]) };
    await expect(buildOrder(productRepo, {}, { customerName: 'Ana', items: [{ productId: 1, quantity: 1 }] })).rejects.toMatchObject({ status: 400 });
  });
  test('calcula e persiste o total no servidor', async () => {
    const productRepo = {
      getProductsByIds: jest.fn().mockResolvedValue([{ id: 1, name: 'Suco', price: '4.50', available: true }]),
    };
    const orderRepo = { createOrder: jest.fn(async (order) => order) };
    const result = await buildOrder(productRepo, orderRepo, { customerName: 'Ana', items: [{ productId: 1, quantity: 2 }] });
    expect(result.total).toBe(9);
    expect(orderRepo.createOrder).toHaveBeenCalledWith(expect.objectContaining({ total: 9 }));
  });
});
