import { 
  Book, 
  BookCategory, 
  TechProduct, 
  TechCategory, 
  User,
  IBook,
  IBookCategory,
  ITechProduct,
  ITechCategory,
  IUser
} from './mongodb';
import { ENV } from './_core/env';

// ============ USER OPERATIONS ============

export async function upsertUser(user: Partial<IUser>): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  try {
    const existingUser = await User.findOne({ openId: user.openId });
    
    if (existingUser) {
      // Update existing user
      Object.assign(existingUser, {
        name: user.name ?? existingUser.name,
        email: user.email ?? existingUser.email,
        loginMethod: user.loginMethod ?? existingUser.loginMethod,
        lastSignedIn: new Date(),
      });
      await existingUser.save();
    } else {
      // Create new user
      const newUser = new User({
        openId: user.openId,
        name: user.name,
        email: user.email,
        loginMethod: user.loginMethod,
        role: user.openId === ENV.ownerOpenId ? 'admin' : 'user',
        lastSignedIn: new Date(),
      });
      await newUser.save();
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<IUser | null> {
  try {
    return await User.findOne({ openId });
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    return null;
  }
}

// ============ BOOK CATEGORY OPERATIONS ============

export async function getBookCategories(): Promise<IBookCategory[]> {
  try {
    return await BookCategory.find().sort({ name: 1 });
  } catch (error) {
    console.error("[Database] Failed to get book categories:", error);
    return [];
  }
}

export async function createBookCategory(data: Partial<IBookCategory>): Promise<IBookCategory> {
  try {
    const category = new BookCategory(data);
    return await category.save();
  } catch (error) {
    console.error("[Database] Failed to create book category:", error);
    throw error;
  }
}

// ============ BOOK OPERATIONS ============

export async function getBooks(categoryId?: string): Promise<IBook[]> {
  try {
    let query = Book.find();
    if (categoryId) {
      query = query.where('categoryId').equals(categoryId);
    }
    return await query.sort({ createdAt: -1 });
  } catch (error) {
    console.error("[Database] Failed to get books:", error);
    return [];
  }
}

export async function getBookById(id: string): Promise<IBook | null> {
  try {
    return await Book.findById(id);
  } catch (error) {
    console.error("[Database] Failed to get book:", error);
    return null;
  }
}

export async function createBook(data: Partial<IBook>): Promise<IBook> {
  try {
    const book = new Book(data);
    return await book.save();
  } catch (error) {
    console.error("[Database] Failed to create book:", error);
    throw error;
  }
}

export async function updateBook(id: string, data: Partial<IBook>): Promise<IBook | null> {
  try {
    return await Book.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("[Database] Failed to update book:", error);
    throw error;
  }
}

export async function deleteBook(id: string): Promise<void> {
  try {
    await Book.findByIdAndDelete(id);
  } catch (error) {
    console.error("[Database] Failed to delete book:", error);
    throw error;
  }
}

// ============ TECH CATEGORY OPERATIONS ============

export async function getTechCategories(): Promise<ITechCategory[]> {
  try {
    return await TechCategory.find().sort({ name: 1 });
  } catch (error) {
    console.error("[Database] Failed to get tech categories:", error);
    return [];
  }
}

export async function createTechCategory(data: Partial<ITechCategory>): Promise<ITechCategory> {
  try {
    const category = new TechCategory(data);
    return await category.save();
  } catch (error) {
    console.error("[Database] Failed to create tech category:", error);
    throw error;
  }
}

// ============ TECH PRODUCT OPERATIONS ============

export async function getTechProducts(categoryId?: string): Promise<ITechProduct[]> {
  try {
    let query = TechProduct.find();
    if (categoryId) {
      query = query.where('categoryId').equals(categoryId);
    }
    return await query.sort({ createdAt: -1 });
  } catch (error) {
    console.error("[Database] Failed to get tech products:", error);
    return [];
  }
}

export async function getTechProductById(id: string): Promise<ITechProduct | null> {
  try {
    return await TechProduct.findById(id);
  } catch (error) {
    console.error("[Database] Failed to get tech product:", error);
    return null;
  }
}

export async function createTechProduct(data: Partial<ITechProduct>): Promise<ITechProduct> {
  try {
    const product = new TechProduct(data);
    return await product.save();
  } catch (error) {
    console.error("[Database] Failed to create tech product:", error);
    throw error;
  }
}

export async function updateTechProduct(id: string, data: Partial<ITechProduct>): Promise<ITechProduct | null> {
  try {
    return await TechProduct.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("[Database] Failed to update tech product:", error);
    throw error;
  }
}

export async function deleteTechProduct(id: string): Promise<void> {
  try {
    await TechProduct.findByIdAndDelete(id);
  } catch (error) {
    console.error("[Database] Failed to delete tech product:", error);
    throw error;
  }
}
