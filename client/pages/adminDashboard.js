import React, { useState, useEffect } from 'react';
import {
  Box,
  Switch,
  Input,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
  Divider,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react';
import axios from 'axios';
import apiConfig from '../configs/api';
import { useRouter } from "next/router";
import { ChevronDownIcon} from "@chakra-ui/icons";


const INITIAL_GET_API = `${apiConfig.url}/allevents/events`;
const SAVED_GET_API = `${apiConfig.url}/submission/get`;
const SAVE_POST_API = `${apiConfig.url}/submission/post`;
const UPDATE_PATCH_API = `${apiConfig.url}/submission/update`; // Fixed typo

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const [submissionevents, setSubmissionevents] = useState([]);
   const route=useRouter();
  const toast = useToast();
  const admin=JSON.parse(localStorage.getItem("admin"));
  const fetchInitialEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(INITIAL_GET_API);
      const fetchedEvents = response.data;

      const initializedEvents = fetchedEvents.map(event => ({
        id: event.id,
        name: event.name,
        status: false,
        route: '',  
      }));

      setEvents(initializedEvents);
    } catch (error) {
      console.error('Failed to fetch initial events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch events. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedEvents = async () => {
    
    if(admin){
    try {
      setLoading(true);
      const response = await axios.get(SAVED_GET_API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`, // Add the token in the Authorization header
        },
      });
      const savedEvents = response.data;
      const initializedEvents = savedEvents.map(event => ({
        id: event.event_id,
        name: event.event_name,
        status: event.event_status,
        route: event.event_route,  
      }));
      
      setSubmissionevents(initializedEvents);
    } catch (error) {
      console.error('Failed to fetch saved events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch saved events. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };}

  useEffect(() => {
    const initialize = async () => {
      await fetchInitialEvents();
      await fetchSavedEvents();
    };
    initialize();
  }, []);

  // Handle toggling for events array
  const handleToggleEvent = (eventId) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: !event.status } : event
      )
    );
  };

  // Handle toggling for submissionevents array
  const handleToggleSubmissionEvent = (eventId) => {
    setSubmissionevents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: !event.status } : event
      )
    );
  };

  // Handle route change for events array
  const handleRouteChange = (eventId, newRoute) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, route: newRoute } : event
      )
    );
  };

  // Handle route change for submissionevents array
  const handleSubmissionRouteChange = (eventId, newRoute) => {
    setSubmissionevents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, route: newRoute } : event
      )
    );
  };

  // Add new event (using POST API)
  
  const handleAddEvent = async (event) => {
    const { id, name, status, route } = event;
    if(admin){
    if (!route.trim()) {
      toast({
        title: 'Invalid Input',
        description: `Please provide a valid route for "${name}".`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

   
    try {
      setSaving(prev => ({ ...prev, [id]: true }));

      await axios.post(SAVE_POST_API, { id, name, status, route },{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`, // Add the token in the Authorization header
        },
      });

      toast({
        title: 'Success',
        description: `Event "${name}" added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refetch saved events to update the state
      await fetchSavedEvents();
    } catch (error) {
      console.error(`Failed to add event "${name}":`, error);
      toast({
        title: 'Error',
        description: `Failed to add event "${name}". Please try again.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };}

  // Update existing event (using PATCH API)
 
  const handleUpdateEvent = async (event) => {
    const { id, name, status,route } = event;
    if(admin){
    try {
      setSaving(prev => ({ ...prev, [id]: true }));

      await axios.patch(`${UPDATE_PATCH_API}/${id}`, { status,route },{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`, // Add the token in the Authorization header
        },
      });

      toast({
        title: 'Success',
        description: `Event "${name}" updated successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refetch saved events to update the state
      await fetchSavedEvents();
    } catch (error) {
      console.error(`Failed to update event "${name}":`, error);
      toast({
        title: 'Error',
        description: `Failed to update event "${name}". Please try again.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };
  }

  const handleLogout=async()=>
  {
    if (admin) {
      const options = {
        method: "post",
        url: `${apiConfig.url}/admin/signout`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
      };
      try {
        const res = await axios(options);
        //console.log("logout res:",res);
        localStorage.removeItem("admin");
        toast({
          title: 'Success',
          description: `logout successful`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (e) {
        console.log(e);
        toast({
          title: 'Error',
          description: `something went wrong`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }
  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh" bg="gray.50">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" justify="center" align="center" minHeight="100vh" bg="gray.50" p={6}>
      <Box
        w="100%"
        maxWidth="800px"
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Flex gap={6}>
        <Button onClick={()=>handleLogout()}>Logout</Button>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Result
          </MenuButton>
          <MenuList>
            <MenuItem onClick={()=>route.push('/result')}>Result</MenuItem>
            <MenuItem>Abstract</MenuItem>
          </MenuList>
        </Menu>
        </Flex>
        <Text fontSize="3xl" mb={6} fontWeight="bold" textAlign="center" color="teal.600">
          Admin Panel
        </Text>
       
        <Divider mb={6} />
        
        <VStack spacing={8} align="stretch">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Event Name</Th>
                <Th>Status</Th>
                <Th>Route</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map(event => (
                <Tr key={event.id}>
                  <Td>{event.name}</Td>

                  <Td>
                    <Switch
                      colorScheme="teal"
                      isChecked={event.status}
                      onChange={() => handleToggleEvent(event.id)}
                    />
                  </Td>
                  <Td>
                    <Input
                      placeholder="Enter route (e.g., /web-n-app)"
                      value={event.route}
                      onChange={(e) => handleRouteChange(event.id, e.target.value)}
                      bg="white"
                      borderColor="teal.400"
                      focusBorderColor="teal.600"
                    />
                  </Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      onClick={() => handleAddEvent(event)}
                      isLoading={saving[event.id]}
                      loadingText="Saving"
                    >
                      Add
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Box>

      <Box
        w="100%"
        maxWidth="800px"
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
      >
        <Text fontSize="3xl" mb={6} fontWeight="bold" textAlign="center" color="teal.600">
          Update Events
        </Text>
        <Divider mb={6} />

        <VStack spacing={8} align="stretch">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Event Name</Th>
                <Th>Status</Th>
                <Th>Route</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {submissionevents.map(event => (
                <Tr key={event.id}>
                  <Td>{event.name}</Td>

                  <Td>
                    <Switch
                      colorScheme="teal"
                      isChecked={event.status}
                      onChange={() => handleToggleSubmissionEvent(event.id)}
                    />
                  </Td>
                  <Td>
                    <Input
                      placeholder="Enter route (e.g., /web-n-app)"
                      value={event.route}
                      onChange={(e) => handleSubmissionRouteChange(event.id, e.target.value)}
                      bg="white"
                      borderColor="teal.400"
                      focusBorderColor="teal.600"
                    />
                  </Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      onClick={() => handleUpdateEvent(event)}
                      isLoading={saving[event.id]}
                      loadingText="Saving"
                    >
                      Update
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Box>
    </Flex>
  );
};

export default AdminPage;
