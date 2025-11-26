import { useState } from 'react';

const useConfirm = () => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const confirm = (cb) => {
    setCallback(() => cb);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (callback) callback();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return {
    open,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirm;