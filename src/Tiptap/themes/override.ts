import { addOpacityToColor } from '../../utils';
import { custom, ThemeColor } from './color';

declare module "@mui/material/styles" {
  interface Palette {
    neutral: Palette["primary"];
  }

  interface PaletteOptions {
    neutral: PaletteOptions["primary"];
  }
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}
declare module "@mui/material/ButtonGroup" {
  interface ButtonGroupPropsColorOverrides {
    neutral: true;
  }
}

const componentStyleOverrides = (theme: ThemeColor) => {
  return {
    MuiButton: {
      styleOverrides: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        root: ({ ownerState }: { ownerState: any }) => {
          return {
            height: '36px',
            fontSize: 14,
            lineHeight: '36px',
            paddingLeft: '16px',
            paddingRight: '16px',
            boxShadow: "none",
            transition: 'all 0.2s ease-in-out',
            borderRadius: '10px',
            fontWeight: '400',
            ...(ownerState.variant === 'contained' && {
              color: theme.text.inverse,
              backgroundColor: theme.text.primary,
            }),
            ...(ownerState.variant === 'text' && {
            }),
            ...(ownerState.variant === 'outlined' && {
              color: theme.text.primary,
              border: `1px solid ${theme.text.primary}`,
            }),
            ...(ownerState.disabled === true && {
              cursor: 'not-allowed !important',
            }),
            ...(ownerState.size === 'small' && {
              height: '32px',
              lineHeight: '32px',
            }),
            "&:hover": {
              boxShadow: 'none',
              ...(ownerState.variant === 'contained' && {
                backgroundColor: addOpacityToColor(theme.text.primary, 0.9),
              }),
              ...(ownerState.variant === 'text' && {
                backgroundColor: theme.background.paper2,
              }),
              ...(ownerState.variant === 'outlined' && {
                backgroundColor: theme.background.paper2,
              }),
              ...(ownerState.color === "neutral" && {
                color: theme.text.primary,
              }),
            },
          };
        },
        startIcon: {
          marginLeft: 0,
          marginRight: 12,
          '>*:nth-of-type(1)': {
            fontSize: 14,
          }
        }
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          padding: '4px',
          borderRadius: '10px',
          backgroundColor: theme.background.paper,
          boxShadow: custom.selectPopupBoxShadow,
        },
        list: {
          paddingTop: '0px !important',
          paddingBottom: '0px !important',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          height: '40px',
          borderRadius: '5px',
          ':hover': {
            backgroundColor: theme.background.paper2,
          },
          '&.Mui-selected': {
            fontWeight: '500',
            backgroundColor: `${custom.selectedMenuItemBgColor} !important`,
            color: theme.primary.main,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          'h2.MuiTypography-root button': {
            marginRight: '2px',
          },
          '.MuiDialogActions-root': {
            paddingTop: '24px',
            button: {
              width: '88px',
              height: '36px !important',
            },
            '.MuiButton-text': {
              width: 'auto',
              minWidth: 'auto',
              color: `${theme.text.primary} !important`,
            },
          }
        },
        container: {
          height: "100vh",
          bgcolor: theme.text.secondary,
          backdropFilter: 'blur(5px)',
        },
        paper: {
          pb: 1,
          border: '1px solid',
          borderColor: theme.divider,
          borderRadius: "10px",
          backgroundColor: theme.background.paper,
          'textarea': {
            borderRadius: "8px 8px 0 8px",
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingTop: '24px',
          '> button': {
            top: '20px',
          }
        }
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          label: {
            color: theme.text.secondary,
          },
          'label.Mui-focused': {
            color: theme.text.primary,
          },
          '& .MuiInputBase-input::placeholder': {
            fontSize: '12px',
          }
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
          backgroundColor: theme.background.paper2,
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: `${theme.background.paper2} !important`,
            borderWidth: '1px !important',
          },
          '&.Mui-focused': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: `${theme.text.primary} !important`,
              borderWidth: '1px !important',
            }
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: `${theme.text.primary} !important`,
              borderWidth: '1px !important',
            }
          },
          input: {
            height: '19px',
          }
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          height: '36px',
          borderRadius: '10px !important',
          backgroundColor: theme.background.paper2,
        },
        select: {
          paddingRight: '0 !important',
        }
      },
    },
  }
}

export default componentStyleOverrides