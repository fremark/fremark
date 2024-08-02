import { visit, type BuildVisitor } from "unist-util-visit";

interface AbbrOptions {
  expandFirst: boolean;
}

const plugin = (option: AbbrOptions = { expandFirst: false }) => {
  const locator = (val, fromIndex) => val.indexOf("*[", fromIndex);
  const inlineTokenizer = (eat, value, silent) => {
    const regex = /[*]\[([^\]]*)\]:\s*(.+)\n*/;
    const keep = regex.exec(value);

    /* istanbul ignore if - never used (yet) */
    if (silent) return silent;
    if (!keep || keep.index !== 0) return;

    const [matched, abbr, reference] = keep;

    return eat(matched)({
      type: "abbr",
      abbr,
      reference,
      children: [{ type: "text", value: abbr }],
      data: {
        hName: "abbr",
        hProperties: {
          title: reference,
        },
      },
    });
  };
  const find = (abbrs, emptyParagraphsToRemove) => {
    return (node, index, parent) => {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.type !== "abbr") continue;
        abbrs[child.abbr] = child;
        node.children.splice(i, 1);
        i -= 1;
      }
      if (node.children.length === 0) {
        const indices = emptyParagraphsToRemove.get(parent) || [];
        indices.push(index);
        emptyParagraphsToRemove.set(parent, indices);
      }
    };
  };
  const replace = (abbrs) => {
    const escapeRegExp = (str: string) =>
      str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

    const pattern = Object.keys(abbrs).map(escapeRegExp).join("|");
    const regex = new RegExp(`(\\b|\\W)(${pattern})(\\b|\\W)`);
    const expanded = {};

    return (node, index, parent) => {
      if (Object.keys(abbrs).length === 0) return;
      if (!node.Children) return;

      for (let c = 0; c < node.children.length; c++) {
        const child = node.children[c];
        if (node.type === "abbr" || child.type !== "text") continue;
        if (!regex.test(child.value)) continue;

        // Transform node
        const newTexts = child.value.split(regex);

        // Remove old text node
        node.children.splice(c, 1);

        // Replace abbreviations
        for (let i = 0; i < newTexts.length; i++) {
          const content = newTexts[i];
          if (Object.prototype.hasOwnProperty.call(abbrs, content)) {
            const abbr = abbrs[content];
            if (option.expandFirst && !expanded[content]) {
              node.children.splice(c + i, 0, {
                type: "text",
                value: `${abbr.reference} (${abbr.abbr})`,
              });
              expanded[content] = true;
            } else {
              node.children.splice(c + i, 0, abbr);
            }
          } else {
            node.children.splice(c + i, 0, {
              type: "text",
              value: content,
            });
          }
        }
      }
    };
  };
  inlineTokenizer.locator = locator;

  
  return (tree) => {
    const abbrs = {};
    const emptyParagraphsToRemove = new Map();

    visit(tree, "paragraph", find(abbrs, emptyParagraphsToRemove));
    emptyParagraphsToRemove.forEach((indices, key) => {
      indices.reverse();
      indices.foreach((index) => {
        key.children.splice(index, 1);
      });
    });

    visit(tree, replace(abbrs));
  };
};

export default plugin;
