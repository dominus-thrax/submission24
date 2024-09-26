import {
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useFormikContext } from 'formik';

const FormField = ({ label, name, placeholder, ...otherProps }) => {
  const { errors, touched } = useFormikContext()
  return (
    <FormControl id={name}>
      <FormLabel fontSize={"20px"} color={"white"}>{label}</FormLabel>
      <Input
        name={name}
        placeholder={placeholder}
        w={"100%"}
        {...otherProps}
        color={"#FFFFFF"}
        border={"#CFC36D"}
      />
      {errors[name] && touched[name] && <p color="red">{errors[name]}</p>}
    </FormControl>
  )
}

export default FormField