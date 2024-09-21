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
import { getEntries, submitEntries } from "../action/entries";
import ContentLoader from "../components/ContentLoader";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const Freeze = () =>
{
  const textColor = useColorModeValue("white", "white");
  const [submission, setSubmission] = useState();
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values) =>
  {
    console.log(values);
    if (!values?.file?.name)
    {
      toast.error("Please Select a file");
      return;
    }
    console.log(values.file.size);
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
      console.log("freeze:",entryData);
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
      console.log(e);
      toast.error("Someting Went Wrong");
    }
    setLoading(false);
  };
  useEffect(() =>
  {
    const fetchSubmission = async () =>
    {
      try
      {
        const entryData = await getEntries("freeze");
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
            fontSize={20}
            textTransform={"uppercase"}
            color={"#5FAB63"}
            cursor="pointer"
            display={"flex"}
            alignItems={"center"}
          >
            <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
          </chakra.h3>
        </NextLink>
        <chakra.h1 py={5} fontSize={48} fontWeight={"bold"} color={textColor}>
          Freeze the second
        </chakra.h1>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>Theme</Tab>
                <Tab>Instructions</Tab>
              </TabList>
              <TabPanels bg={"rgba(165, 151, 39, 0.7)"}>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize="2xl">Theme</Text>
                    <Text fontSize="2xl">
                      Photographs on any theme will be accepted!
                    </Text>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize="2xl">Instructions</Text>
                    <Text fontSize="lg">
                      1. The participants will be required to submit their
                      entries through the submission platform!
                    </Text>
                    <Text fontSize="lg">
                      2.Photos must be in JPEG, JPG, or PNG format only.
                    </Text>
                    {/* <Text fontSize="lg">
                      3. You are required to provide a unique title &
                      description for each image submitted.
                    </Text> */}
                    <Text fontSize={"lg"}>
                      3. Advanced editing used to create illusions, deceptions
                      and/or manipulations, and the adding and removing of
                      significant elements within the frame is prohibited.
                    </Text>
                    <Text fontSize={"lg"}>
                      4. The decision of the organizers and judges will be final
                      and binding on all participants.
                    </Text>
                    <Text fontSize={"lg"}>
                      5. Only one photograph per person per entry .
                    </Text>
                    <Text fontSize={"lg"}>
                      6. No same photograph for two different entries.
                    </Text>
                    <Text fontSize={"lg"}>
                      7. Photograph taken from net won't be considered.
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
                <Text fontSize={"2xl"} textAlign={"center"}>
                  You have already submitted your entry
                </Text>
                <Link
                  href={submission.submission}
                  bg={"blue.400"}
                  px={4}
                  py={2}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  borderRadius={"md"}
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
                        bg={"rgba(165, 151, 39, 0.7)"}
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
