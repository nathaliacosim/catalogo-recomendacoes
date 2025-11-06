# Catálogo de Produtos - TODO

## Funcionalidades Principais

### Banco de Dados
- [x] Schema para Livros (título, descrição, imagem, tags, link compra, dificuldade, idioma, categoria)
- [x] Schema para Produtos Tech (nome, descrição, imagem, tags, link compra, categoria)
- [x] Schema para Categorias de Livros (Lógica de Programação, Desenvolvimento Web, IA, C#, Benchmarks)
- [x] Schema para Categorias de Tech (Teclado, Mouse, Monitor, Switches, etc)

### Backend API
- [x] Endpoint GET para listar livros por categoria
- [x] Endpoint GET para listar produtos tech por categoria
- [x] Endpoint POST para adicionar novo livro
- [x] Endpoint POST para adicionar novo produto tech
- [x] Endpoint PUT para editar livro
- [x] Endpoint PUT para editar produto tech
- [x] Endpoint DELETE para remover livro
- [x] Endpoint DELETE para remover produto tech
- [ ] Endpoint GET para buscar livros/produtos por tags

### Frontend - Layout e Design
- [x] Design visual atraente com tema moderno
- [x] Navegação principal com seções (Livros, Tech)
- [x] Header com logo e navegação
- [x] Footer com informações

### Frontend - Seção Livros
- [x] Página de listagem de livros por categoria
- [x] Card de livro com imagem, título, descrição, tags, dificuldade, idioma
- [x] Botão de link para compra
- [x] Filtro por categoria
- [ ] Filtro por dificuldade
- [ ] Filtro por idioma
- [ ] Formulário para adicionar novo livro (admin)
- [ ] Formulário para editar livro (admin)
- [ ] Botão para deletar livro (admin)

### Frontend - Seção Tech
- [x] Página de listagem de produtos tech por categoria
- [x] Card de produto com imagem, nome, descrição, tags
- [x] Botão de link para compra
- [x] Filtro por categoria
- [ ] Formulário para adicionar novo produto (admin)
- [ ] Formulário para editar produto (admin)
- [ ] Botão para deletar produto (admin)

### Autenticação e Permissões
- [x] Apenas admin pode adicionar/editar/deletar produtos
- [x] Página de admin para gerenciar produtos

### Integração com Banco de Dados
- [x] Configurar conexão com MySQL (Drizzle ORM)
- [x] Testar operações CRUD
- [x] Popular banco com dados de exemplo

## Notas
- Usar React 19 + Tailwind 4 + Express 4 + tRPC 11
- Design responsivo e mobile-first
- Imagens armazenadas via URLs externas
- Autenticação OAuth integrada
