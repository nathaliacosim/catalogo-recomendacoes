import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE, APP_LOGO } from "@/const";
import { toast } from "sonner";

export default function Admin() {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem("admin-token"));
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"books" | "tech">("books");
  const [openDialog, setOpenDialog] = useState(false);
  
  // Queries
  const { data: bookCategories = [] } = trpc.books.categories.useQuery();
  const { data: books = [] } = trpc.books.list.useQuery({});
  const { data: techCategories = [] } = trpc.tech.categories.useQuery();
  const { data: techProducts = [] } = trpc.tech.list.useQuery({});

  // Mutations
  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      setAdminToken(data.token);
      localStorage.setItem("admin-token", data.token);
      setPassword("");
      toast.success("Login realizado com sucesso!");
    },
    onError: (error) => {
      toast.error("Senha incorreta!");
    },
  });

  const deleteBookMutation = trpc.books.delete.useMutation({
    onSuccess: () => {
      toast.success("Livro deletado!");
    },
  });

  const deleteTechMutation = trpc.tech.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto deletado!");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ password });
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("admin-token");
    toast.success("Logout realizado!");
  };

  if (!adminToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Admin</CardTitle>
            <CardDescription>Digite a senha para acessar o painel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>
              <p className="text-xs text-slate-500 text-center mt-2">
                Senha padrão: admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <h1 className="text-2xl font-bold text-slate-900">{APP_TITLE}</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/books" className="text-slate-600 hover:text-slate-900 font-medium">
              Livros
            </Link>
            <Link href="/tech" className="text-slate-600 hover:text-slate-900 font-medium">
              Tech
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Painel Administrativo</h2>
          <p className="text-slate-600">Gerenciar livros e produtos tech</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={tab === "books" ? "default" : "outline"}
            onClick={() => setTab("books")}
          >
            Livros
          </Button>
          <Button
            variant={tab === "tech" ? "default" : "outline"}
            onClick={() => setTab("tech")}
          >
            Tech
          </Button>
        </div>

        {/* Livros Tab */}
        {tab === "books" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Livros ({books.length})</h3>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Livro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Livro</DialogTitle>
                  </DialogHeader>
                  <BookForm categories={bookCategories} onSuccess={() => setOpenDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {books.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-slate-600">Nenhum livro cadastrado.</p>
                  </CardContent>
                </Card>
              ) : (
                books.map((book: any) => (
                  <Card key={book._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{book.title}</CardTitle>
                          <CardDescription>{book.language} • {book.difficulty}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => deleteBookMutation.mutate(book._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-2">{book.description}</p>
                      {book.tags && book.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(book.tags) ? book.tags : JSON.parse(book.tags || "[]")).map((tag: string, idx: number) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tech Tab */}
        {tab === "tech" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">Produtos Tech ({techProducts.length})</h3>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Produto Tech</DialogTitle>
                  </DialogHeader>
                  <TechForm categories={techCategories} onSuccess={() => setOpenDialog(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {techProducts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-slate-600">Nenhum produto cadastrado.</p>
                  </CardContent>
                </Card>
              ) : (
                techProducts.map((product: any) => (
                  <Card key={product._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>Equipamento</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => deleteTechMutation.mutate(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 mb-2">{product.description}</p>
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(product.tags) ? product.tags : JSON.parse(product.tags || "[]")).map((tag: string, idx: number) => (
                            <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BookForm({ categories, onSuccess }: { categories: any[]; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    purchaseLink: "",
    categoryId: "",
    difficulty: "intermediate",
    language: "Português",
    tags: "",
  });

  const createMutation = trpc.books.create.useMutation({
    onSuccess: () => {
      toast.success("Livro adicionado com sucesso!");
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }
    createMutation.mutate({
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
    } as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Título *"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Textarea
        placeholder="Descrição"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Input
        placeholder="URL da Imagem"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
      />
      <Input
        placeholder="Link de Compra"
        value={formData.purchaseLink}
        onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
      />
      <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria *" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Dificuldade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Iniciante</SelectItem>
          <SelectItem value="intermediate">Intermediário</SelectItem>
          <SelectItem value="advanced">Avançado</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Idioma"
        value={formData.language}
        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
      />
      <Input
        placeholder="Tags (separadas por vírgula)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
      />
      <Button type="submit" className="w-full" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Salvando..." : "Salvar Livro"}
      </Button>
    </form>
  );
}

function TechForm({ categories, onSuccess }: { categories: any[]; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    purchaseLink: "",
    categoryId: "",
    tags: "",
  });

  const createMutation = trpc.tech.create.useMutation({
    onSuccess: () => {
      toast.success("Produto adicionado com sucesso!");
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) {
      toast.error("Preencha os campos obrigatórios!");
      return;
    }
    createMutation.mutate({
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
    } as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nome do Produto *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Textarea
        placeholder="Descrição"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Input
        placeholder="URL da Imagem"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
      />
      <Input
        placeholder="Link de Compra"
        value={formData.purchaseLink}
        onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
      />
      <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria *" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat._id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Tags (separadas por vírgula)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
      />
      <Button type="submit" className="w-full" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Salvando..." : "Salvar Produto"}
      </Button>
    </form>
  );
}