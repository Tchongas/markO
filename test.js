const assert = require('assert');
const marko = require('./marko.js');

function runTests() {

  // Verify marko.parse exists
  if (typeof marko.parse !== 'function') {
    throw new Error('marko.parse is not a function');
  }

  const exampleMarkdown = `
# My First Title
This is some content
//end

## Subtitle
More content here
//end
`;
  // Test 1: Basic title parsing
  const basicTest = marko.parse(exampleMarkdown, {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para'
  });
  
  assert(basicTest.includes('<h1 id="1-title" class="test-title">Hello World</h1>'), 
    'Should create an H1 tag with correct id and class');
  
  assert(basicTest.includes('<div id="1-section" class="test-div">'), 
    'Should create a section div');

  // Test 2: Paragraph parsing
  const paragraphTest = marko.parse('First line\n\nSecond paragraph', {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para'
  });
  
  assert(paragraphTest.includes('<p class="test-para">First line</p>'), 
    'Should create paragraphs with correct class');
  
  assert(paragraphTest.includes('<p class="test-para"></p>'), 
    'Should handle empty lines between paragraphs');

  // Test 3: Multiple sections
  const multiSectionTest = marko.parse('# First Title\nContent 1\n//end\n# Second Title\nContent 2\n//end', {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para'
  });
  
  assert(multiSectionTest.includes('<h1 id="1-title" class="test-title">First Title</h1>'), 
    'Should parse first section title');
  
  assert(multiSectionTest.includes('<h1 id="2-title" class="test-title">Second Title</h1>'), 
    'Should parse second section title');

  console.log('All tests passed successfully! 🎉');
}

// Run tests
try {
  runTests();
  console.log('All tests passed successfully! 🎉');
} catch (error) {
  console.error('Test failed:', error.message);
  process.exit(1);
}