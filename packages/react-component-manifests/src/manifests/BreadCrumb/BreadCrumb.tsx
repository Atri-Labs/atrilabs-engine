import React from "react";


type BreadCrumbProps = {
    divider: string;
    items: {
      // this will be visible
      name: string;
      // link
      link: string;
    }[];
    onClick: (item: { name: string; link: string }) => {};
  };
  
export  const BreadCrumb: React.FC<BreadCrumbProps> = (props) => {
    return <div></div>;
};






export default {
  manifests: {
  },
};
