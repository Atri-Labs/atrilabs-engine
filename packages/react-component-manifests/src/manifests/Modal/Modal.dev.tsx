import Modal from "./Modal";
import React, { useState } from "react";
import { Button } from "antd";

const DevModal: typeof Modal = React.forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div ref={ref}>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        {...props}
        custom={{ ...props.custom, open: isModalOpen }}
        onCancel={handleCancel}
        onOk={handleOk}
      />
    </div>
  );
});

export default DevModal;
