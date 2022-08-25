export type ComponentData = {
  FC: React.FC<any>;
  props: any;
  children?: { id: string; index: number }[];
  acceptsChildren: boolean;
};

// ComponentData sorted in the direction of parent to child
export type TemplateComponents = { [compId: string]: ComponentData };

// data structure required in intermediate computation
export type PartialTemplateComponents = {
  [compId: string]: Partial<ComponentData>;
};

export type FormattedTemplateData = {
  name: string;
  components: TemplateComponents;
}[];
