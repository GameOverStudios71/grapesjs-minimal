import { OptionAsDocument } from '../../common';
import { CssRuleJSON } from '../../css_composer/model/CssRule';
import { ComponentDefinitionDefined } from '../../dom_components/model/types';
import Editor from '../../editor';

export interface ParsedCssRule {
  selectors: string | string[];
  style: Record<string, string>;
  atRule?: string;
  params?: string;
}

export type CustomParserCss = (input: string, editor: Editor) => ParsedCssRule[];

export type CustomParserHtml = (input: string, options: HTMLParserOptions) => HTMLElement;

export interface HTMLParseResult {
  html: ComponentDefinitionDefined | ComponentDefinitionDefined[];
  css?: CssRuleJSON[];
  doctype?: string;
  root?: ComponentDefinitionDefined;
  head?: ComponentDefinitionDefined;
}

export interface ParseNodeOptions extends HTMLParserOptions {
  inSvg?: boolean;
  skipChildren?: boolean;
}

export interface HTMLParserOptions extends OptionAsDocument {
  /**
   * DOMParser mime type.
   * If you use the `text/html` parser, it will fix the invalid syntax automatically.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
   * @default 'text/html'
   */
  htmlType?: DOMParserSupportedType;

  /**
   * Allow <script> tags.
   * @default false
   */
  allowScripts?: boolean;

  /**
   * Allow unsafe HTML attributes (eg. `on*` inline event handlers).
   * @default false
   */
  allowUnsafeAttr?: boolean;

  /**
   * Allow unsafe HTML attribute values (eg. `src="javascript:..."`).
   * @default false
   */
  allowUnsafeAttrValue?: boolean;

  /**
   * When false, removes empty text nodes when parsed, unless they contain a space.
   * @default false
   */
  keepEmptyTextNodes?: boolean;

  /**
   * Indicate if or how to detect if the passed HTML string should be parsed as a document.
   */
  detectDocument?: boolean | ((html: string) => boolean);

  /**
   * Custom transformer to run before passing the input HTML to the parser.
   * A common use case might be to sanitize the input string.
   * @example
   * preParser: htmlString => DOMPurify.sanitize(htmlString)
   */
  preParser?: (input: string, opts: { editor: Editor }) => string;

  /**
   * Configures whether `data-gjs-*` attributes should be automatically converted from hyphenated to camelCase.
   *
   * When `true`:
   * - Hyphenated `data-gjs-*` attributes (e.g., `data-gjs-my-component`) are transformed into camelCase (`data-gjs-myComponent`).
   * - If `defaults` contains the camelCase version and not the original attribute, the camelCase will be used; otherwise, the original name is kept.
   *
   * @default false
   */
  convertDataGjsAttributesHyphens?: boolean;
}

export interface ParserConfig {
  /**
   * Let the editor know which HTML tags should be treated as part of the text component.
   * @default ['br', 'b', 'i', 'u', 'a', 'ul', 'ol']
   */
  textTags?: string[];

  /**
   * Let the editor know which Component types should be treated as part of the text component.
   * @default ['text', 'textnode', 'comment']
   */
  textTypes?: string[];

  /**
   * Custom CSS parser.
   * @see https://grapesjs.com/docs/guides/Custom-CSS-parser.html
   */
  parserCss?: CustomParserCss;

  /**
   * Custom HTML parser.
   * At the moment, the custom HTML parser should rely on DOM Node instance as the result.
   * @example
   * // The return should be an instance of an Node as the root to traverse
   * // https://developer.mozilla.org/en-US/docs/Web/API/Node
   * // Here the result will be XMLDocument, which extends Node.
   * parserHtml: (input, opts = {}) => (new DOMParser()).parseFromString(input, 'text/xml')
   */
  parserHtml?: CustomParserHtml;

  /**
   * Default HTML parser options (used in `parserModule.parseHtml('<div...', options)`).
   */
  optionsHtml?: HTMLParserOptions;
}

const config: () => ParserConfig = () => ({
  textTags: ['br', 'b', 'i', 'u', 'a', 'ul', 'ol'],
  textTypes: ['text', 'textnode', 'comment'],
  parserCss: undefined,
  parserHtml: undefined,
  optionsHtml: {
    htmlType: 'text/html',
    allowScripts: false,
    allowUnsafeAttr: false,
    allowUnsafeAttrValue: false,
    keepEmptyTextNodes: false,
    convertDataGjsAttributesHyphens: false,
  },
});

export default config;
