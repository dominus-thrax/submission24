import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { useContext, useState } from "react";
import Layout from "../components/Layout";
import FormField from "../components/FormField";
import { userLogin } from "../action/user";
import AppContext from "../context/AppContext";
import publicRoute from "../routers/publicRoute";

const validateSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required")
});

function Loginpage() {

  const { dispatchUser, dispatchEvents } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    //console.log(values);
    try {
      setLoading(true);
      const data = await userLogin(values, 'user', dispatchUser, dispatchEvents);
      if (data?.error) {
        toast.error(data.error);
      }
    } catch (e) {
      console.log(e)
      toast.error('Something Went Wrong')
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        px={{
          base: '16px',
          md: '48px',
          lg: '64px'
        }}
        py={"1px"}
        w={"100%"}
      >
        <Flex
          align={"center"}
          justify={"center"}
          opacity={0.8}
          
          rounded={useColorModeValue("", "lg")}
          bg={useColorModeValue("white.100", "secondaries.800")}
        >
          <Stack spacing={"1"} py={12} px={4}
             bg={'#536F53'}
             rounded={"xl"}
            >
            <Stack align={"center"}>
              <Heading fontFamily={'vt323, monospace'} fontSize={"4xl"} color={"white"}>Sign in to your account </Heading>
            </Stack>
            <Box
             
              px={"5"}
              py={"4"}         
            >
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validateSchema}
                onSubmit={handleLogin}
              >
                {({ handleBlur, handleChange, values, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={"3"}>
                      <FormField
                        type="email"
                        placeholder="Email"
                        name="email"
                        label="Email Address"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <FormField
                        label="Password"
                        type='password'
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                      />
                      <Button
                        bg={"#BE913E"}
                        color={"white"}
                        _hover={{
                          bg: "CCBA63",
                        }}
                        type="submit"
                        isLoading={loading}
                        fontSize={30}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Box>
          </Stack>
        </Flex>
      </Flex>
    </Layout>

  );
}

export default publicRoute(Loginpage);