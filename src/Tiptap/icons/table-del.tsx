import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export const TableDelIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d="M832 128H192a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h320v-64H448v-192h64V576H448V384h448V192a64 64 0 0 0-64-64zM192 320V192h640v128H192z m0 256V384h192v192H192z m0 256v-192h192v192H192z m634.496-218.496a32 32 0 0 0-22.656 9.408l-67.84 67.84-67.84-67.904a32 32 0 0 0-45.248 45.248l67.84 67.904-67.904 67.904a32 32 0 0 0 45.248 45.248l67.84-67.904 67.84 67.904a32 32 0 0 0 45.248-45.248L781.248 736l67.904-67.904a32 32 0 0 0-22.656-54.656zM704 384h-64v128h64V384z m192 0h-64v128h64V384z"></path>
    </SvgIcon >
  );
};
TableDelIcon.displayName = 'icon-table-del';
