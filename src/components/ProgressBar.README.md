# ProgressBar Component

## Overview

The `ProgressBar` component provides a visual indicator of assessment progress in the multi-step financial assessment wizard. It displays the current section position, overall completion percentage, and section indicators (dots) that show which sections are completed, active, or upcoming.

## Features

- **Visual Progress Bar**: Animated horizontal bar showing completion percentage
- **Section Indicators**: Dot indicators for each section with three states:
  - Completed (green)
  - Active (purple with pulse animation)
  - Upcoming (gray)
- **Progress Text**: "Section X of Y - Z% Complete" display
- **Responsive Design**: Adapts to mobile and tablet screens
- **Smooth Animations**: CSS transitions for all state changes
- **Accessibility**: Title attributes on indicators for better UX

## Requirements Validated

- **Requirement 3.2**: THE Assessment_Page SHALL display a Progress_Bar showing the current Section position
- **Requirement 3.3**: THE Assessment_Page SHALL display a Progress_Bar showing the overall completion percentage
- **Requirement 3.4**: THE Assessment_Page SHALL display the Section completion percentage

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentSection` | number | Yes | Current section index (0-based). For section 1, pass 0. |
| `totalSections` | number | Yes | Total number of sections in the assessment (typically 9). |
| `completionPercentage` | number | Yes | Overall completion percentage (0-100). |

## Usage

### Basic Example

```jsx
import ProgressBar from './components/ProgressBar';
import './styles/AssessmentPage.css';

function AssessmentPage() {
  const currentSection = 2; // Currently on section 3 (0-indexed)
  const totalSections = 9;
  const completionPercentage = 33;

  return (
    <div>
      <ProgressBar 
        currentSection={currentSection}
        totalSections={totalSections}
        completionPercentage={completionPercentage}
      />
    </div>
  );
}
```

### Integration with Assessment Session

```jsx
import React, { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar';
import AssessmentService from './services/AssessmentService';
import './styles/AssessmentPage.css';

function AssessmentPage() {
  const [session, setSession] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const sessionData = await AssessmentService.getActiveSession();
    setSession(sessionData);
    setCurrentSectionIndex(getSectionIndexFromName(sessionData.current_section));
  };

  const completionPercentage = session 
    ? session.completion_percentage 
    : 0;

  return (
    <div>
      <ProgressBar 
        currentSection={currentSectionIndex}
        totalSections={9}
        completionPercentage={completionPercentage}
      />
      
      {/* Rest of assessment form */}
    </div>
  );
}
```

### Calculating Completion Percentage

If the backend doesn't provide completion percentage, calculate it locally:

```jsx
const totalSections = 9;
const currentSection = 4; // 0-indexed

// Option 1: Based on completed sections
const completionPercentage = Math.round((currentSection / totalSections) * 100);

// Option 2: Based on completed sections array from backend
const completedSections = session?.completed_sections?.length || 0;
const completionPercentage = Math.round((completedSections / totalSections) * 100);
```

## Styling

The component requires `AssessmentPage.css` to be imported. The CSS file includes:

- `.progress-bar-container`: Container with white background and shadow
- `.progress-bar`: Gray background bar
- `.progress-fill`: Gradient purple fill with shimmer animation
- `.progress-text`: Centered text showing progress
- `.section-indicators`: Flex container for dots
- `.indicator`: Base dot styling
- `.indicator.completed`: Green dots for completed sections
- `.indicator.active`: Purple pulsing dot for current section

### Customization

To customize colors or sizing, override CSS variables:

```css
.progress-bar-container {
  --progress-gradient-start: #4f46e5;
  --progress-gradient-end: #7c3aed;
  --completed-color: #10b981;
  --active-color: #4f46e5;
}
```

## Visual States

### Section Indicators

The component displays different visual states for section indicators:

1. **Completed Sections** (index < currentSection):
   - Green background (#10b981)
   - Shadow with green glow
   - No animation

2. **Active Section** (index === currentSection):
   - Purple gradient background
   - Shadow with purple glow
   - Pulse animation (scale effect)

3. **Upcoming Sections** (index > currentSection):
   - Gray background
   - No shadow or animation

## Responsive Behavior

The component adapts to different screen sizes:

### Desktop (> 768px)
- Full padding: 1.5rem 2rem
- Progress bar height: 12px
- Indicator size: 12px
- Normal font sizes

### Tablet (768px - 640px)
- Medium padding: 1rem 1.5rem
- Progress bar height: 10px
- Indicator size: 10px
- Slightly smaller fonts

### Mobile (< 640px)
- Compact padding: 1rem
- Progress bar height: 8px
- Indicator size: 8px
- Smallest fonts

## Accessibility

The component includes accessibility features:

- **Title Attributes**: Each indicator has a `title="Section X"` for tooltip on hover
- **Semantic HTML**: Uses meaningful class names and structure
- **Color + Shape**: Uses both color and animation to indicate states (not color alone)
- **Text Alternative**: Progress text provides non-visual progress information

## Animation Details

### Progress Fill Animation
- Transition duration: 0.5s
- Easing: ease-out
- Shimmer effect: 2s infinite loop

### Indicator Pulse Animation
- Duration: 2s
- Easing: ease-in-out
- Effect: Scale from 1 to 1.2 and back
- Loop: infinite

### Container Fade-in
- On mount: fadeInUp animation
- Duration: 0.5s
- Easing: ease-out

## Testing

The component includes comprehensive unit tests (11 tests):

- Basic rendering with props
- Progress bar width calculation
- Correct number of indicators
- Active section marking
- Completed sections marking
- First and last section handling
- Percentage rounding
- Zero and full completion
- Indicator title attributes

Run tests:
```bash
npm test -- ProgressBar.test.jsx
```

## Browser Support

The component uses modern CSS features:
- CSS Grid and Flexbox
- CSS Custom Properties (variables)
- CSS Animations and Transitions
- SVG

Supported browsers:
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Performance

The component is lightweight and performant:

- **No heavy computations**: Simple array mapping
- **CSS animations**: Hardware-accelerated
- **No re-renders**: Pure component behavior
- **Small bundle size**: < 2KB minified

## Demo

A demo component is available at `src/components/ProgressBarDemo.jsx` that shows:
- Interactive controls to change current section
- Visual demonstration of all states
- Feature checklist
- Requirements validation

To view the demo, import and render `ProgressBarDemo` in your application.

## Related Components

- `AssessmentPage`: Main page that uses ProgressBar
- `QuestionRenderer`: Renders form inputs for each section
- `AssessmentService`: Handles backend communication for sessions

## Future Enhancements

Potential improvements for future iterations:

1. **Click to Navigate**: Allow clicking indicators to jump to sections (if business rules permit)
2. **Section Names**: Show section names on hover or below indicators
3. **Progress Animation**: Animate percentage counting up
4. **Estimated Time**: Show estimated time to complete remaining sections
5. **Milestone Markers**: Highlight certain sections as important milestones

## Changelog

### v1.0.0 (Initial Release)
- Created ProgressBar component
- Added section indicators with three states
- Implemented responsive design
- Added comprehensive unit tests
- Created documentation and demo
