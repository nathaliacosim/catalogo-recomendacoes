import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { BookOpen, Zap, LogOut } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <Link href="/books" className="text-slate-600 hover:text-slate-900 font-medium">
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Catálogo de Produtos Recomendados
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Descubra os melhores livros técnicos e equipamentos de tecnologia recomendados por especialistas da área.
          </p>
        </div>

        {/* Cards de Categorias */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Livros */}
          <Link href="/books" className="block group">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Livros Técnicos</CardTitle>
                  <CardDescription>
                    Explore nossa coleção de livros sobre programação, desenvolvimento web, inteligência artificial e muito mais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>✓ Lógica de Programação</p>
                    <p>✓ Desenvolvimento Web</p>
                    <p>✓ Inteligência Artificial</p>
                    <p>✓ Fundamentos do C#</p>
                    <p>✓ Benchmarks</p>
                  </div>
                </CardContent>
              </Card>
          </Link>

          {/* Card Tech */}
          <Link href="/tech" className="block group">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Equipamentos Tech</CardTitle>
                  <CardDescription>
                    Descubra os melhores periféricos e equipamentos para potencializar sua produtividade.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>✓ Teclados</p>
                    <p>✓ Mouses</p>
                    <p>✓ Monitores</p>
                    <p>✓ Switches</p>
                    <p>✓ E muito mais</p>
                  </div>
                </CardContent>
              </Card>
          </Link>
        </div>
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
