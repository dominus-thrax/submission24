import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import React from 'react'

const SelectField = ({ name, placeholder, label, options, ...otherProps }) => {
    const { errors, touched } = useFormikContext();
    return (
        <FormControl id={name}>
            <FormLabel fontWeight={"semibold"}>{label}</FormLabel>
            <Select
                placeholder={placeholder}
                name={name}
                w={'100%'}
                {...otherProps}
                color={"white"}
                
            >
                {
                    options.map((item) => (
                        <option value={item.value} key={item.value}>{item.label}</option>
                    ))
                }
            </Select>
            {errors[name] && touched[name] && <p color="red">{errors[name]}</p>}
        </FormControl>
    )
}

export default SelectField