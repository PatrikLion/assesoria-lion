# Site Lion Mídias — Assessoria Comercial

## Projeto
Site institucional de uma empresa de assessoria em vendas/marketing (Lion Mídias). Objetivo: converter visitantes em leads via modal de diagnóstico gratuito (WhatsApp/email).

**Stack:** HTML + CSS Vanilla + JS puro. Fonte: `Outfit` (Google Fonts). Sem frameworks, sem bibliotecas externas.

---

## Arquivos
- `index.html` — página única (single-page)
- `style.css` — todos os estilos
- `script.js` — interações (navbar, modal, FAQ, slider, counters, reveals)
- `assets/` — imagens e vídeos
- `DESIGN.md` — design system completo (consultar antes de qualquer mudança visual)

---

## Seções (ordem no HTML)
1. `navbar` — pílula flutuante, ativa glass após scroll > 60px
2. `#home` `.hero` — headline + stats + CTA
3. `.logos-section` — carrossel de logos (infinito, CSS)
4. `.problema-section` — seção problema com vídeo/imagem de fundo
5. `.causa-section` — causas do problema
6. `.solucao-section` — solução (pilares em double-bezel)
7. `.entrega-section` — o que está incluso
8. `.fit-section` — para quem é / não é
9. `.depoimentos-section` — slider de depoimentos
10. `.garantia-section` — garantia
11. `#cta-final` — CTA final
12. `.faq-section` — FAQ accordion
13. `#modalOverlay` — modal de captura de leads (form + WhatsApp)

---

## Design System (resumo — ver DESIGN.md para detalhes)

**Cores:**
- Fundo principal: `#060606` (nunca `#000000`)
- Texto: `#e8e4dc` (nunca `#ffffff`)
- Acento único: Lion Gold `#C9A84C` / hover `#E2C06E`
- Superfícies: `#0d0d0d`, `#131313`, `#1a1a1a`

**Fonte:** `Outfit` exclusivamente. Banido: `Inter`, serifas.

**Padrão de card:** Double Bezel (shell externo + core interno com border-radius diferente).

**Botão CTA:** pílula com ícone de seta em círculo interno aninhado.

---

## Regras de CSS/JS

- Animações: apenas `transform` e `opacity` — nunca `top`, `left`, `width`, `height`
- Scroll reveals: `IntersectionObserver` — nunca `window.addEventListener('scroll')`
- Altura de tela: `min-height: 100dvh` — nunca `100vh` (bug iOS Safari)
- `backdrop-filter`: apenas em elementos `fixed`/`sticky`
- Grain overlay: sempre `position: fixed; pointer-events: none`
- Easing spring: `cubic-bezier(0.32, 0.72, 0, 1)` | ease-out: `cubic-bezier(0.16, 1, 0.3, 1)`

---

## Anti-patterns (banidos)
- Fundo preto puro `#000000`
- Texto branco puro `#ffffff`
- Fonte `Inter`
- Gradient text em headlines
- `window.addEventListener('scroll')` para animações
- `100vh` — usar `100dvh`
- `backdrop-filter` em containers com scroll
- Hero centralizado — sempre alinhado à esquerda
- FAQ com boxes/cards — apenas `border-bottom`
- Cursores personalizados
- Clichês de copy: "Eleve", "Sem atrito", "Liberte", "Next-Gen"

---

## Commits
- Em português, descritivos do que foi feito
- Exemplo: `corrige modal mobile`, `adiciona seção depoimentos`, `ajusta padding hero`
