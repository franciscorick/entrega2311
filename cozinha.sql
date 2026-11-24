CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL CHECK (length(trim(name)) > 0),
  description VARCHAR(500) NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category VARCHAR(60) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL CHECK (length(trim(customer_name)) > 0),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'RECEBIDO'
    CHECK (status IN ('RECEBIDO','EM_PREPARO','PRONTO','ENTREGUE','CANCELADO')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  product_name VARCHAR(120) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0)
);

INSERT INTO products (name, description, price, category) VALUES
  ('Broa de milho', 'Assada cedo para servir quentinha no recreio', 4.50, 'Da fornada'),
  ('Pao de queijo recheado', 'Queijo derretido em massa leve', 6.00, 'Da fornada'),
  ('Vitamina de banana', 'Banana batida com leite bem gelado', 7.00, 'Copos frescos'),
  ('Limonada da casa', 'Limão espremido com toque de hortela', 5.50, 'Copos frescos'),
  ('Salada de frutas', 'Frutas da estação em porção individual', 6.50, 'Leves'),
  ('Mini pizza de milho', 'Massa individual com molho e queijo', 8.00, 'Leves')
ON CONFLICT DO NOTHING;
