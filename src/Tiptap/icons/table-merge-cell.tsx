import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export const TableMergeCellIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d="M832 128a128 128 0 0 1 128 128v512a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h640z m-492.8 550.4H140.8V768a51.2 51.2 0 0 0 44.8 50.816l6.4 0.384h147.2v-140.8z m268.736 0H416v140.8h191.936v-140.8z m275.264 0h-198.464v140.8H832a51.2 51.2 0 0 0 50.816-44.8l0.384-6.4v-89.6z m0-256H140.8v179.2h742.4V422.4zM339.2 204.8H192a51.2 51.2 0 0 0-50.816 44.8L140.8 256v89.6h198.4V204.8z m268.736 0H416v140.8h191.936V204.8zM832 204.8h-147.264v140.8H883.2V256a51.2 51.2 0 0 0-44.8-50.816L832 204.8z"></path>
    </SvgIcon >
  );
};
TableMergeCellIcon.displayName = 'icon-table-merge-cell';
