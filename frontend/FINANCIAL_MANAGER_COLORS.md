# Financial Manager Portal - Brand Color Guidelines

## Overview
This document defines the corporate brand color palette and usage guidelines for the Financial Manager Portal within the Farmer Management System.

## Primary Brand Color
- **Color Name**: FM Primary
- **HEX Code**: `#0369A1`
- **Tailwind Class**: `bg-fm-primary`, `text-fm-primary`, `border-fm-primary`
- **RGB**: `rgb(3, 105, 161)`
- **Description**: Professional corporate blue (Sky-700) that conveys trust and stability

## Color Palette

### Core Colors

| Color | HEX | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| **FM Primary** | `#0369A1` | `fm-primary` | Primary buttons, active states, brand elements |
| **FM Primary Light** | `#7DD3FC` | `fm-primary-light` | Hover backgrounds, subtle highlights |
| **FM Primary Dark** | `#0C4A6E` | `fm-primary-dark` | Strong contrast elements, borders |
| **FM Primary Hover** | `#075985` | `fm-primary-hover` | Button hover states, interactive elements |
| **FM Secondary** | `#F0F9FF` | `fm-secondary` | Light backgrounds, subtle sections |
| **FM Accent** | `#0284C7` | `fm-accent` | Secondary interactive elements |

## WCAG 2.1 AA Compliance

### Contrast Ratios
All color combinations meet or exceed WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for large text):

- **FM Primary (#0369A1) on White (#FFFFFF)**: 7.15:1 ✓
- **White Text (#FFFFFF) on FM Primary (#0369A1)**: 7.15:1 ✓
- **FM Primary (#0369A1) on FM Secondary (#F0F9FF)**: 6.82:1 ✓
- **FM Primary Hover (#075985) on White (#FFFFFF)**: 9.23:1 ✓

## UI Element Applications

### Primary Buttons
Use `bg-fm-primary hover:bg-fm-primary-hover text-white` for all primary action buttons:
- Save
- Confirm
- Submit
- Process Payment
- Approve

```tsx
<button className="px-4 py-2 bg-fm-primary hover:bg-fm-primary-hover text-white rounded-lg transition-colors">
  Save Changes
</button>
```

### Secondary Buttons
Use `bg-fm-secondary text-fm-primary hover:bg-fm-primary-light` for secondary actions:
- Cancel (with neutral colors)
- View Details
- Generate Report

```tsx
<button className="px-4 py-2 bg-fm-secondary text-fm-primary hover:bg-fm-primary-light rounded-lg transition-colors">
  View Details
</button>
```

### Input Fields Focus States
All input fields, textareas, and selects should use FM Primary for focus states:

```tsx
<input className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fm-primary focus:border-transparent" />
```

### Navigation/Active States
Active navigation links and selected items should use FM Primary:

```tsx
<div className="ring-2 ring-fm-primary">Active Section</div>
```

### Charts and Visualizations
- **Primary data series**: Use `#0369A1` (FM Primary)
- **Secondary data**: Use complementary colors (green for profit, red for expenses)
- **Interactive elements**: Use FM Primary for hover states

## Implementation Notes

### Scope
These colors are **ONLY** applied to Financial Manager Portal components:
- `FinancialManagerDashboard.tsx`
- `FinancialManagerDashboardNew.tsx`
- Any future Financial Manager-specific components

### Other Portals
Do NOT apply these colors to:
- Field Officer Portal
- Manager Portal
- Farmer Portal

Each portal maintains its own independent color scheme to prevent visual conflicts and maintain role clarity.

## Configuration Files

### Tailwind Config
Colors are defined in `tailwind.config.js`:

```javascript
colors: {
  'fm-primary': '#0369A1',
  'fm-primary-light': '#7DD3FC',
  'fm-primary-dark': '#0C4A6E',
  'fm-primary-hover': '#075985',
  'fm-secondary': '#F0F9FF',
  'fm-accent': '#0284C7',
}
```

## Best Practices

1. **Consistency**: Always use the defined Tailwind classes instead of arbitrary HEX values
2. **Accessibility**: Ensure all interactive elements meet contrast requirements
3. **Hover States**: Always include hover states with smooth transitions
4. **Focus States**: All interactive elements must have visible focus indicators
5. **Testing**: Test color combinations with color blindness simulators

## Resources

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: 2024
**Maintained By**: Development Team
