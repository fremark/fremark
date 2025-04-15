/**
 * @import {} from 'mdast-util-directive'
 * @import {} from 'mdast-util-to-hast'
 * @import {Root} from 'mdast'
 * @import {VFile} from 'vfile'
 */

import { visit } from 'unist-util-visit'

// This plugin is an example to turn `::youtube` into iframes.
export const BilibiliRemarkPlugin = () => {
    /**
     * @param {Root} tree
     *   Tree.
     * @param {VFile} file
     *   File.
     * @returns {undefined}
     *   Nothing.
     */
    return (tree, file) => {
        visit(tree, function (node) {
            if (
                node.type === 'containerDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                if (node.name !== 'bilibili') return

                const data = node.data || (node.data = {})
                const attributes = node.attributes || {}
                const id: String = Object.keys(attributes)[0]

                if (node.type === 'textDirective') {
                    file.fail(
                        'Unexpected `:bilibili` text directive, use two colons for a leaf directive',
                        node
                    )
                }

                if (!id) {
                    file.fail('Unexpected missing `id` on `bilibili` directive', node)
                }

                if (!id.startsWith("BV") && !id.startsWith("AV")) {
                    file.fail('Unexpected non BV or AV id on `bilibili` directive', node)
                }

                const source = 'https://player.bilibili.com/player.html?autoplay=0&p=1&high_quality=1' + (id.startsWith("BV") ? "&bvid=" : "&aid=") + (id.startsWith("AV") ? id.startsWith("AV") : id);
                console.log(source)

                data.hName = 'iframe'
                data.hProperties = {
                    src: source,
                    frameBorder: 0,
                    allow: 'picture-in-picture',
                    allowFullScreen: true
                }
            }
        })
    }
}