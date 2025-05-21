import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export const ArrowIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d="M326.848 430.4l163.84 191.168a28.16 28.16 0 0 0 42.688 0l163.84-191.168A28.16 28.16 0 0 0 675.84 384l-327.68 0a28.16 28.16 0 0 0-21.312 46.4z"></path>
    </SvgIcon>
  );
};
ArrowIcon.displayName = 'icon-arrow';
