# 🎯 Channel Analytics - Guia de Configuração

Este guia mostra como configurar e usar a nova funcionalidade de análise de canais do YouTube no ORYOS.

## ✨ O que foi adicionado

### Nova funcionalidade: **Channel Analytics**

Analise 10 canais do YouTube e crie um modelo híbrido único de roteiro que combina o melhor de cada canal.

**Funcionalidades:**
- ✅ Adicione até 10 canais do YouTube
- ✅ Busca automática de informações do canal (nome, thumb, inscritos)
- ✅ Análise de 5 vídeos de cada canal
- ✅ Geração de modelo híbrido que combina:
  - Estrutura de roteiro (intro, desenvolvimento, conclusão)
  - Tom e estilo (formalidade, energia, linguagem)
  - Padrões de conteúdo
  - Técnicas narrativas
- ✅ Prompt template pronto para usar em qualquer LLM
- ✅ Visualização rica com gráficos e métricas
- ✅ Export em JSON

## 📦 Arquivos Adicionados

```
src/
├── types/
│   └── analytics.ts              # Tipos TypeScript para análise
├── services/
│   └── youtube.service.ts        # Integração YouTube Data API
├── lib/
│   └── supabase.ts               # Cliente Supabase
└── components/
    └── analytics/
        ├── ChannelAnalyticsPage.tsx    # Página principal
        ├── ChannelCard.tsx              # Card de canal
        ├── AnalyticsTips.tsx            # Painel de dicas
        ├── HybridModelView.tsx          # Visualização do modelo
        └── index.ts

supabase-schema.sql               # Schema do banco de dados
```

## 🚀 Passo a Passo para Configuração

### 1. Instalar Dependências

```bash
npm install
```

A dependência `@supabase/supabase-js` já foi adicionada ao `package.json`.

### 2. Configurar Supabase

#### 2.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização (se não tiver)
3. Crie um novo projeto
4. Anote a **URL** e **Anon Key** (em Settings > API)

#### 2.2 Executar o Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `supabase-schema.sql`
4. Clique em **Run** para criar todas as tabelas

Isso criará:
- `youtube_channels` - Canais adicionados
- `youtube_videos` - Vídeos coletados
- `video_analysis` - Análise individual
- `hybrid_models` - Modelos híbridos gerados
- `analysis_jobs` - Jobs de processamento

### 3. Obter API Keys

#### 3.1 YouTube Data API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto (ou use existente)
3. Ative a **YouTube Data API v3**:
   - APIs & Services > Library
   - Busque "YouTube Data API v3"
   - Clique em "Enable"
4. Crie credenciais:
   - APIs & Services > Credentials
   - Create Credentials > API Key
   - Copie a API Key

**Quota Gratuita:** 10.000 unidades/dia (suficiente para ~100 consultas de canal)

#### 3.2 Anthropic Claude API Key (Opcional)

Para análise real de vídeos com IA:

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma conta
3. Vá em **API Keys**
4. Crie uma nova key
5. Copie a key

**Custo estimado:** ~$0.30 por análise completa (10 canais × 5 vídeos)

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# YouTube Data API
VITE_YOUTUBE_API_KEY=sua_youtube_api_key_aqui

# Anthropic Claude API (Opcional - para análise real)
VITE_ANTHROPIC_API_KEY=sua_anthropic_api_key_aqui
```

**⚠️ IMPORTANTE:** Nunca commite o arquivo `.env` no Git!

### 5. Rodar o Projeto

```bash
npm run dev
```

Acesse `http://localhost:5173` e navegue até **Analytics** no menu lateral.

## 📖 Como Usar

### Passo 1: Adicionar Canais

1. Vá para **Analytics** no menu lateral
2. Digite um nome para o modelo (ex: "Modelo Tech Reviews")
3. Cole URLs de 10 canais do YouTube:
   - Formatos aceitos:
     - `https://youtube.com/@username`
     - `https://youtube.com/channel/UC...`
     - `https://youtube.com/c/channelname`
4. Aguarde a validação automática de cada canal

### Passo 2: Gerar Modelo Híbrido

1. Quando todos os 10 canais estiverem prontos (✓ verde)
2. Clique em **Gerar Modelo Híbrido**
3. Aguarde o processamento (~15 minutos na versão real)

### Passo 3: Usar o Modelo

1. Visualize o modelo gerado com:
   - **Tom e Estilo** - métricas visuais
   - **Estrutura Híbrida** - divisão intro/desenvolvimento/conclusão
   - **Padrões** - formato, storytelling, uso de dados
   - **Técnicas** - lista de técnicas identificadas
2. Copie o **Prompt Template**
3. Use em qualquer LLM (ChatGPT, Claude, etc):

```
[Cole o prompt template]

Agora crie um roteiro sobre: "Como iniciar no YouTube em 2024"
```

4. Exporte o modelo completo em JSON se necessário

## 🎨 UI/Design

A UI foi desenvolvida seguindo o design system do ORYOS:

**Cores principais:**
- Background: `#000000`
- Cards: `#121212`
- Accent: `#D4FF8E` (verde limão)
- Accent Orange: `#FFC48E`

**Componentes:**
- Usa os mesmos components base (`Input`, `Button`, `Card`)
- Segue o mesmo padrão visual de `CloningPage`
- Layout com sidebar de dicas (como Cloning)
- Estados de loading, error e success

## 🔧 Modo de Desenvolvimento (Sem APIs)

A versão atual funciona em **modo simulação** para você testar a UI:

**O que funciona:**
- ✅ Adicionar canais (simulado)
- ✅ Validação de URL
- ✅ Geração do modelo (mock)
- ✅ Visualização completa
- ✅ Export JSON

**O que precisa de APIs configuradas:**
- ❌ Buscar informações reais do canal (precisa YouTube API)
- ❌ Análise real de vídeos (precisa Claude API + Supabase)
- ❌ Persistência de dados (precisa Supabase)

### Para testar SEM configurar nada:

1. Rode o projeto
2. Vá para Analytics
3. Cole qualquer URL (não será validada de verdade)
4. Veja a UI funcionando com dados simulados

### Para ativar funcionalidade REAL:

Configure as variáveis de ambiente conforme Passo 4.

## 🚀 Deploy (Produção)

### Opção 1: Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente no dashboard
```

### Opção 2: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Configurar variáveis no dashboard
```

**⚠️ Importante:** Configure as variáveis de ambiente no dashboard da plataforma!

## 📊 Fluxo de Dados

```
1. Usuario adiciona 10 canais
   ↓
2. YouTube Service busca info do canal
   ↓
3. Salva no Supabase (youtube_channels)
   ↓
4. Busca 5 vídeos de cada canal
   ↓
5. Salva vídeos (youtube_videos)
   ↓
6. Extrai transcrições
   ↓
7. Claude analisa cada vídeo
   ↓
8. Salva análises (video_analysis)
   ↓
9. Claude agrega 50 análises em modelo único
   ↓
10. Salva modelo híbrido (hybrid_models)
    ↓
11. Exibe para o usuário
```

## 🆘 Troubleshooting

### Erro: "YouTube API Key não configurada"

Adicione `VITE_YOUTUBE_API_KEY` no arquivo `.env`

### Erro: "Supabase client error"

Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretas

### Canais não aparecem

1. Verifique se o schema SQL foi executado no Supabase
2. Verifique RLS policies no Supabase

### Quota excedida do YouTube

A API tem limite de 10.000 unidades/dia. Cada consulta de canal usa ~5 unidades.

## 💡 Próximos Passos

**Melhorias possíveis:**
- [ ] Implementar Edge Functions para análise em background
- [ ] Adicionar cache de canais já analisados
- [ ] Permitir selecionar quais vídeos analisar
- [ ] Gráficos comparativos entre canais
- [ ] Suporte a mais plataformas (TikTok, Instagram)
- [ ] Template builder visual
- [ ] Múltiplos modelos salvos

## 📝 Notas

- A análise real com Claude pode levar 15-30 minutos para 50 vídeos
- Recomenda-se canais do mesmo nicho para modelo mais coerente
- O prompt template gerado é otimizado para Claude/GPT-4
- Todos os dados são privados por usuário (RLS habilitado)

---

**Dúvidas?** Abra uma issue no repositório ou entre em contato!
