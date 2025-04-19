/**
 * Remark/Rehype plugin to wrap the output HTML in a div with a specific class.
 *
 * @param {object} options
 * @param {string} options.wrapperClass - The CSS class name for the wrapper div.
 */
export const rehypeWrapInDiv = (options) => {
  let wrapperClass = options?.wrapperClass;

  if (!wrapperClass) {
    console.warn("rehypeWrapInDiv plugin used without 'wrapperClass' option.");
    console.warn("using default option `fremark`");
    wrapperClass = 'fremark';
  }

  return (tree) => {

    const wrapperDiv = {
      type: 'element',
      tagName: 'div',
      properties: {
        className: [wrapperClass] 
      },
      children: [] 
    };

    if (tree.children && tree.children.length > 0) {
      wrapperDiv.children = tree.children;
    }

    tree.children = [wrapperDiv];
  };
}

export default rehypeWrapInDiv;