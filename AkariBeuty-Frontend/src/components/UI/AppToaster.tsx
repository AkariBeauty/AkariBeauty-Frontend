import React from "react";
import { Toaster } from "sonner";

const AppToaster: React.FC = () => (
  <Toaster
    position="bottom-right"
    duration={4000}
    richColors
    closeButton={false}
    expand={false}
    toastOptions={{
      duration: 4000,
      style: {
        borderRadius: "16px",
        fontFamily: "inherit",
      },
    }}
  />
);

export default AppToaster;
