import { FormControl, FormLabel } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import dynamic from 'next/dynamic'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
})

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link'],
        ['clean'],
        
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
]

export default function TextEditor({ label, name, placeholder, ...otherProps }) {
    const { errors, touched, values, setValues } = useFormikContext()
    const handleChange = (value) => {
        setValues({
            ...values,
            [name]: value,
        })
    }
    return (
        <FormControl id={name} >
            <FormLabel fontWeight={"semibold"}>{label}</FormLabel>
            <QuillNoSSRWrapper
                modules={modules}
                formats={formats}
                name={name}
                placeholder={placeholder}
                theme="snow"
                className='text-white'
                onChange={handleChange}
                {...otherProps}
                
            />
            {errors[name] && touched[name] && <p color="red">{errors[name]}</p>}
        </FormControl>
    )
}