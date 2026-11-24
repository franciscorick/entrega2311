const { productSchema, orderSchema } = require('../../src/services/validation');

describe('validação de entrada', () => {
  test('aceita produto válido com preço zero', () => {
    expect(productSchema.safeParse({ name: 'Água', description: '', price: 0, category: 'Bebidas', available: true }).success).toBe(true);
  });
  test('recusa preço negativo e campos desconhecidos', () => {
    expect(productSchema.safeParse({ name: 'Água', price: -1, category: 'Bebidas', available: true }).success).toBe(false);
    expect(productSchema.safeParse({ name: 'Água', price: 1, category: 'Bebidas', extra: 'injetado' }).success).toBe(false);
  });
  test('recusa pedido sem itens e quantidade fracionada', () => {
    expect(orderSchema.safeParse({ customerName: 'Bia', items: [] }).success).toBe(false);
    expect(orderSchema.safeParse({ customerName: 'Bia', items: [{ productId: 1, quantity: 1.5 }] }).success).toBe(false);
  });
});
