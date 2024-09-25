import { Box, Button, chakra, Flex, Grid, GridItem, Link, Select, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import privateUserRoute from '../routers/privateUserRoute';
import { Formik } from "formik";
import { toast } from 'react-toastify';
import NextLink from 'next/link';
import FileInput from '../components/FileInput';
import { uploadFile } from '../action/uploadFile';
import ButtonWithModal from '../components/ButtonWithModal';
import { getEntries, submitEntries } from '../action/entries';
import ContentLoader from '../components/ContentLoader';
import SelectField from '../components/SelectField';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const options = [
  { value: "Idea Presentation Track", label: "Idea Presentation Track" },
  { value: "Paper Presentation Track", label: "Paper Presentation Track" },
]

const PaperPresentation = () => {
  const textColor = useColorModeValue("white", "white");
  const [submission, setSubmission] = useState()
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values) => {
    console.log(values);
    if (!values?.file?.name) {
      toast.error('Please Select a file')
      return;
    }
    if (values.type === 'Paper Presentation Track' && !values?.file_paper?.name) {
      toast.error('Please Select a file')
      return;
    }
    if (values.file.size > 2000000) {
      toast.error('File Size Exceeded');
      return;
    }
    if (values.type === 'Paper Presentation Track' && values.file_paper.size > 2000000) {
      toast.error('File Size Exceeded');
      return;
    }
    try {
      setLoading(true);
      const data = await uploadFile(values.file)
      if (data?.error) {
        toast.error('Someting Went Wrong')
        setLoading(false);
        return
      }
      let paper_data = undefined;
      if (values.type === 'Paper Presentation Track') {
        paper_data = await uploadFile(values.file_paper);
        if (paper_data?.error) {
          toast.error('Something went wrong');
          setLoading(false);
          return;
        }
      }
      const entryData = await submitEntries({
        type: values.type,
        submission_paper: paper_data?.submission,
        abstract: data.submission
      }, 'paper');
    
      if (entryData?.error) {
        toast.error(entryData?.error);
        setLoading(false);
        return;
      }
      setSubmission(entryData.submission);
     
      toast.success('Entry Submitted Successfully');
    } catch (e) {
      console.log(e)
      toast.error('Someting Went Wrong')
    }
    setLoading(false);
  }
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries('paper');
        if (entryData?.error) {
          console.log(entryData?.error);
        }
        setSubmission(entryData?.submission);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    fetchSubmission();
  }, [setSubmission])
  const [tabIndex, setTabIndex] = useState(0)
  return !loading ? (
    <Layout>
      <Box
        pt={10}
        width={"full"}
        pb={"20px"}
        px={{
          base: '16px',
          md: '48px',
          lg: '64px'
        }}
      >
        <NextLink href='/dashboard'>
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
        <chakra.h1
          py={5} fontSize={40} fontWeight={"bold"} color={textColor}
        >
          Paper Presentation
        </chakra.h1>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={10}
        >
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>
                  Idea Submission
                </Tab>
                <Tab fontSize={20}>Paper Submission</Tab>
                <Tab fontSize={20}>Round 2</Tab>
              </TabList>
              <TabPanels bg={"rgba(165, 151, 39, 0.7)"}>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize='2xl'>
                      Idea Submission Track
                    </Text>
                    <Text fontSize='lg'>
                      1. An abstract or synopsis (maximum 500 words) of the research idea needs to be submitted in PDF format.
                    </Text>
                    <Text fontSize='lg'>
                      2. For abstract submission, click <Link href='https://docs.google.com/document/d/1RawQNTuj6A72vVJIE2zS7SuhaUIbde8Z/edit?usp=sharing&ouid=114207401037452959347&rtpof=true&sd=true' target={"_blank"} color={"blue.500"}>here</Link> to view the template
                    </Text>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize='2xl'>
                      Paper Presentation Track
                    </Text>
                    <Text fontSize='lg'>
                      1. A PDF file of the paper and abstract should be submitted.
                    </Text>
                    <Text fontSize='lg'>
                      2. For abstract submission, click <Link href='https://docs.google.com/document/d/1RawQNTuj6A72vVJIE2zS7SuhaUIbde8Z/edit?usp=sharing&ouid=114207401037452959347&rtpof=true&sd=true' target={"_blank"} color={"blue.500"}>here</Link> to view the template
                    </Text>
                    <Text fontSize='lg'>
                      3. For paper submission, the ACM - SIG Proceedings Template is preferable, but not required.
                    </Text>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Text fontSize='2xl'>
                    Round 2
                  </Text>
                  <Text fontSize='xl'>
                    1. Papers/Ideas must fall under one of the following domains – Blockchain, AI & ML.
                  </Text>
                  <Text fontSize='xl'>
                    2. Ensure that your submission is a fully developed research paper, not merely an idea or abstract for the paper presentation.
                  </Text>
                  <Text fontSize='xl'>
                    3. For idea presentation, it must be a document that includes the idea, abstract, details, approach, and advantages. Anything else is a bonus.
                  </Text>
                  <Text fontSize='xl'>
                    4. The paper must be the original work of the participant; any plagiarized content will result in immediate disqualification.
                  </Text>
                  <Text fontSize='xl'>
                    5. All the rounds are elimination rounds.
                  </Text>
                  <Text fontSize='xl'>
                    6 .Participants must submit their papers or ideas in PDF format.
                  </Text>
                  <Text fontSize='xl'>
                    7 .The decision of the judges will be final and binding.
                  </Text>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
          {
            submission?.id ?
              (
                <GridItem>
                  <Flex
                    minH={"200px"}
                    border={'2px solid primaries.100'}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDirection={'column'}
                    gap={5}
                  >
                    <Text fontSize={'2xl'} textAlign={"center"} color={textColor}>You have already submitted your entry</Text>
                    <Link
                      href={submission.submission_abstract}
                      bg={"#203449"}
                      px={4}
                      py={1}
                      color={"white"}
                      _hover={{
                        bg: "#88B788",
                      }}
                      borderRadius={'md'}
                      fontSize={20}
                    >
                      Download Abstract
                    </Link>
                    {
                      submission.type === 'Paper Presentation Track' && (
                        <Link
                          href={submission.submission_paper}
                          bg={"#203449"}
                          px={4}
                          py={1}
                          color={"white"}
                          _hover={{
                            bg: "#88B788",
                          }}
                          borderRadius={'md'}
                          fontSize={20}
                        >
                          Download Paper
                        </Link>
                      )
                    }
                  </Flex>
                </GridItem>
              ) : (
                <GridItem>
                  <Formik
                    initialValues={{ file: {}, type: '', file_paper: {} }}
                    onSubmit={handleSubmit}
                  >
                    {({ handleBlur, handleChange, values, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Stack
                          spacing={8}
                        >
                          <SelectField
                            name='type'
                            value={values.type}
                            label='Paper Type'
                            placeholder={'Please Select an Option'}
                            options={options}
                            onChange={handleChange}
                            onBlur={handleBlur}

                          />
                          <FileInput
                            accept={'.doc,.docx,.pdf'}
                            label='Upload Your Abstract ( .doc, .docx or .pdf upto 2 mb )'
                            name='file'
                            onBlur={handleBlur}
                            bg={"rgba(165, 151, 39, 0.7)"}
                          />
                          {
                            values.type === 'Paper Presentation Track' && <FileInput
                              accept={'.doc,.docx,.pdf'}
                              label='Upload Your Paper ( .doc, .docx or .pdf upto 2 mb )'
                              name='file_paper'
                              onBlur={handleBlur}
                              bg={"rgba(165, 151, 39, 0.7)"}
                            />
                          }
                          <ButtonWithModal
                            handleSubmit={() => handleSubmit(values)}
                          />
                        </Stack>
                      </form>
                    )}
                  </Formik>
                </GridItem>
              )
          }
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader />
  )
}

export default privateUserRoute(PaperPresentation)