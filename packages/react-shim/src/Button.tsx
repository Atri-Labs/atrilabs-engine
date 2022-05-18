import React, { useState } from "react";

export const Button = () => {
  const [count, setcount] = useState(0);
  console.log(count);
  return <button onClick={() => setcount((c) => c + 1)}>Click Me</button>;
};

const manifest = {
  comp: Button,
};

export default manifest;
