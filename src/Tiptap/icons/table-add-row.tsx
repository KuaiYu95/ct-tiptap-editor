import { SvgIcon, SvgIconProps } from "@mui/material";
import * as React from "react";

export const TableAddRowIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon
      viewBox='0 0 1024 1024'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path d="M938.667 426.667c0 46.933-38.4 85.333-85.334 85.333H170.667c-46.934 0-85.334-38.4-85.334-85.333V128h85.334v85.333h170.666V128h85.334v85.333h170.666V128h85.334v85.333h170.666V128h85.334v298.667m-768 0h170.666v-128H170.667v128m256 0h170.666v-128H426.667v128m426.666 0v-128H682.667v128h170.666m-384 170.666h85.334v128h128v85.334h-128v128h-85.334v-128h-128v-85.334h128v-128z"></path>
    </SvgIcon >
  );
};
TableAddRowIcon.displayName = 'icon-table-add-row';
