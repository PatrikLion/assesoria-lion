# Design System: Lion Mídias

## 1. Visual Theme & Atmosphere

Uma interface escura, cinética e premium — que projeta autoridade comercial e confiança executiva. A atmosfera é profunda e contida, como uma sala de reunião bem iluminada à noite. Densidade arejada (score 4): o conteúdo respira com espaçamento generoso. Variância assimétrica (score 8): layouts em split editorial que quebram convenções simétricas. Movimento fluido (score 6): easing spring-physics para interações táteis — nunca excessivo, sempre com peso.

**Stack:** HTML + CSS Vanilla + JS (sem framework). Fontes via Google Fonts (Outfit).

---

## 2. Color Palette & Roles

| Nome | Hex / Valor | Função |
|---|---|---|
| **Void Black** | `#060606` | Canvas principal. Nunca preto puro. |
| **Charcoal Surface** | `#0d0d0d` | Seções secundárias (logos, causa, entrega, sobre) |
| **Deep Slate** | `#131313` | Fill de cards, seção de números |
| **Graphite** | `#1a1a1a` | Backgrounds de inputs, overlays |
| **Warm Cream** | `#e8e4dc` | Texto primário. Quente, nunca branco puro. |
| **Muted Fog** | `#888888` | Texto secundário, descrições, metadados |
| **Gold Border** | `rgba(201,168,76,0.14)` | Hairlines estruturais, bordas de cards |
| **Surface Divider** | `rgba(255,255,255,0.04)` | Separadores sutis não-gold |
| **Lion Gold** | `#C9A84C` | Único acento. CTAs, headlines, números, checkmarks, tags. Saturação < 80%. |
| **Gold Light** | `#E2C06E` | Estado hover do gold. Nunca usado em repouso. |
| **Hazard Red** | `#e55` | Apenas estado de exclusão ("não é para você"). Nunca decorativo. |

**Regras:**
- Máximo 1 cor de acento (Lion Gold)
- Nunca usar `#000000` puro — usar Void Black `#060606`
- Nunca usar `#ffffff` puro no texto — usar Warm Cream `#e8e4dc`
- Sombras coloridas tintadas com o hue do background, nunca preto genérico

---

## 3. Typography Rules

- **Display / Headlines:** `Outfit` — weight 900, tracking `-0.035em`, line-height `1.07–1.1`. Hierarquia via variação de peso e cor, não só tamanho. Display máximo: ~62px desktop.
- **Body:** `Outfit` — weight 400, line-height `1.75`, cor Muted Fog `#888`. Largura máxima: 500–580px por parágrafo.
- **Labels / Tags:** `Outfit` — weight 600, uppercase, letter-spacing `0.14em`, tamanho 10–11px.
- **Números:** `Outfit` — weight 900, letter-spacing `-0.04em`. Cor Lion Gold.
- **Títulos de seção (h2):** `Outfit` — weight 800, tracking `-0.025em` a `-0.03em`.

**Banidos:**
- `Inter` — substituído por `Outfit`
- Serifa genérica (`Times New Roman`, `Georgia`) — banida
- Texto branco puro `#ffffff` no body — usar Warm Cream
- Gradient text em headlines grandes

---

## 4. Component Stylings

### Botão Primário (Button-in-Button)
- Forma: pílula (`border-radius: 100px`)
- Fill: Lion Gold `#C9A84C`, texto preto
- Padding: `14px 14px 14px 26px` (espaço extra à esquerda)
- Ícone de seta: aninhado em círculo interno `rgba(0,0,0,0.15)`, `34px × 34px`
- Hover: Gold Light fill + `translateY(-2px)` + sombra colorida `rgba(201,168,76,0.22)`
- Active: `scale(0.98)`
- O círculo do ícone translada diagonalmente `(3px, -2px)` no hover
- Versão Large: padding `18px 18px 18px 32px`, ícone `42px × 42px`

### Navbar — Pílula Flutuante
- Estado inicial: transparente, sem borda
- Após scroll > 60px: `background rgba(6,6,6,0.88)`, border gold, `backdrop-filter: blur(20px)`
- Transição: `0.5s cubic-bezier(0.16, 1, 0.3, 1)`
- CTA interno com mesmo padrão Button-in-Button

### Cards dos Pilares — Double Bezel (Doppelrand)
- **Shell externo:** padding `2px`, border-radius `22px`, `rgba(201,168,76,0.04)` bg, 1px gold border
- **Core interno:** border-radius `20px`, bg3 fill, `inset 0 1px 1px rgba(255,255,255,0.04)`
- Hover da shell: border brightens + `translateY(-6px)`
- Animação de entrada: `opacity 0 → 1` + `translateY(32px → 0)`, stagger via `--delay` CSS custom property

### Garantia Box — Double Bezel
- **Shell externo:** padding `3px`, border-radius `24px`, gold border `rgba(201,168,76,0.16)`
- **Core interno:** border-radius `21px`, `inset 0 1px 1px rgba(201,168,76,0.05)`

### Imagens do Patrik — Double Bezel
- Mesmo tratamento: shell `24px`, core `21px`
- Fade gradient na base: `linear-gradient(to top, bg3, transparent)`

### Itens de Entrega
- Card flat (bg3 fill, border-sub `rgba(255,255,255,0.04)`)
- Ícone check em quadrado dourado `32px`, `border-radius: 8px`, `rgba(201,168,76,0.08)` bg
- Hover: border brightens + `translateY(-2px)`

### FAQ — Apenas borda inferior (sem boxes)
- Sem container, sem background
- `border-bottom: 1px solid rgba(255,255,255,0.06)`
- Ícones `+` / `−` SVG em gold
- Accordion: `max-height` transition `0.45s cubic-bezier(0.16, 1, 0.3, 1)`

### Avatar de Depoimentos (CSS puro)
- `100px × 100px`, `border-radius: 14px`, bg4 fill
- Initials geradas via `data-initials` + `::before { content: attr(data-initials) }`
- Radial gradient gold sutil via `::after`

### Dots do Slider
- Inativo: `6px × 6px`, border-radius `3px`, bg4
- Ativo: `20px × 6px` (pílula), gold fill
- Transição de largura: `0.3s cubic-bezier(0.32, 0.72, 0, 1)`

### Tags
- Pílula, gold text + gold border `rgba(201,168,76,0.14)`
- 10px uppercase, tracking `0.14em`

---

## 5. Layout Principles

- **Largura máxima:** `1100px` centrado, `24px` padding horizontal
- **Seções:** `padding: 110px 0` desktop, `80px 0` tablet, `64px 0` mobile
- **Hero:** grid 2 colunas (`1fr 1fr`), texto à esquerda, imagem à direita, gap `60px`
- **Pilares:** grid 3 colunas, gap `16px`. Cada card em arquitetura double-bezel.
- **Entrega:** grid 2 colunas, gap `12px`
- **Fit:** grid 2 colunas, gap `20px`
- **Sobre:** 2 colunas invertidas (imagem esquerda, texto direita)
- Nenhum Hero centralizado — sempre alinhado à esquerda na coluna de texto
- Nenhum padrão de 3 cards iguais sem diferenciação de bezel
- CSS Grid preferido sobre Flexbox com cálculo percentual
- Hero usa `min-height: 100dvh` (nunca `100vh` — bug iOS Safari)
- Nenhum elemento sobreposto, exceto glows e overlays de pseudo-elemento

---

## 6. Motion & Interaction

**Variáveis de easing:**
```css
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1)
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1)
```

**Scroll reveals:**
- `translateY(28–32px)` + `opacity: 0` → visível
- Duration `650–700ms`, ease-out
- Stagger via CSS custom property `--delay` + inline style
- Após animação, `--delay` é removido via JS para hover sem atraso

**Hover de cards pilares:**
- `translateY(-6px)` + border color
- `400ms ease-spring` após remoção do delay

**Hover de botões:**
- `translateY(-2px)` + sombra colorida
- Seta interna: `translateX(3px) translateY(-2px)`
- `250ms ease-out`

**Counters:** `setInterval 16ms`, duração `2000ms`, `toLocaleString('pt-BR')`

**Navbar:** scroll > 60px ativa glass pill. `500ms ease-out`.

**FAQ:** height transition `450ms cubic-bezier(0.16, 1, 0.3, 1)`. Troca de ícone + / − com opacity + scale.

**Slider:** animação CSS `fadeSlide` (translateY + opacity) no toggle de classe. Auto-avanço `5s`. Pausa no `mouseenter`.

**Regras de performance:**
- Apenas `transform` e `opacity` animados — nunca `top`, `left`, `width`, `height`
- `IntersectionObserver` para todos os reveals (nunca `window.addEventListener('scroll')`)
- Grain overlay em `position: fixed; pointer-events: none` — nunca em container com scroll
- `backdrop-filter` apenas em elementos fixed/sticky (navbar)

---

## 7. Anti-Patterns (Banidos)

- `Inter` como fonte — usar `Outfit`
- Fundo preto puro `#000000` — usar `#060606`
- Texto branco puro `#ffffff` no body — usar `#e8e4dc`
- Sombras neon ou outer glows — apenas sombras coloridas tintadas
- Cores de acento oversaturadas — gold saturação < 80%
- Gradient text em headlines grandes
- Cursores personalizados
- Layouts de hero centralizados
- 3 cards iguais sem diferenciação visual (double-bezel resolve)
- FAQ com boxes/containers — apenas border-bottom
- `window.addEventListener('scroll')` para animações — usar `IntersectionObserver`
- Links de imagem quebrados — usar `onerror` handlers ou avatars CSS
- `h-screen` / `100vh` — usar `min-height: 100dvh`
- `backdrop-filter` em containers com scroll
- Grain/noise em elementos que fazem scroll
- Nomes de placeholder genéricos ("João Silva" aceitável apenas como placeholder — substituir por dados reais do cliente)
- Clichês de copywriting de IA: "Eleve", "Sem atrito", "Liberte", "Next-Gen"
- Texto filler: "Scroll para explorar", chevrons animados, setas de scroll
