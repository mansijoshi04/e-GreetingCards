# Card Template System - Implementation Guide

## ✅ What's Been Implemented

### 1. **Template System** 
- 3 card templates seeded in database:
  - Balloon Party (Birthday, Basic, $3)
  - Rose Petals (Anniversary, Premium, $5)
  - Diploma Scroll (Graduation, Basic, $3)
- Each template has full design configuration with editable elements

### 2. **Frontend Pages**
- ✅ Home page (Heartfelt aesthetic - "Digital greetings, beautifully crafted")
- ✅ About page (Our Story)
- ✅ FAQ page (How it Works)
- ✅ Template Gallery (`/create`) - Shows all templates
- ✅ Card Editor (`/create/[templateId]`) - Customize cards with live preview
- ✅ Recipients page - Add email recipients

### 3. **Card Editor Features**
- **Left Sidebar (CustomizationPanel)**:
  - Recipient name input (optional - appears as "Dear [name],")
  - Headline text editor
  - Message body editor
  - Signature text editor
  - Font size slider (14-32px)
  - Text color picker (4 options)
  - Background theme selector (4 color palettes per category)

- **Right Preview (CardPreview)**:
  - Live preview of the card as you edit
  - Shows recipient greeting
  - Shows headline with dynamic font size
  - Shows message body
  - Shows signature
  - Matches selected background theme

### 4. **API Endpoints**
- `GET /api/templates` - Get all templates
- `GET /api/templates/[id]` - Get single template

## 🚀 Quick Start (Testing)

### 1. **Reset Database & Run Seeds**
```bash
cd e-greeting-cards

# Reset and seed database
npx prisma migrate reset --force

# Or just run seed if DB exists
npx prisma db seed
```

### 2. **Start Development Server**
```bash
npm run dev
```
The app will be at `http://localhost:3000`

### 3. **Test the Full Flow**

**Step 1: Home Page**
- Visit http://localhost:3000
- See tier selection (Basic $3 / Premium $5)
- Click "Choose Basic" or "Go Premium"

**Step 2: Template Gallery**
- You'll be taken to `/create` with tier filter
- See available templates filtered by tier
- Click on a template to open the editor

**Step 3: Card Editor**
- Left sidebar shows customization options:
  - Enter "John" in Recipient Name
  - Edit Headline: "Happy Birthday!"
  - Edit Message: "Wishing you a wonderful day..."
  - Edit Signature: "With love, Sarah"
  - Adjust font size with slider
  - Pick a text color
  - Select a background theme
  
- Right side shows LIVE PREVIEW:
  - Updates as you type
  - Shows "Dear John," at top
  - Shows styled headline
  - Shows styled message
  - Shows styled signature
  - Shows selected background gradient

**Step 4: Continue to Recipients** (Next Phase)
- Click "Next: Recipients →" button
- Add email addresses
- Proceed to payment (Phase 3)

## 📝 Template Structure

Each template in the database has:
```typescript
{
  id: string
  name: "Balloon Party"
  category: "birthday" | "anniversary" | "graduation"
  tier: "basic" | "premium"
  priceCents: 300 // in cents ($3 or $5)
  designConfig: {
    version: "1.0"
    layout: {
      backgroundType: "gradient"
      backgroundValue: ["#FFE5EC", "#FFC4D6"]
      containerStyle: "centered"
    }
    elements: [
      {
        id: "headline"
        type: "text"
        defaultText: "Happy Birthday!"
        style: { fontSize, color, fontFamily, etc. }
        editable: true
      },
      // ... more elements
    ]
  }
}
```

## 🎨 Customization Options Available to Users

1. **Recipient Name** - Optional, appears as greeting
2. **Headline** - Main message (editable)
3. **Body Message** - Personal message (editable)
4. **Signature** - Your name (editable)
5. **Font Size** - Adjust message text size (14-32px)
6. **Text Color** - Choose text color from swatches
7. **Background Theme** - Pick color palette (4 options per category)

## 🔄 Next Steps (TODO)

- [ ] Add "How it Works" video/animation in preview
- [ ] Implement animated card preview ("Preview Animation" button)
- [ ] Add more templates (12 total)
- [ ] Color customization for backgrounds
- [ ] Photo upload capability
- [ ] Premium animation features display

## 🐛 Troubleshooting

**Templates not showing in gallery?**
```bash
# Run seed again
npx prisma db seed
```

**Editor page shows "Template not found"?**
```bash
# Check database has templates
npx prisma studio
# Look for Template table - should have 3 records
```

**Preview not updating when I type?**
- Ensure you're in the editor page (`/create/[templateId]`)
- Check browser console for errors
- Try refreshing the page

## 📊 Database Check

To verify templates are seeded:
```bash
# Open Prisma Studio
npx prisma studio

# Navigate to "template" table
# Should see 3 templates:
# 1. Balloon Party - birthday - basic - 300 cents
# 2. Rose Petals - anniversary - premium - 500 cents
# 3. Diploma Scroll - graduation - basic - 300 cents
```

---

**Status**: Frontend templates + editor system fully implemented ✅  
**Next Phase**: Payment integration + email sending  
**Timeline**: Ready for full flow testing
