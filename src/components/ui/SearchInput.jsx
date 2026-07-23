import { Search } from 'lucide-react'
import Input from './Input.jsx'

function SearchInput({
  leadingIcon = <Search />,
  trailingIcon,
  fullWidth = true,
  size = 'md',
  ...inputProps
}) {
  return (
    <Input
      {...inputProps}
      type="search"
      variant="subtle"
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      fullWidth={fullWidth}
      size={size}
    />
  )
}

export default SearchInput
