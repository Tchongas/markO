# Marko - Simple Markdown to HTML Parser

## Overview

Marko is a JavaScript library that converts Markdown text into HTML built to suit my very specific needs.

## Basic Usage

```javascript
// Basic parsing
const markdown = `
# My First Title
This is some content
//end

## Subtitle
More content here
//end
`;

const config = {
  titleClass: 'section-title',
  divClass: 'section-content',
  paragraphClass: 'text-paragraph'
};

const html = marko.parse(markdown, config);
```

## Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `titleClass` | String | CSS class for titles | `''` |
| `divClass` | String | CSS class for section divs | `''` |
| `paragraphClass` | String | CSS class for paragraphs | `''` |

## Parsing

- `#` creates an H1 title with a unique section
- `##` creates an H2 subtitle within a section
- `//end` closes the current section
- Single line breaks create new paragraphs
- Double line breaks create empty paragraphs

## Examples

### Simple Markdown
```markdown
Hello world
# First Section
Content here
//end
```

### Output HTML
```html
<p>Hello world</p>
<h1 id="1-title">First Section</h1>
<div id="1-section">
  <p>Content here</p>
</div>
```