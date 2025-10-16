export type Block = {
  id: string;
  type: "text";
  content: string;
};

export type PageItemLite = { id: number; title: string };

export type BlockEditorProps = {
  initialPages?: PageItemLite[];
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
};
