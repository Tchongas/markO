(function(global) {
  'use strict';

  // Default configuration
  const defaultConfig = {
    titleClass: '',
    divClass: '',
    paragraphClass: ''
  };

  const marko = {
    /**
     * Parses markdown text to HTML
     * @param {string} markdownText - The markdown text to parse
     * @param {object} config - Configuration object
     * @param {string} config.titleClass - The class to use for titles
     * @param {string} config.divClass - The class to use for sections
     * @param {string} config.paragraphClass - The class to use for paragraphs
     * @return {string} The HTML representation
     */
    parse: function(markdownText, config = {}) {
      // Merge provided config with default config
      const finalConfig = { ...defaultConfig, ...config };

      if (!markdownText) return '';
      
      // Split by lines and normalize line endings
      const lines = markdownText.replace(/\r\n/g, '\n').split('\n'); 
      
      let html = [];
      let inSection = false;
      let currentSectionId = 0;
      let contentBuffer = [];
      let titleLevel = 0;
      
      // Process each line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for end marker
        if (line.trim() === '//end') {
          if (inSection) {
            // Process remaining content in the buffer
            if (contentBuffer.length > 0) {
              html.push(this._processContentBuffer(contentBuffer, finalConfig));
              contentBuffer = [];
            }
            
            // Close the section div
            html.push('</div>');
            inSection = false;
          }
          continue;
        }
        
        // Check for titles
        const titleMatch = line.match(/^(#{1,2})\s+(.+)$/);
        if (titleMatch) {
          // Process any content in buffer before the title
          if (!inSection && contentBuffer.length > 0) {
            html.push(this._processContentBuffer(contentBuffer, finalConfig));
            contentBuffer = [];
          } else if (inSection) {
            // Process content in current section before closing it
            html.push(this._processContentBuffer(contentBuffer, finalConfig));
            contentBuffer = [];
            html.push('</div>');
          }
          
          // Determine title level (h1 or h2)
          titleLevel = titleMatch[1].length;
          
          // Only increment section counter for h1
          if (titleLevel === 1) {
            currentSectionId++;
          }
          
          // Create the title
          const titleId = titleLevel === 1 ? `${currentSectionId}-title` : '';
          const titleTag = `h${titleLevel}`;
          const titleContent = titleMatch[2].trim();
          
          html.push(`<${titleTag}${titleId ? ' id="' + titleId + '"' : ''} class="${finalConfig.titleClass}">${titleContent}</${titleTag}>`);
          
          // Open a new section for the content
          if (titleLevel === 1) {
            html.push(`<div id="${currentSectionId}-section" class="${finalConfig.divClass}">`);
            inSection = true;
          } else if (inSection) {
            // For h2, we're already in a section
          }
          
          continue;
        }
        
        // For regular content, add to buffer
        contentBuffer.push(line);
      }
      
      // Process any remaining content
      if (contentBuffer.length > 0) {
        html.push(this._processContentBuffer(contentBuffer, finalConfig));
      }
      
      // Close any open section
      if (inSection) {
        html.push('</div>');
      }
      
      return html.join('\n');
    },
    
    /**
     * Process a buffer of content lines
     * @private
     * @param {string[]} buffer - Array of markdown lines
     * @return {string} processed HTML
     */
    _processContentBuffer: function(buffer, config) {
      const content = buffer.join('\n').trim();
      
      if (!content) return '';
      
      const doubleSplitParagraphs = content.split(/\n\s*\n/);
      
      return doubleSplitParagraphs
          .map(doubleParagraph => {
              const singleLineParagraphs = doubleParagraph.split('\n')
                  .map(line => line.trim())
                  .filter(line => line !== '');
              if (singleLineParagraphs.length === 0) {
                  return `<p class="${config.paragraphClass}"></p>`;
              }
              
              // Convert lines to paragraphs
              return singleLineParagraphs
                  .map(line => `<p class="${config.paragraphClass}">${line}</p>`)
                  .join('\n');
          })
          .join('\n\n');
    },

    /**
     * Set global default configuration
     * @param {object} newConfig - New default configuration
     */
    setDefaultConfig: function(newConfig) {
      Object.assign(defaultConfig, newConfig);
    }
  };

  // CommonJS export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = marko;
  }

  // ES Module export
  if (typeof exports !== 'undefined') {
    exports.default = marko;
  }

  // Global export
  global.marko = marko;

  // Return the marko object for module systems
  return marko;
})(typeof window !== 'undefined' ? window : global);