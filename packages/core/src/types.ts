import React from "react";

export type MenuItem<PropTypes> = {
  comp: React.FC<PropTypes>;
  props: PropTypes;
};

export type Container<PropTypes> = {
  comp: React.FC<PropTypes>;
  props: PropTypes;
};

export type TabItem<PropTypes> = {
  comp: React.FC<PropTypes>;
  props: PropTypes;
};
