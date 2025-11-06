import mongoose, { Schema, Document } from 'mongoose';

// Conectar ao MongoDB
export async function connectMongoDB() {
  const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/catalogo-produtos';
  
  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

// ============ INTERFACES ============

export interface IBookCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBook extends Document {
  title: string;
  description?: string;
  imageUrl?: string;
  purchaseLink?: string;
  categoryId: mongoose.Types.ObjectId;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITechCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITechProduct extends Document {
  name: string;
  description?: string;
  imageUrl?: string;
  purchaseLink?: string;
  categoryId: mongoose.Types.ObjectId;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  openId: string;
  name?: string;
  email?: string;
  loginMethod?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
}

// ============ SCHEMAS ============

const BookCategorySchema = new Schema<IBookCategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

const BookSchema = new Schema<IBook>(
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

const TechCategorySchema = new Schema<ITechCategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
  },
  { timestamps: true }
);

const TechProductSchema = new Schema<ITechProduct>(
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

const UserSchema = new Schema<IUser>(
  {
    openId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    loginMethod: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    lastSignedIn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ============ MODELS ============

export const BookCategory = mongoose.model<IBookCategory>('BookCategory', BookCategorySchema);
export const Book = mongoose.model<IBook>('Book', BookSchema);
export const TechCategory = mongoose.model<ITechCategory>('TechCategory', TechCategorySchema);
export const TechProduct = mongoose.model<ITechProduct>('TechProduct', TechProductSchema);
export const User = mongoose.model<IUser>('User', UserSchema);
