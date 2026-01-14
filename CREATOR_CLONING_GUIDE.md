# 🎭 Creator Cloning - Guia Completo

Sistema de clonagem de criadores do YouTube com análise profunda de estilo e geração automática de roteiros.

## 🎯 O que é Creator Cloning?

Clone o estilo único de qualquer criador do YouTube analisando seus vídeos e use para gerar infinitos roteiros mantendo o mesmo tom, trejeitos e padrões de sucesso.

## ✨ Funcionalidades

### 1. Análise de Criador
- ✅ Adicione até 10 vídeos do MESMO canal
- ✅ Transcrição automática de todos os vídeos
- ✅ Análise profunda com Claude AI:
  - **Tom de voz** (energético, calmo, profissional, etc)
  - **Trejeitos** (maneirismos verbais, expressões)
  - **Estilo de comunicação** (direto, storytelling, educacional)
  - **Vícios de linguagem** (palavras repetidas, bordões)
  - **Estrutura narrativa** (abertura, desenvolvimento, fechamento)
  - **Elementos de retenção** (cortes, loops, surpresas)
  - **Estratégias de CTR** (títulos, thumbnails, ganchos)

### 2. Perfil do Criador
- 📊 Visualização completa da análise
- 📋 Prompt template personalizado
- 💾 Salvo para reutilização

### 3. Geração de Roteiros
- 📝 Digite qualquer tema
- 🎬 Escolha o formato (YouTube, Shorts, TikTok, Reels)
- ⚡ Geração instantânea no estilo do criador
- 📑 Inclui: título, thumbnail, hook, intro, desenvolvimento, conclusão, CTA

## 🚀 Como Usar

### Passo 1: Clonar um Criador

1. Vá para **Cloning** no menu lateral
2. Digite o nome do criador (ex: "Felipe Neto", "Manual do Mundo")
3. Cole links de 3 a 10 vídeos do MESMO canal:
   ```
   https://youtube.com/watch?v=abc123
   https://youtube.com/watch?v=def456
   ...
   ```
4. Aguarde a transcrição de cada vídeo (indicador verde ✓)
5. Clique em **Clonar Criador**
6. Aguarde ~2 minutos para análise completa

### Passo 2: Ver Perfil do Criador

Após a análise, você verá:

**Tom de Voz:**
- Tom predominante: Energético
- Velocidade: Moderado
- Variação tonal: 8/10
- Palavras com ênfase: "pessoal", "super", "muito importante"

**Estilo de Comunicação:**
- Abordagem: Educacional
- Formalidade: 4/10
- Uso de humor: 7/10
- Interage com audiência: Sim

**Vícios de Linguagem:**
- Bordões: "Vamo nessa!", "É isso aí!"
- Conectores: então, tipo, mas
- Gírias: massa, dahora

**Estrutura Narrativa:**
- Abertura: Cumprimento + gancho com pergunta
- Intro: ~25 segundos
- Fechamento: Resumo + CTAs múltiplos
- CTA padrão: Like, inscrever, sininho, comentar

### Passo 3: Gerar Roteiros

1. Clique em **Gerar Roteiro**
2. Digite o tema: "Como começar no YouTube em 2024"
3. Escolha o formato: YouTube (8-15 min)
4. (Opcional) Adicione instruções: "Foque em iniciantes"
5. Clique em **Gerar Roteiro**
6. Aguarde ~10 segundos

**Resultado:**
```
TÍTULO: Como COMEÇAR no YouTube em 2024 (GUIA COMPLETO)

THUMBNAIL: Você com expressão surpresa + texto amarelo "COMEÇAR NO YOUTUBE" + seta

HOOK: Olá pessoal! Você já tentou começar no youtube e não conseguiu? Então cola aqui comigo porque hoje eu vou te mostrar o PASSO A PASSO completo que vai mudar isso!

INTRO: E aí galera, tudo bem? Bora lá pro vídeo de hoje que vai ser MUITO massa! ...

[DESENVOLVIMENTO completo com 4-5 seções]

CONCLUSÃO: E é isso aí, pessoal! Resumindo rapidinho...

CTA: Não esquece de deixar aquele LIKE, se inscrever, ativar o sininho...
```

7. Copie seções individuais ou roteiro completo

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── cloning/
│       ├── NewCloningPage.tsx         # Página principal
│       ├── VideoInputCard.tsx         # Card de input de vídeo
│       ├── CloningTips.tsx            # Painel de dicas
│       ├── CreatorProfileView.tsx     # Visualização do perfil
│       └── ScriptGenerator.tsx        # Gerador de roteiros
├── services/
│   ├── transcript.service.ts          # Transcrição de vídeos
│   └── creator-analyzer.service.ts    # Análise com Claude
└── types/
    └── cloning.ts                     # Tipos TypeScript
```

## 🎨 Fluxo Visual

```
1. Input de Vídeos
   ↓
2. Transcrição Automática (YouTube Transcript API)
   ↓
3. Análise com Claude AI
   • Tom de voz
   • Trejeitos
   • Padrões de linguagem
   • Estrutura narrativa
   ↓
4. Perfil Consolidado do Criador
   • Visualização rica
   • Prompt template gerado
   ↓
5. Geração de Roteiros
   • Digite tema
   • Escolha formato
   • Gera roteiro instantâneo
```

## 🔧 Configuração Técnica

### Variáveis de Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key

# YouTube (para buscar info de vídeos)
VITE_YOUTUBE_API_KEY=sua_youtube_key

# Claude API (para análise)
VITE_ANTHROPIC_API_KEY=sua_claude_key
```

### Schema Supabase

Execute no SQL Editor do Supabase:

```sql
-- Tabelas criadas:
- cloned_creators
- generated_scripts
- cloning_jobs
```

Ver arquivo `supabase-schema.sql` completo.

### Edge Functions

Deploy das functions:

```bash
# Transcrição
supabase functions deploy get-transcript

# Configurar secrets
supabase secrets set ANTHROPIC_API_KEY=sua_key
```

## 💡 Dicas de Uso

### Escolha dos Vídeos

**✅ BOM:**
- 5-10 vídeos do mesmo canal
- Vídeos variados de temas diferentes
- Vídeos mais recentes (último ano)
- Vídeos com bom desempenho

**❌ EVITE:**
- Misturar vídeos de canais diferentes
- Apenas 1-2 vídeos (análise imprecisa)
- Vídeos muito antigos (estilo pode ter mudado)
- Vídeos de formatos muito diferentes

### Criadores Ideais para Clonar

- **Educacionais**: Método claro e replicável
- **Tech Reviews**: Estrutura consistente
- **Vlogs**: Tom pessoal único
- **Tutoriais**: Passo a passo definido

### Temas para Gerar

Funciona bem para:
- Tutoriais (Como fazer X)
- Reviews (Análise de Y)
- Listas (Top 5 de Z)
- Comparações (X vs Y)

## ⚠️ Limitações

**Modo Simulação (sem API keys):**
- ✅ UI funciona completamente
- ✅ Fluxo de 3 steps (input → profile → generate)
- ❌ Transcrição real (usa mock)
- ❌ Análise real (usa template)
- ❌ Persistência (não salva no banco)

**Com API keys configuradas:**
- ✅ Transcrição real via YouTube Transcript
- ✅ Análise real via Claude API
- ✅ Salvo no Supabase
- ✅ Reutilizável

## 📊 Exemplo Real

**Criador:** Manual do Mundo

**Vídeos Analisados:**
1. Experiência com Mentos
2. Como fazer slime
3. Vulcão de bicarbonato
4. Foguete de garrafa PET
5. Tornado na garrafa

**Perfil Detectado:**
- Tom: Educacional energético
- Formalidade: 6/10
- Uso de exemplos: 10/10
- Bordão: "Vamos fazer ciência!"
- Estrutura: Intro rápida → Materiais → Passo a passo → Explicação científica

**Roteiro Gerado (tema: "Como fazer pilha de batata"):**
- Título: "PILHA DE BATATA funciona? Testamos e VOCÊ NÃO VAI ACREDITAR!"
- Hook: "Você sabia que dá pra fazer uma pilha usando batata?"
- Estrutura: Lista de materiais → Tutorial passo a passo → Explicação da química
- CTA: Múltiplos CTAs ao longo do vídeo

## 🚀 Próximas Funcionalidades

- [ ] Suporte a múltiplos criadores salvos
- [ ] Comparação entre criadores
- [ ] Mix de estilos (50% creator A + 50% creator B)
- [ ] Análise de métricas (views, retenção)
- [ ] Suporte a TikTok e Instagram
- [ ] Análise de voz (tom, velocidade real)
- [ ] Geração de roteiro A/B testing

## 📈 Casos de Uso

### Para Criadores de Conteúdo
- Clone seu próprio estilo para consistência
- Analise concorrentes de sucesso
- Teste novos estilos antes de gravar

### Para Agências
- Crie roteiros para clientes específicos
- Mantenha consistência entre vídeos
- Acelere produção de conteúdo

### Para Marcas
- Replique estilo de influencers parceiros
- Mantenha voz da marca consistente
- Crie conteúdo alinhado com nicho

## 🆘 Troubleshooting

### "Erro ao transcrever vídeo"
- Vídeo pode não ter legendas
- Vídeo pode ser privado/indisponível
- Tente outro vídeo do canal

### "Análise muito genérica"
- Adicione mais vídeos (mínimo 5)
- Use vídeos mais recentes
- Certifique-se de que são do mesmo canal

### "Roteiro não está no estilo"
- Refaça análise com mais vídeos
- Adicione instruções específicas no gerador
- Verifique se perfil está correto

## 📝 Feedback

Encontrou um bug ou tem uma sugestão?
Abra uma issue no GitHub!

---

**Transforme qualquer criador em um modelo reutilizável!** 🎭✨
