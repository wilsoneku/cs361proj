import postgres from 'postgres';
import {crafting_table} from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedCraftingTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS crafting_methods (
      id INT NOT NULL PRIMARY KEY,
      lvl INT NOT NULL,
      product VARCHAR(255) NOT NULL,
      exp NUMERIC NOT NULL,
      exp_rate NUMERIC NOT NULL,
      required_materials TEXT NOT NULL,
      cost NUMERIC NOT NULL,
      price NUMERIC NOT NULL,
      profit NUMERIC NOT NULL,
      profit_rate NUMERIC NOT NULL
    );
  `;

  const insertedCraftingMethods = await Promise.all(
      crafting_table.map(async (crafting_table) => {
      return sql`
        INSERT INTO crafting_methods (id, lvl, product, exp, exp_rate, required_materials, cost, price, profit, profit_rate)
        VALUES (${crafting_table.id}, ${crafting_table.lvl}, ${crafting_table.product}, ${crafting_table.exp}, 
                ${crafting_table.exp_rate}, ${crafting_table.required_materials}, ${crafting_table.cost}, 
                ${crafting_table.price}, ${crafting_table.profit}, ${crafting_table.profit_rate})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedCraftingMethods;
}

export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seedCraftingTable(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

// async function seedInvoices() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//
//   await sql`
//     CREATE TABLE IF NOT EXISTS invoices (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       customer_id UUID NOT NULL,
//       amount INT NOT NULL,
//       status VARCHAR(255) NOT NULL,
//       date DATE NOT NULL
//     );
//   `;
//
//   const insertedInvoices = await Promise.all(
//     invoices.map(
//       (invoice) => sql`
//         INSERT INTO invoices (customer_id, amount, status, date)
//         VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );
//
//   return insertedInvoices;
// }
//
// async function seedCustomers() {
//   await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
//
//   await sql`
//     CREATE TABLE IF NOT EXISTS customers (
//       id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email VARCHAR(255) NOT NULL,
//       image_url VARCHAR(255) NOT NULL
//     );
//   `;
//
//   const insertedCustomers = await Promise.all(
//     customers.map(
//       (customer) => sql`
//         INSERT INTO customers (id, name, email, image_url)
//         VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
//         ON CONFLICT (id) DO NOTHING;
//       `,
//     ),
//   );
//
//   return insertedCustomers;
// }
//
// async function seedRevenue() {
//   await sql`
//     CREATE TABLE IF NOT EXISTS revenue (
//       month VARCHAR(4) NOT NULL UNIQUE,
//       revenue INT NOT NULL
//     );
//   `;
//
//   const insertedRevenue = await Promise.all(
//     revenue.map(
//       (rev) => sql`
//         INSERT INTO revenue (month, revenue)
//         VALUES (${rev.month}, ${rev.revenue})
//         ON CONFLICT (month) DO NOTHING;
//       `,
//     ),
//   );
//
//   return insertedRevenue;
// }


