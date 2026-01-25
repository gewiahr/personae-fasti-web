import type { EntityEdit } from "../../../types/entities";

type InputProps = {
  entityEdit?: EntityEdit;
  label?: string;
  labelBGColor?: string;
  error?: string;
  className?: string;
};

export type TextInputProps = InputProps & {
  value?: string;
}

export type NumericInputProps = InputProps & {
  value?: number;
}