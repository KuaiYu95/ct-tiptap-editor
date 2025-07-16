import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export const TableHeadIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d="M960.3 384V191.8c0-70.7-57.3-128.1-128.1-128.1H191.8c-70.7 0-128.1 57.4-128.1 128.1v640.3c0 70.7 57.4 128.1 128.1 128.1h640.3c70.7 0 128.1-57.3 128.1-128.1V384zM415.8 608.2V384h192.3v224.1H415.8z m192.4 63.9v224.1H415.8V672.1h192.4z m-256.3-63.9H127.7V384h224.1v224.2zM146.5 877.6c-12.1-12-18.8-28.3-18.8-45.2V672.1h224.1v224.1h-160c-16.9 0.2-33.3-6.6-45.3-18.6z m749.8-45.3c0 17-6.7 33.2-18.7 45.2s-28.3 18.7-45.2 18.7H672.1V672.1h224.1v160.2z m0-224.1H672.1V384h224.1v224.2z m0 0"></path>
    </SvgIcon >
  );
};
TableHeadIcon.displayName = 'icon-table-head';
