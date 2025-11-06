import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carregar .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error('❌ ERRO: MONGODB_URL não está definida no .env.local');
  console.error('Configure o arquivo .env.local com sua connection string do MongoDB Atlas');
  process.exit(1);
}

// Define schemas
const BookCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    purchaseLink: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'BookCategory', required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    language: { type: String, required: true },
    tags: [String],
  },
  { timestamps: true }
);

const TechCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

const TechProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    imageUrl: String,
    purchaseLink: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'TechCategory', required: true },
    tags: [String],
  },
  { timestamps: true }
);

// Create models
const BookCategory = mongoose.model('BookCategory', BookCategorySchema);
const Book = mongoose.model('Book', BookSchema);
const TechCategory = mongoose.model('TechCategory', TechCategorySchema);
const TechProduct = mongoose.model('TechProduct', TechProductSchema);

async function seed() {
  try {
    console.log('🌱 Conectando ao MongoDB Atlas...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Conectado ao MongoDB Atlas');

    console.log('🗑️  Limpando dados existentes...');
    await Book.deleteMany({});
    await BookCategory.deleteMany({});
    await TechProduct.deleteMany({});
    await TechCategory.deleteMany({});

    console.log('📚 Criando categorias de livros...');
    const bookCats = await BookCategory.insertMany([
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

    console.log('⚙️  Criando categorias de equipamentos tech...');
    const techCats = await TechCategory.insertMany([
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

    console.log('📖 Criando livros...');
    await Book.insertMany([
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'Um guia essencial para escrever código limpo e profissional. Robert C. Martin ensina as melhores práticas de programação.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/0132350882.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
        categoryId: bookCats[0]._id,
        difficulty: 'intermediate',
        language: 'Inglês',
        tags: ['Clean Code', 'Best Practices', 'Refactoring'],
      },
      {
        title: 'Algoritmos: Teoria e Prática',
        description: 'Livro completo sobre algoritmos com análise de complexidade e estruturas de dados.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/8535236996.01.L.jpg',
        purchaseLink: 'https://www.amazon.com.br/Algoritmos-Teoria-Prática-Thomas-Cormen/dp/8535236996',
        categoryId: bookCats[0]._id,
        difficulty: 'advanced',
        language: 'Português',
        tags: ['Algoritmos', 'Estruturas de Dados', 'Complexidade'],
      },
      {
        title: 'You Don\'t Know JS Yet',
        description: 'Série completa sobre JavaScript moderno. Aprenda os conceitos fundamentais da linguagem.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08XN3LNFM.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/You-Dont-Know-JS-Yet/dp/B08XN3LNFM',
        categoryId: bookCats[1]._id,
        difficulty: 'intermediate',
        language: 'Inglês',
        tags: ['JavaScript', 'Web Development', 'ES6+'],
      },
      {
        title: 'Deep Learning',
        description: 'Guia completo sobre deep learning e redes neurais. Escrito pelos criadores do framework Keras.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/1617296864.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Deep-Learning-Adaptive-Computation-Machine/dp/1617296864',
        categoryId: bookCats[2]._id,
        difficulty: 'advanced',
        language: 'Inglês',
        tags: ['Deep Learning', 'Neural Networks', 'TensorFlow'],
      },
      {
        title: 'C# Player\'s Guide',
        description: 'Um guia divertido e interativo para aprender C# desde o zero.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B0BQSXBVVH.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/C-Players-Guide-RB-Whitaker/dp/B0BQSXBVVH',
        categoryId: bookCats[3]._id,
        difficulty: 'beginner',
        language: 'Inglês',
        tags: ['C#', '.NET', 'Game Development'],
      },
      {
        title: 'The Pragmatic Programmer',
        description: 'Dicas práticas e conselhos para se tornar um programador melhor e mais produtivo.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/0201616224.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/0201616224',
        categoryId: bookCats[4]._id,
        difficulty: 'intermediate',
        language: 'Inglês',
        tags: ['Best Practices', 'Productivity', 'Career'],
      },
    ]);

    console.log('🖥️  Criando produtos tech...');
    await TechProduct.insertMany([
      {
        name: 'Keychron K8 Pro',
        description: 'Teclado mecânico sem fio com switches hot-swap, RGB e bateria de longa duração.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B09TJGM5MZ.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Keychron-Mechanical-Wireless-Hot-swap-Switches/dp/B09TJGM5MZ',
        categoryId: techCats[0]._id,
        tags: ['Mecânico', 'Wireless', 'Hot-swap', 'RGB'],
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Mouse ergonômico de alta precisão com múltiplos botões programáveis e conexão multi-dispositivo.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B09LW8TNHZ.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Logitech-Master-Advanced-Customization-Precision/dp/B09LW8TNHZ',
        categoryId: techCats[1]._id,
        tags: ['Ergonômico', 'Wireless', 'Multi-dispositivo'],
      },
      {
        name: 'LG UltraWide 34" 34GP950G',
        description: 'Monitor ultrawide 3440x1440 com taxa de atualização de 160Hz, ideal para produtividade e gaming.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08DGXNZQP.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/LG-34GP950G-B-UltraWide-Nano-Cell/dp/B08DGXNZQP',
        categoryId: techCats[2]._id,
        tags: ['Ultrawide', '160Hz', '3440x1440', 'Gaming'],
      },
      {
        name: 'Gateron Black Switches',
        description: 'Switches mecânicos lineares suaves com excelente feedback tátil. Perfeitos para digitação rápida.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B08FXVHRXN.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/Gateron-Mechanical-Keyboard-Switches-Lubricating/dp/B08FXVHRXN',
        categoryId: techCats[3]._id,
        tags: ['Linear', 'Smooth', 'Gateron', 'Hot-swap'],
      },
      {
        name: 'SteelSeries Arctis Pro',
        description: 'Headset gaming profissional com som surround 7.1 e microfone de qualidade estúdio.',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/P/B07YBNYMBT.01.L.jpg',
        purchaseLink: 'https://www.amazon.com/SteelSeries-Arctis-Lossless-High-Fidelity-Headset/dp/B07YBNYMBT',
        categoryId: techCats[4]._id,
        tags: ['Gaming', 'Surround 7.1', 'Wireless', 'Pro'],
      },
    ]);

    console.log('✅ Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

seed();