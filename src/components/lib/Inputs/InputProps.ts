import type { EntityEdit } from "../../../types/entities";

export type InputProps = {
  entityEdit?: EntityEdit;
  label?: string;
  labelBGColor?: string;
  error?: string;
  className?: string;
};

export type TextInputProps = InputProps & {
  value?: string;
  min?: string;
  max?: string;
  maxLength?: number;
}

export type NumericInputProps = InputProps & {
  value?: number;
}
