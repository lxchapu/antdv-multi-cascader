export interface Option {
  value: string
  label: string
  isLeaf: boolean
  isChecked?: boolean
  isLoading?: boolean
  children?: Option[]
}
export type Menu = Option[]