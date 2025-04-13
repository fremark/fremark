import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math"
import remarkParse from "remark-parse";
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough';
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from 'remark-directive-rehype'
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
  .use(remarkCjkFriendly)
  .use(remarkCjkFriendlyGfmStrikethrough)
  .use(remarkGithubAdmonitionsToDirectives)
  .use(remarkDirective)
  .use(remarkDirectiveRehype)
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
