type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface Heading {
  type: HeadingType;
  text: string;
}

export interface Paragraph {
  type: 'paragraph';
  text: string;
}

interface BaseList { }

export interface OrderedList extends BaseList {
  type: 'ordered';
  listItem: string[];
}

export interface UnorderedList extends BaseList {
  type: 'unordered';
  listItem: number[];
}

type List = OrderedList | UnorderedList;

export interface Hyperlink {
  type: 'hyperlink',
  url: string,
  aliasText?: string,
}

export type ChatResponseItem = Heading | List | Hyperlink;
export type ChatResponse = ChatResponseItem[];




