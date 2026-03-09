# Card Design System Guide

## 📍 Where Designs Are Stored

Card designs are stored in **two places**:

### 1. **Database (`prisma/dev.db`)**
- **Table**: `Template`
- **Column**: `designConfig` (JSONB format)
- Contains: Layout, colors, fonts, editable fields, animations

### 2. **Seed File (`prisma/seed.ts`)**
- Where templates are created and populated into the database
- This is the **source of truth** for template designs
- Edit here to create new templates or modify existing ones

---

## 🎨 Template Design Structure

Each template in `seed.ts` has this structure:

```typescript
await prisma.template.create({
  data: {
    name: 'Balloon Party',           // Template name
    category: 'birthday',             // birthday|anniversary|graduation
    tier: 'basic',                    // basic|premium
    priceCents: 300,                  // $3 = 300 cents
    thumbnailUrl: '/templates/...',   // Placeholder (not used yet)
    designConfig: JSON.stringify({
      version: '1.0',
      animations: {
        entrance: 'fade-in-scale',
        scrollTrigger: 'envelope-open',
        confetti: {
          enabled: true,
          colors: ['#FF6B9D', '#FFE66D', '#4ECDC4'],
          intensity: 200,
          trigger: 'onReveal',
        },
      },
      layout: {
        backgroundType: 'gradient',
        backgroundValue: ['#FFE5EC', '#FFC4D6'],  // Start and end colors
        containerStyle: 'centered',
        aspectRatio: '16:9',
      },
      elements: [
        {
          id: 'headline',
          type: 'text',
          defaultText: 'Happy Birthday!',
          style: {
            fontSize: '48px',
            fontFamily: 'Poppins',
            fontWeight: '700',
            color: '#FF6B9D',
            textAlign: 'center',
          },
          editable: true,  // User can edit this
          animations: {
            entrance: { type: 'fadeInUp', delay: 0.3 },
          },
        },
        // ... more elements (body, signature, etc.)
      ],
    }),
  },
});
```

---

## ✏️ How to Edit/Create Card Designs

### **Step 1: Edit `prisma/seed.ts`**

Open the file and find the template you want to edit or create a new one.

**To edit an existing template:**
```typescript
// Change the name
name: 'Balloon Party',  // ← change this

// Change colors
backgroundValue: ['#FFE5EC', '#FFC4D6'],  // ← change these hex colors

// Change headline styling
{
  id: 'headline',
  defaultText: 'Happy Birthday!',  // ← change this
  style: {
    fontSize: '48px',  // ← change size
    color: '#FF6B9D',  // ← change color
    fontFamily: 'Poppins',  // ← change font
  }
}
```

**To create a new template:**
```typescript
// Copy an existing template block and modify
await prisma.template.create({
  data: {
    name: 'My Custom Card',
    category: 'birthday',
    tier: 'basic',
    priceCents: 300,
    designConfig: JSON.stringify({
      // ... customize the design here
    }),
  },
});
```

### **Step 2: Reseed the Database**

After editing `prisma/seed.ts`, reseed to apply changes:

```bash
DATABASE_URL="file:prisma/dev.db" npx prisma migrate reset --force --skip-generate
```

This will:
- Delete all old templates
- Create new ones from your updated seed.ts
- Restart the app to see changes

---

## 🎨 Common Customizations

### Change Background Colors
```typescript
backgroundValue: ['#FFE5EC', '#FFC4D6'],  // Pink gradient
// Examples:
// Rose: ['#FFF0F3', '#FFE0E6']
// Blue: ['#E3F2FD', '#BBDEFB']
// Green: ['#F1F8E9', '#DCEDC8']
```

### Change Text Colors
```typescript
style: {
  color: '#FF6B9D',  // Pink
  // Examples:
  // Stone: '#78716c'
  // Rose: '#f43f5e'
  // Navy: '#2E5090'
}
```

### Change Font Sizes
```typescript
style: {
  fontSize: '48px',  // Headline size
  // Examples: '32px', '56px', '72px'
}
```

### Change Font Families
```typescript
style: {
  fontFamily: 'Poppins',
  // Examples: 'Inter', 'Dancing Script', 'Georgia'
}
```

### Add More Text Elements
```typescript
elements: [
  // ... existing elements
  {
    id: 'custom-text',
    type: 'text',
    defaultText: 'Your custom text',
    position: { top: '60%', left: '50%' },
    style: {
      fontSize: '20px',
      color: '#000000',
      textAlign: 'center',
    },
    editable: true,
  }
]
```

---

## 🔄 Workflow Example

**Want to create a "Valentine's Day" template?**

1. Open `prisma/seed.ts`
2. Copy the "Rose Petals" template block
3. Change:
   - `name: 'Valentine\'s Love'`
   - `category: 'anniversary'` (or new category)
   - `backgroundValue: ['#FFE0E6', '#FFC4D6']` (red/pink)
   - `defaultText` in headline to "Happy Valentine's Day"
4. Save the file
5. Run: `DATABASE_URL="file:prisma/dev.db" npx prisma migrate reset --force --skip-generate`
6. Refresh the app - your new template appears!

---

## 📋 Available Colors (Hex Codes)

```
Reds/Pinks:
#FF6B9D (hot pink)
#f43f5e (rose)
#FFE5EC (light pink)
#FFC4D6 (pale pink)

Blues:
#2E5090 (navy)
#00A8E8 (bright blue)
#E3F2FD (light blue)

Greens:
#6B8E23 (olive)
#059669 (emerald)

Neutrals:
#78716c (stone)
#333333 (dark gray)
#666666 (medium gray)
```

---

## 📚 Element Types

Currently supported:
- `text` - Editable text (headline, body, signature)
- `lottie` - Animated illustrations (future)
- `image` - Images (future)

---

## 🧪 Preview While Editing

After making changes to `seed.ts`:
1. Reseed the database
2. Refresh your browser
3. Go to `/create` - templates auto-reload
4. Click a template to see your changes in the editor preview

---

## ⚠️ Important Notes

- **Always reseed after editing**: Changes to `seed.ts` don't apply until you run the seed command
- **designConfig is JSON**: Make sure it's valid JSON (proper commas, brackets, quotes)
- **Hex colors must be valid**: Use format `#RRGGBB`
- **Fonts must be available**: Use web-safe fonts or Google Fonts already loaded
- **Elements must have unique IDs**: Don't use the same `id` for multiple elements

---

## 🚀 Next Steps for Better Template Editor

Future improvements:
- [ ] Visual template builder (drag-and-drop UI)
- [ ] Color picker instead of hex codes
- [ ] Font selector dropdown
- [ ] Preview template before seeding
- [ ] Upload custom images/illustrations
- [ ] Admin dashboard for template management

For now, edit `prisma/seed.ts` directly for full control! 🎨
