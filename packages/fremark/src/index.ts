import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math"
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGemoji from "remark-gemoji";
import rehypeMathjax from 'rehype-mathjax';
import { unified } from "unified";
import rehypeShiki from "@shikijs/rehype";

const fremark = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkGemoji)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeMathjax)
  .use(rehypeShiki, {
    // or `theme` for a single theme
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
  })
  .use(rehypeStringify);

export default fremark;
