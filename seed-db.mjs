import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// Redefine schemas para o script de seed
const bookCategories = mysqlTable("book_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  purchaseLink: varchar("purchaseLink", { length: 500 }),
  categoryId: int("categoryId").notNull(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  tags: text("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const techCategories = mysqlTable("tech_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const techProducts = mysqlTable("tech_products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  purchaseLink: varchar("purchaseLink", { length: 500 }),
  categoryId: int("categoryId").notNull(),
  tags: text("tags"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

const DATABASE_URL = process.env.DATABASE_URL;

async function seed() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes
    console.log('🗑️  Limpando dados existentes...');
    await db.delete(books);
    await db.delete(bookCategories);
    await db.delete(techProducts);
    await db.delete(techCategories);

    // Criar categorias de livros
    console.log('📚 Criando categorias de livros...');
    await db.insert(bookCategories).values([
      {
        name: 'Lógica de Programação',
        slug: 'logica-programacao',
        description: 'Fundamentos de lógica e algoritmos para programação',
      },
      {
        name: 'Desenvolvimento Web',
        slug: 'desenvolvimento-web',
        description: 'Tecnologias e frameworks para desenvolvimento web',
      },
      {
        name: 'Inteligência Artificial',
        slug: 'inteligencia-artificial',
        description: 'Machine Learning, Deep Learning e IA',
      },
      {
        name: 'Fundamentos do C#',
        slug: 'csharp',
        description: 'Programação em C# e .NET',
      },
      {
        name: 'Benchmarks',
        slug: 'benchmarks',
        description: 'Performance e otimização de código',
      },
    ]);

    // Criar categorias de tech
    console.log('⚙️  Criando categorias de equipamentos tech...');
    await db.insert(techCategories).values([
      {
        name: 'Teclados',
        slug: 'teclados',
        description: 'Teclados mecânicos e sem fio',
      },
      {
        name: 'Mouses',
        slug: 'mouses',
        description: 'Mouses ergonômicos e de alta precisão',
      },
      {
        name: 'Monitores',
        slug: 'monitores',
        description: 'Monitores 4K e ultrawide',
      },
      {
        name: 'Switches',
        slug: 'switches',
        description: 'Switches mecânicos para teclados',
      },
      {
        name: 'Headsets',
        slug: 'headsets',
        description: 'Fones e headsets para gaming e produtividade',
      },
    ]);

    // Criar livros
    console.log('📖 Criando livros...');
    await db.insert(books).values([
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'Um guia essencial para escrever código limpo e profissional. Robert C. Martin ensina as melhores práticas de programação.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/0132350882.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        categoryId: 1,
        difficulty: 'intermediate',
        language: 'Inglês',
        tags: JSON.stringify(['Clean Code', 'Best Practices', 'Refactoring']),
      },
      {
        title: 'Algoritmos: Teoria e Prática',
        description: 'Livro completo sobre algoritmos com análise de complexidade e estruturas de dados.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/8535236996.01.L.jpg',
        purchaseLink: 'https://www.amazon.com.br/Algoritmos-Teoria-Prática-Thomas-Cormen/dp/8535236996',
        categoryId: 1,
        difficulty: 'advanced',
        language: 'Português',
        tags: JSON.stringify(['Algoritmos', 'Estruturas de Dados', 'Complexidade']),
      },
      {
        title: 'You Don\'t Know JS Yet',
        description: 'Série completa sobre JavaScript moderno. Aprenda os conceitos fundamentais da linguagem.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08XN3LNFM.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/You-Dont-Know-JS-Yet/dp/B08XN3LNFM',
        categoryId: 2,
        difficulty: 'intermediate',
        language: 'Inglês',
        tags: JSON.stringify(['JavaScript', 'Web Development', 'ES6+']),
      },
      {
        title: 'Deep Learning',
        description: 'Guia completo sobre deep learning e redes neurais. Escrito pelos criadores do framework Keras.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/1617296864.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Deep-Learning-Adaptive-Computation-Machine/dp/1617296864',
        categoryId: 3,
        difficulty: 'advanced',
        language: 'Inglês',
        tags: JSON.stringify(['Deep Learning', 'Neural Networks', 'TensorFlow']),
      },
      {
        title: 'C# Player\'s Guide',
        description: 'Um guia divertido e interativo para aprender C# desde o zero.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B0BQSXBVVH.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/C-Players-Guide-RB-Whitaker/dp/B0BQSXBVVH',
        categoryId: 4,
        difficulty: 'beginner',
        language: 'Inglês',
        tags: JSON.stringify(['C#', '.NET', 'Game Development']),
      },
      {
        title: 'The Pragmatic Programmer',
        description: 'Dicas práticas e conselhos para se tornar um programador melhor e mais produtivo.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/0201616224.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/0201616224',
        categoryId: 5,
        difficulty: 'intermediate',
        language: 'Inglês',
        tags: JSON.stringify(['Best Practices', 'Productivity', 'Career']),
      },
    ]);

    // Criar produtos tech
    console.log('🖥️  Criando produtos tech...');
    await db.insert(techProducts).values([
      {
        name: 'Keychron K8 Pro',
        description: 'Teclado mecânico sem fio com switches hot-swap, RGB e bateria de longa duração.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B09TJGM5MZ.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Keychron-Mechanical-Wireless-Hot-swap-Switches/dp/B09TJGM5MZ',
        categoryId: 1,
        tags: JSON.stringify(['Mecânico', 'Wireless', 'Hot-swap', 'RGB']),
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Mouse ergonômico de alta precisão com múltiplos botões programáveis e conexão multi-dispositivo.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B09LW8TNHZ.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Logitech-Master-Advanced-Customization-Precision/dp/B09LW8TNHZ',
        categoryId: 2,
        tags: JSON.stringify(['Ergonômico', 'Wireless', 'Multi-dispositivo']),
      },
      {
        name: 'LG UltraWide 34" 34GP950G',
        description: 'Monitor ultrawide 3440x1440 com taxa de atualização de 160Hz, ideal para produtividade e gaming.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08DGXNZQP.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/LG-34GP950G-B-UltraWide-Nano-Cell/dp/B08DGXNZQP',
        categoryId: 3,
        tags: JSON.stringify(['Ultrawide', '160Hz', '3440x1440', 'Gaming']),
      },
      {
        name: 'Gateron Black Switches',
        description: 'Switches mecânicos lineares suaves com excelente feedback tátil. Perfeitos para digitação rápida.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08FXVHRXN.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Gateron-Mechanical-Keyboard-Switches-Lubricating/dp/B08FXVHRXN',
        categoryId: 4,
        tags: JSON.stringify(['Linear', 'Smooth', 'Gateron', 'Hot-swap']),
      },
      {
        name: 'SteelSeries Arctis Pro',
        description: 'Headset gaming profissional com som surround 7.1 e microfone de qualidade estúdio.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07YBNYMBT.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/SteelSeries-Arctis-Lossless-High-Fidelity-Headset/dp/B07YBNYMBT',
        categoryId: 5,
        tags: JSON.stringify(['Gaming', 'Surround 7.1', 'Wireless', 'Pro']),
      },
    ]);

    console.log('✅ Seed concluído com sucesso!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

seed();
