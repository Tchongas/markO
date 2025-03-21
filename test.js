const assert = require('assert');
const marko = require('./marko.js');

function runTests() {

  // Verify marko.parse exists
  if (typeof marko.parse !== 'function') {
    throw new Error('marko.parse is not a function');
  }

  const exampleMarkdown = `
# My First Title
p1
//end

# My Second Title

## Subtitle
p2

p3
//end
[Google](https://www.google.com "Google")
inline link [Google2](https://www.google.com "Google")
`;
  // Test 1: Basic title parsing
  const basicTest = marko.parse(exampleMarkdown, {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para',
    anchorClass: 'test-anchor'
  });
  
  assert(basicTest.includes('<h1 id="1-title" class="test-title">My First Title</h1>'), 
    'Should create an H1 tag with correct id and class');
  
  assert(basicTest.includes('<div id="1-section" class="test-div">'), 
    'Should create a section div');

  // Test 2: Paragraph parsing
  const paragraphTest = marko.parse(exampleMarkdown, {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para'
  });
  
  assert(paragraphTest.includes('<p class="test-para">p1</p>'), 
    'Should create paragraphs with correct class');

  // Test 3: link parsing
  const linkTest = marko.parse(exampleMarkdown, {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para',
    anchorClass: 'test-anchor'
  });
  
  assert(linkTest.includes('<a href="https://www.google.com" title="Google" class="test-anchor">Google</a>'),
    'Should create links with correct text');
  
  const linkInlineTest = marko.parse(exampleMarkdown, {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para',
    anchorClass: 'test-anchor'
  });

  assert(linkInlineTest.includes('<p class="test-para">inline link <a href="https://www.google.com" title="Google" class="test-anchor">Google2</a></p>'),
    'Should create links with correct text');


  // Test 4: Multiple sections
  const multiSectionTest = marko.parse(exampleMarkdown, {
    titleClass: 'test-title',
    divClass: 'test-div',
    paragraphClass: 'test-para'
  });
  
  assert(multiSectionTest.includes('<h1 id="1-title" class="test-title">My First Title</h1>'), 
    'Should parse first section title');
  
  assert(multiSectionTest.includes('<h1 id="2-title" class="test-title">My Second Title</h1>'), 
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