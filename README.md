# 📔 Meu Diário — PWA (v7.0)

Diário pessoal **offline-first** para **PC, iPad, Android e iPhone**: calendário, lembretes por voz, diário com humor, hábitos e medidas, fotos com GPS, marcação nas fotos, mapa, linha do tempo, estatísticas e **sincronização com conta (login e senha)**.

## 🆕 Novidades da v7

**Escrever com mais constância**
- **💡 Inspiração** — banco de perguntas reflexivas para destravar a escrita (botão no editor).
- **📋 Modelos** — estruturas prontas: gratidão, reflexão, viagem, sonho, treino, trabalho, metas.
- **🔥 Sequência de escrita** — conta dias seguidos escrevendo, com recorde e conquistas.

**Visualizar e entender (tela ✨ Insights)**
- **Ano em Pixels** — o ano inteiro com cada dia colorido pelo seu humor.
- **Humor × Hábitos** — descubra o que melhora seus dias.
- **Painel de escrita** — páginas, sequência, recorde, palavras e páginas por mês.

**Exportar e compartilhar**
- **Livro do diário** — exportação com capa e sumário por mês (botão 📄 no Diário → Imprimir/Salvar PDF).
- **🖼️ Card de imagem** — gere uma imagem bonita de uma página (na tela de leitura) para guardar ou compartilhar.
- **📍 Clima automático** — preenche o tempo do dia pela sua localização.

**Navegação**
- Novo menu **☰ Mais** no celular dá acesso a Insights, Hábitos, Linha do tempo, Mapa, Antes/Depois, Buscar e Lixeira.

## 🔐 Conta e sincronização (NOVO na v6 — login e senha)

Agora a sincronização usa **conta real** (e-mail + senha), com seus dados **isolados de verdade** — ninguém mais acessa, nem com o mesmo nome. A segurança é garantida pelo **RLS** do Supabase (cada conta só enxerga as próprias linhas).

**Passo único no Supabase (uma vez só):** no [supabase.com](https://supabase.com), projeto `zapjqrjjulzwnoimwaaz` → **SQL Editor → New query** → cole o conteúdo de `supabase/migrations/002_auth_login.sql` → **Run**. Isso vincula os dados à sua conta. *Não precisa mais publicar/configurar a Edge Function para sincronizar — o que, de quebra, resolve o antigo problema do "Verify JWT".*

**Dica (login imediato):** em **Authentication → Providers → Email**, você pode **desligar "Confirm email"** para entrar sem precisar clicar no link enviado por e-mail.

**Como usar:**
1. Abra o app no **notebook** → **Criar conta** (e-mail + senha). Seus dados sobem automaticamente.
2. No **outro PC** → **Entrar** com o mesmo e-mail e senha. Os dados baixam.
3. Pronto: sincronizado entre os aparelhos e **só seu**.

Quem não quiser conta pode tocar em **"Usar só neste aparelho"** — tudo fica salvo localmente, como antes.

> **Observação de escopo:** nesta versão a sincronização cobre os **registros** (textos do diário, eventos, lembretes, fotos com GPS e seus metadados/legenda). **As imagens e áudios em si continuam no aparelho** (não sobem para a nuvem); **hábitos e medidas** também ficam locais por enquanto. Dá para evoluir isso depois.

## 🔒 Privacidade e segurança
- **Conta com senha** + isolamento por usuário (RLS) — o nível mais seguro do app.
- **PIN, biometria e auto-bloqueio** protegem a abertura no aparelho.
- **Cadernos privados** ficam ocultos até desbloquear.
- A **chave anon** do Supabase aparece no código (site público) — isso é normal e seguro; o que protege os dados é o login + RLS.

## ✨ Recursos (v1–v6)
Calendário com marcadores · voz com transcrição e data falada · lembretes recorrentes · fotos com GPS + endereço + mapa · diário com texto/foto/áudio · humor · "Neste dia" · tags · busca · linha do tempo · modo leitura · markdown · seleção em massa · tema claro/escuro · **personalização (cor, fonte, primeiro dia da semana, auto-bloqueio)** · edição · lixeira (30 dias) · estatísticas de hábito · cadernos (inclusive privados) · favoritos · **hábitos & medidas** · **marcação em fotos** · **antes/depois** · anexos (arquivo/vídeo) · OCR · backup (rápido e completo) · atalhos do app · compartilhar para o diário · **layout responsivo (PC/iPad/celular)** · **conta com login e senha**.

## 🚀 Publicado
App no ar em **https://luigileao.github.io/Di-rio/** (deploy automático a cada atualização).

**Instalar:** Android/PC (Chrome) → *Instalar app*. iPhone/iPad (Safari) → *Adicionar à Tela de Início*.

## 🔧 Atualizar
Ao mudar arquivos, suba o cache em `sw.js` (`diario-v6-0` → `v6-1`) e o `?v=` no `manifest.json`.

## 📂 Estrutura
```
index.html · sw.js · manifest.json · netlify.toml · README.md
icons/ · .github/workflows/
supabase/migrations/001_initial.sql
supabase/migrations/002_auth_login.sql   ← rode este no SQL Editor
supabase/functions/diario-sync/index.ts  (não é mais necessário para o sync na v6)
```
