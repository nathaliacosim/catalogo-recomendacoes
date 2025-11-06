import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { LogOut, Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Books() {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

  const { data: categories = [] } = trpc.books.categories.useQuery();
  const { data: books = [] } = trpc.books.list.useQuery({
    categoryId: selectedCategory,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/books" className="text-blue-600 font-medium">
              Livros
            </Link>
            <Link href="/tech" className="text-slate-600 hover:text-slate-900 font-medium">
              Tech
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin" className="text-slate-600 hover:text-slate-900 font-medium">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{user?.name}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => logout()}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <Button size="sm" asChild>
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Livros Técnicos Recomendados</h2>
          <p className="text-slate-600">
            Explore nossa coleção curada de livros sobre programação, desenvolvimento web, inteligência artificial e muito mais.
          </p>
        </div>

        {/* Filtros por Categoria */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === undefined ? "default" : "outline"}
              onClick={() => setSelectedCategory(undefined)}
            >
              Todas as Categorias
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid de Livros */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600 text-lg">Nenhum livro encontrado nesta categoria.</p>
            </div>
          ) : (
            books.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow flex flex-col">
                {book.imageUrl && (
                  <div className="h-48 bg-slate-200 overflow-hidden rounded-t-lg">
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-xs">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                      {book.difficulty === "beginner"
                        ? "Iniciante"
                        : book.difficulty === "intermediate"
                          ? "Intermediário"
                          : "Avançado"}
                    </span>
                    <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {book.language}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                    {book.description}
                  </p>
                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(Array.isArray(book.tags) ? book.tags : JSON.parse(book.tags || "[]" )).map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex gap-2">
                    {book.purchaseLink && (
                      <Button
                        size="sm"
                        className="flex-1 gap-2"
                        asChild
                      >
                        <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Comprar
                        </a>
                      </Button>
                    )}
                    {isAuthenticated && user?.role === "admin" && (
                      <>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {isAuthenticated && user?.role === "admin" && (
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Novo Livro
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2025 {APP_TITLE}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
