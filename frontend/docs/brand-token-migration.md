# Brand Token Migration

## Muc tieu

Chuyen mau giao dien tu cac gia tri viet truc tiep trong JSX/CSS sang he thong `brand.*`, nhung giu nguyen 100% palette va do trong suot hien tai cua giao dien.

Khong thay doi layout, typography, animation, noi dung, hanh vi component hoac gia tri mau dang hien thi.

## Cau truc `brand`

Nguon mau trung tam nam tai `src/config/brand.ts`:

```ts
export const brand = {
  background: '#050505',
  foreground: '#FFF4DE',
  primary: '#C98A48',
  primaryHover: '#d89753',
  secondary: '#0B0B0B',
  accent: '#E94362',
  muted: 'rgba(255, 255, 255, 0.62)',
  surface: '#0E0E0E',
  surfaceElevated: '#161616',
  chocolate: '#5A2E22',
  honeycomb: '#E5A84B',
  pistachio: '#9FBC69',
  white: '#FFFFFF',
  black: '#000000',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
};
```

Ngoai cac token co ban, object con co cac token phuc vu CSS global:

- `textPrimary`: mau text body voi alpha 0.94
- `scrollbarThumb` va `scrollbarThumbHover`: mau thanh cuon
- `glassPanel`, `glassNav`, `glassNavBorder`: mau glass panel/nav
- `glow` va `glowEnd`: mau radial glow

Tat ca cac gia tri nay duoc giu dung bang gia tri mau truoc khi refactor.

## Cach he thong hoat dong

### Tailwind

`tailwind.config.js` expose cac token thanh class:

```tsx
<div className="bg-brand-background text-brand-foreground">
<button className="bg-brand-primary hover:bg-brand-primaryHover">
```

Cac alpha class van giu dung mau goc, vi du:

```tsx
text-brand-white/70
bg-brand-white/5
border-brand-white/10
```

`brand-white` va `brand-black` duoc them rieng de thay the chinh xac cho `white/..` va `black/..`, tranh lam thay doi mau alpha cua giao dien.

### CSS global

`src/main.tsx` doc object `brand` va gan gia tri vao cac CSS variables `--brand-*`.

`src/index.css` dung cac bien nay cho:

- Body background va text
- Custom scrollbar
- Glass panel
- Glass navigation
- Radial glow
- Gradient text

## Cac file da sua

### Cau hinh va he mau

- `src/config/brand.ts`
  - Tao object `brand`.
  - Dua `BRAND_CONFIG.colors` ve tham chieu `brand.*`.
  - Dua mau cua flavor va topping ve tham chieu `brand.*`.
- `tailwind.config.js`
  - Khai bao cac utility `brand-*`.
- `src/main.tsx`
  - Khoi tao CSS variables tu `brand`.
- `src/index.css`
  - Thay mau CSS global truc tiep bang CSS variables.

### Component giao dien

- `src/app/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/Preloader.tsx`
- `src/components/StoryCanvasSection.tsx`
- `src/features/catalog/FlavorShowcase.tsx`
- `src/features/catalog/components/FlavorModal.tsx`
- `src/components/OurStory.tsx`
- `src/features/custom-builder/ToppingBuilder.tsx`
- `src/features/stores/StoreLocator.tsx`
- `src/features/checkout/OrderModal.tsx`
- `src/components/Footer.tsx`
- `src/utils/frameLoader.ts`

Trong cac file nay, cac mau hex va mau `white/..`, `black/..` cua UI duoc thay bang class token tuong ung. Logic, state, props, text va layout duoc giu nguyen.

## Nhung gi khong thay doi

- Khong doi mau cua giao dien.
- Khong doi mau rieng cua tung flavor/topping theo y nghia hien thi.
- Khong doi animation hoac canvas rendering.
- Khong doi navigation, modal flow hay order flow.
- Khong them backend hoac API.

## Kiem tra

Da chay thanh cong:

```bash
npm run build
```

Lenh build gom `tsc` va `vite build`, va hien tai deu pass.
