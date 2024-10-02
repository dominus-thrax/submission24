import { Box, Button, chakra, Flex, Grid, GridItem, Heading, Link, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import privateUserRoute from '../../routers/privateUserRoute';
import { Formik } from "formik";
import { toast } from 'react-toastify';
import FileInput from '../../components/FileInput';
import NextLink from 'next/link';
import { uploadFile } from '../../action/uploadFile';
import ButtonWithModal from '../../components/ButtonWithModal';
import { getEntries, getStatus, submitEntries } from '../../action/entries';
import ContentLoader from '../../components/ContentLoader';
import { ChevronLeftIcon, DownloadIcon } from '@chakra-ui/icons';
import { dateString } from '../../utils/dateString';
import AppContext from '../../context/AppContext';
import { useRouter } from 'next/router';
const Dataquest = () => {
    const textColor = useColorModeValue("white", "white");
    const [submissions, setSubmissions] = useState();
    const [loading, setLoading] = useState(true);
    const cardBg = useColorModeValue("white.100", "secondaries.800");
    const { user } = useContext(AppContext);
    const senior = user.year === 'TE' || user.year === 'BE';
    const router=useRouter();
    const handleSubmit = async (values) => {
        if (!values?.file_csv?.name) {
            toast.error('Please Select a CSV file')
            return;
        }
        if (!values?.file_python?.name) {
            toast.error('Please Select a python or notebook file')
            return;
        }
        if (values.file_csv.size > 5000000) {
            toast.error('File Size of CSV Exceeded');
            return;
        }
        if (values.file_python.size > 5000000) {
            toast.error('File Size of pyhon/notebook file Exceeded');
            return;
        }
        try {
            setLoading(true);
            const data = await uploadFile(values.file_csv)
            if (data?.error) {
                toast.error('Someting Went Wrong')
                setLoading(false);
                return
            }
            const data_python = await uploadFile(values.file_python)
            if (data_python?.error) {
                toast.error('Someting Went Wrong')
                setLoading(false);
                return
            }
            const entryData = await submitEntries({
                submission_csv: data.submission,
                submission_python: data_python.submission
            }, 'dataquest2');
            if (entryData?.error) {
                toast.error(entryData?.error);
                setLoading(false);
                return;
            }
            setSubmissions(
                submissions?.length > 0 ? [...submissions, entryData.submission] : [entryData.submission]
            );
            toast.success('Entry Submitted Successfully');
        } catch (e) {
            console.log(e)
            toast.error('Someting Went Wrong')
        }
        setLoading(false);
    }
    useEffect(() => {
        if(!senior)
        {
            router.push('/dashboard');
            toast.error("second round is for TE-BE only");
        }
        const fetchStatus=async()=>
            {
                try
                {
                    const res=await getStatus("dataquest2");
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
        const fetchSubmission = async () => {
            try {
                const entryData = await getEntries('dataquest2');
                if (entryData?.error) {
                    console.log(entryData?.error);
                }
                setSubmissions(entryData?.submissions);
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        }
        fetchSubmission();
    }, [setSubmissions])
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
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
                    </chakra.h3>
                </NextLink>
                <Box py={5}>
                    <chakra.h1
                        fontSize={40}
                        fontWeight={"bold"}
                        color={textColor}
                    >
                        DataQuest Round 2 {senior ? "( TE-BE )" : "( FE-SE )"}
                    </chakra.h1>
                    <NextLink href='/dataquest2/leaderboard'>
                        <chakra.span
                            fontWeight={"bold"}
                            fontSize={20}
                            textTransform={"uppercase"}
                            color={"#5FAB63"}
                            cursor="pointer"
                        >
                            <span>View Leaderboard</span>
                        </chakra.span>
                    </NextLink>
                </Box>
                <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    gap={10}
                >
                    <GridItem>
                        <Tabs onChange={(index) => setTabIndex(index)}>
                            <TabList color={textColor}>
                                <Tab fontSize={20}>
                                    Problem
                                </Tab>
                                <Tab fontSize={20}>Rules</Tab>
                                <Tab fontSize={20}>My Submissions</Tab>
                            </TabList>
                            <TabPanels  bg={"#2F220D"}>
                                <TabPanel color={textColor}>
                                    <Stack spacing={3}>
                                        <Text fontSize='2xl'>
                                            Problem Statement
                                        </Text>
                                        <Text fontSize='xl'>
                                            click <Link href={"https://drive.google.com/drive/folders/1oCs1aIDCapeBVNTmacJoDMaj_b5h0RqB"} target={"_blank"} color={"blue.500"}>here</Link> to view the problem statement and dataset.
                                        </Text>
                                        <Text fontSize='xl'>
                                            - Participants are given 3 csv files namely train.csv, test.csv and sample_submission.csv
                                        </Text>
                                        <Text fontSize='xl'>
                                            - Participants have to use train and test files and build a model based on it and by referring to the sample submission they would have to submit a submisssion.csv file and a .ipynb/.py file on our submission platform.
                                        </Text>
                                    </Stack>
                                </TabPanel>
                                <TabPanel color={textColor}>
                                    <Stack spacing={3}>
                                        <Text fontSize='2xl'>
                                            Rules
                                        </Text>
                                        <Text fontSize='xl'>
                                            1. The problem statement along with the dataset will be released on the platform.
                                        </Text>
                                        <Text fontSize='xl'>
                                            2. The link for the contest will be shared with the participants through email.
                                        </Text>
                                        <Text fontSize='xl'>
                                           3.  Participants are expected to submit their CSV files along with .ipynb/.py files.
                                        </Text>
                                        <Text fontSize='xl'>
                                            4. You can view the public leaderboard to compete against the best of the best solutions and achieve better results.
                                        </Text>
                                        <Text fontSize='xl'>
                                            5. The right to decide the optimization metric will rest with the judges and it will be final and binding (example: RMSE, MAE, or R² for regression problems; Accuracy, Precision, F1-Score, or AUC-ROC for classification problems).
                                        </Text>
                                        <Text fontSize='xl'>
                                           6.  Any unfair means will lead to immediate disqualification.
                                        </Text>
                                        <Text fontSize='xl'>
                                            7. Every round is an elimination round.
                                        </Text>
                                        <Text fontSize='xl'>
                                            8. The right to decide the optimization metric will rest with the judges and it will be final and binding.
                                        </Text>
                                    </Stack>
                                </TabPanel>
                                <TabPanel color={textColor}>
                                    <Stack spacing={3}>
                                        {
                                            submissions?.map((submission) => {
                                                const acc = submission.public_accuracy
                                                return (
                                                    <Flex
                                                        justifyContent={'space-between'}
                                                        alignItems={"center"}
                                                        p={6}
                                                        rounded={"lg"}
                                                        border={"1px"}
                                                        borderColor={"white"}
                                                        gap={5}
                                                        key={submission?.id?.toString()}
                                                        boxShadow={"md"}
                                                    >
                                                        <Flex
                                                            flexDirection={"column"}
                                                            gap={5}
                                                        >
                                                            <Text fontSize='lg'>{dateString(submission.created_at)}</Text>
                                                            <Text fontSize='lg'>{senior ? "F1 Score: " : "Mean Square Error : "} {acc.toPrecision(5)}</Text>
                                                        </Flex>
                                                        <Link href={submission.submission_csv}>
                                                            <DownloadIcon fontSize={'lg'} />
                                                        </Link>
                                                    </Flex>
                                                )
                                            })
                                        }
                                    </Stack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </GridItem>
                    <GridItem>
                        <Formik
                            initialValues={{
                                file_csv: {},
                                file_python: {},
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ handleBlur, handleChange, values, handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <Stack
                                        spacing={5}
                                    >
                                        <Box>
                                            <chakra.h3
                                                color={"green.400"}
                                                fontSize={'3xl'}
                                             
                                            >
                                                Submit your Entry
                                            </chakra.h3>
                                            <Text fontSize={'lg'} color={textColor}>maximum 3 entries per day</Text>
                                        </Box>
                                        <FileInput
                                            accept={'.csv'}
                                            label='Upload Your CSV ( .csv upto 5mb )'
                                            name='file_csv'
                                            onBlur={handleBlur}
                                            bg={"#2F220D"}
                                        />
                                        <FileInput
                                            accept={'.py,.ipynb'}
                                            label='Upload Your python or notebook file ( .py, .ipynb upto 5mb )'
                                            name='file_python'
                                            onBlur={handleBlur}
                                            bg={"#2F220D"}
                                        />
                                        <ButtonWithModal handleSubmit={() => handleSubmit(values)} />
                                    </Stack>
                                </form>
                            )}
                        </Formik>
                    </GridItem>
                </SimpleGrid>
            </Box>
        </Layout>
    ) : (
        <ContentLoader />
    )
}

export default privateUserRoute(Dataquest)