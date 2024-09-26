import
  {
    Box,
    Button,
    chakra,
    Flex,
    Grid,
    GridItem,
    Link,
    SimpleGrid,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useColorModeValue,
  } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import privateUserRoute from "../routers/privateUserRoute";
import { Formik } from "formik";
import { toast } from "react-toastify";
import NextLink from "next/link";
import FileInput from "../components/FileInput";
import { uploadFile } from "../action/uploadFile";
import ButtonWithModal from "../components/ButtonWithModal";
import { getEntries, submitEntries,getStatus } from "../action/entries";
import ContentLoader from "../components/ContentLoader";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useRouter } from 'next/router'

const Freeze = () =>
{
  const textColor = useColorModeValue("white", "white");
  const [submission, setSubmission] = useState();
  const [loading, setLoading] = useState(true);
  const router=useRouter();
  const handleSubmit = async (values) =>
  {
    //console.log(values);
    if (!values?.file?.name)
    {
      toast.error("Please Select a file");
      return;
    }
    //console.log(values.file.size);
    if (values.file.size > 10000000)
    {
      toast.error("File Size Exceeded");
      return;
    }
    try
    {
      setLoading(true);
      const data = await uploadFile(values.file);
      if (data?.error)
      {
        toast.error("Someting Went Wrong");
        setLoading(false);
        return;
      }
      const entryData = await submitEntries(data, "freeze");
      //console.log("freeze:",entryData);
      if (entryData?.error)
      {
        toast.error(entryData?.error);
        setLoading(false);
        return;
      }
      setSubmission(entryData.submission);
      toast.success("Entry Submitted Successfully");
    } catch (e)
    {
      //console.log(e);
      toast.error("Someting Went Wrong");
    }
    setLoading(false);
  };
  useEffect(() =>
  {
    
    const fetchStatus=async()=>
      {
          try
          {
              const res=await getStatus("freeze");
              //console.log(res.status);
              if(res.status!==true)
              {
                 router.push('/dashboard');
              }
          }catch(err)
          {
            console.log(err);
          }
      }
      fetchStatus();
    const fetchSubmission = async () =>
    {
      try
      {
        const entryData = await getEntries("freeze");
       // console.log(entryData.submission);
        if (entryData?.error)
        {
          console.log(entryData?.error);
        }
        setSubmission(entryData?.submission);
      } catch (e)
      {
        console.log(e);
      }
      setLoading(false);
    };
    fetchSubmission();
  }, [setSubmission]);
  const [tabIndex, setTabIndex] = useState(0);
  return !loading ? (
    <Layout>
      <Box
        pt={10}
        width={"full"}
        pb={"20px"}
        px={{
          base: "16px",
          md: "48px",
          lg: "64px",
        }}
      >
        <NextLink href="/dashboard">
          <chakra.h3
            fontWeight={"bold"}
            fontSize={24}
            textTransform={"uppercase"}
            color={"#5FAB63"}
            cursor="pointer"
            display={"flex"}
            alignItems={"center"}
          >
            <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
          </chakra.h3>
        </NextLink>
        <chakra.h1 py={5} fontSize={40} fontWeight={"bold"} color={textColor}>
          Freeze the second
        </chakra.h1>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>Theme</Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={"#2F220D"}>
                <TabPanel color={textColor}>
                  <Stack spacing={1}>
                    {/* <Text fontSize="2xl" fontWeight={"bold"}>Theme</Text> */}
                    <Text fontSize="xl">
                    Freeze the Second is an online photography contest where participants showcase stunning moments through their lens.
                    </Text>
                  </Stack>
                </TabPanel>
                <TabPanel color={textColor}>
                  <Stack spacing={3}>
                    {/* <Text fontSize="2xl">Instructions</Text> */}
              <Text fontSize="xl">
               1. Each participant must submit only one photograph.
              </Text>
              <Text fontSize="xl">
               2. Photographs must be taken by the submitting individual. images should not be sourced from the internet or captured by others.
              </Text>
              <Text fontSize="xl">
               3. Participants must upload their photographs to the submission platform within the designated timeslot.
              </Text>
              <Text fontSize="xl">
                4. Any use of unfair means will result in immediate disqualification.
              </Text>
              <Text fontSize="xl">
                5. The organizers decisions are final and binding for all participants.
              </Text>

                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
          {submission?.id ? (
            <GridItem>
              <Flex
                minH={"200px"}
                border={"2px solid primaries.100"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDirection={"column"}
                gap={5}
              >
                <Text fontSize={"2xl"} textAlign={"center"} color={textColor}>
                  You have already submitted your entry
                </Text>
                <Link
                  href={submission.submission}
                  bg={"#203449"}
                  px={4}
                  py={1}
                  color={"white"}
                  _hover={{
                    bg: "#2F220D",
                  }}
                  borderRadius={'md'}
                  fontSize={20}
                >
                  Download
                </Link>
                
              </Flex>
            </GridItem>
          ) : (
            <GridItem>
              <Formik initialValues={{ file: {} }} onSubmit={handleSubmit}>
                {({ handleBlur, handleChange, values, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={10}>
                      <FileInput
                        accept={'Image/*,.pdf'}
                        label='Upload Your Image ( .jpg, .jpeg or .png .pdf upto 10mb )'
                        name="file"
                        onBlur={handleBlur}
                        bg={"#2F220D"}
                      />
                      <ButtonWithModal
                        handleSubmit={() => handleSubmit(values)}
                      />
                    </Stack>
                  </form>
                )}
              </Formik>
            </GridItem>
          )}
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader />
  );
};

export default privateUserRoute(Freeze);
