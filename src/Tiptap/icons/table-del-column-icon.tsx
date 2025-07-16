import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export const TableDelColumnIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d="M288 896V656H128v208a32 32 0 0 0 32 32h128z m64 0h320V128H352v768zM288 128h-128a32 32 0 0 0-32 32v176h160V128z m0 272H128v192h160V400z m608 192V400H736v192h160z m0 64H736v240h128a32 32 0 0 0 32-32V656z m0-320V160a32 32 0 0 0-32-32h-128v208h160zM160 64h704a96 96 0 0 1 96 96v704a96 96 0 0 1-96 96H160a96 96 0 0 1-96-96V160a96 96 0 0 1 96-96z m356.352 398.4l56.576-56.576a32 32 0 0 1 45.248 45.248l-56.56 56.576 56.56 56.56a32 32 0 1 1-45.248 45.264l-56.576-56.576-56.56 56.576a32 32 0 1 1-45.264-45.264l56.576-56.56-56.576-56.576a32 32 0 0 1 45.264-45.248l56.56 56.56z"></path>
    </SvgIcon >
  );
};
TableDelColumnIcon.displayName = 'icon-table-del-column';
