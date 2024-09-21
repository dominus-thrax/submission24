import React, { useState, useEffect } from 'react';
import {
  Box,
  Switch,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  Spinner,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const INITIAL_GET_API = 'https://pulzion22-ems-backend-2.onrender.com/events';
const SAVED_GET_API = 'http://ec2-18-212-109-220.compute-1.amazonaws.com:3001/allevents';
const SAVE_POST_API = 'http://ec2-18-212-109-220.compute-1.amazonaws.com:3001/submission/post';
const UPDATE_PATCH_API = 'http://ec2-18-212-109-220.compute-1.amazonaws.com:3001/submission/update';

const AdminPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});
  const toast = useToast();

  const fetchInitialEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(INITIAL_GET_API);
      const fetchedEvents = response.data.events;

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
    try {
      setLoading(true);
      const response = await axios.get(SAVED_GET_API);
      const savedEvents = response.data.events;

      const mergedEvents = events.map(event => {
        const savedEvent = savedEvents.find(se => se.id === event.id);
        if (savedEvent) {
          return {
            ...event,
            status: savedEvent.status,
            route: savedEvent.route,
          };
        }
        return event;
      });

      setEvents(mergedEvents);
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
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchInitialEvents();
      await fetchSavedEvents();
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const handleToggle = (eventId) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, status: !event.status } : event
      )
    );
  };

  
  const handleRouteChange = (eventId, newRoute) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, route: newRoute } : event
      )
    );
  };

  
  const handleSave = async (event) => {
    const { id, name, status, route } = event;

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

      
      const savedEvent = events.find(e => e.id === id && (e.route || e.status));

      if (!savedEvent || (savedEvent.route === '' && savedEvent.status === false)) {
        
        await axios.post(SAVE_POST_API, {
          id,
          name,
          status,
          route,
        });
        toast({
          title: 'Success',
          description: `Configuration for "${name}" saved successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        
        await axios.patch(`${UPDATE_PATCH_API}/${id}`, {
          status,
          route,
        });
        toast({
          title: 'Success',
          description: `Configuration for "${name}" updated successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      // Refetch saved events to update the state
      await fetchSavedEvents();
    } catch (error) {
      console.error(`Failed to save/update configuration for "${name}":`, error);
      toast({
        title: 'Error',
        description: `Failed to save/update configuration for "${name}". Please try again.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh" bg="gray.50">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex justify="center" align="center" minHeight="100vh" bg="gray.50" p={6}>
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
          Admin Panel
        </Text>
        <Divider mb={6} />
        <VStack spacing={8} align="stretch">
          {events.map(event => (
            <Box
              key={event.id}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              transition="background-color 0.3s ease"
            >
              <HStack justify="space-between" mb={4}>
                <Text fontSize="xl" fontWeight="semibold" color="teal.700">
                  {event.name}
                </Text>
                <Switch
                  colorScheme="teal"
                  isChecked={event.status}
                  onChange={() => handleToggle(event.id)}
                />
              </HStack>
              <FormControl>
                <FormLabel fontWeight="medium">Route</FormLabel>
                <Input
                  placeholder="Enter route (e.g., /web-n-app)"
                  value={event.route}
                  onChange={(e) => handleRouteChange(event.id, e.target.value)}
                  bg="white"
                  borderColor="teal.400"
                  focusBorderColor="teal.600"
                />
              </FormControl>
              <Button
                mt={6}
                w="full"
                colorScheme="teal"
                onClick={() => handleSave(event)}
                isLoading={saving[event.id]}
                loadingText="Saving"
              >
                {(event.status || event.route) ? 'Update' : 'Save'}
              </Button>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default AdminPage;











































// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Switch,
//   FormLabel,
//   FormControl,
//   Input,
//   Button,
//   Flex,
//   Spinner,
//   Text,
//   VStack,
//   HStack,
// } from '@chakra-ui/react';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const AdminPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState({});
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [isEventSaved, setIsEventSaved] = useState({});

//   useEffect(() => {
//     const fetchInitialEvents = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('https://pulzion22-ems-backend-2.onrender.com/events');
//         const fetchedEvents = response.data.events;

//         const initializedEvents = fetchedEvents.map(event => ({
//           id: event.id,
//           name: event.name,
//           status: event.status || false,  
//           route: event.route || '',    
//           isSaved: false,           
//         }));

//         setEvents(initializedEvents);
//         setIsInitialLoad(false); 
//       } catch (error) {
//         console.error('Failed to fetch events:', error);
//         toast.error('Failed to fetch events. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialEvents();
//   }, []);

//   const handleToggle = (eventId) => {
//     setEvents(prevEvents =>
//       prevEvents.map(event =>
//         event.id === eventId ? { ...event, status: !event.status } : event
//       )
//     );
//   };

//   const handleRouteChange = (eventId, newRoute) => {
//     setEvents(prevEvents =>
//       prevEvents.map(event =>
//         event.id === eventId ? { ...event, route: newRoute } : event
//       )
//     );
//   };

//   const handleSave = async (event) => {
//     const { id, name, status, route } = event;

//     if (!route.trim()) {
//       toast.error(`Please provide a valid route for "${name}".`);
//       return;
//     }

//     try {
//       setSaving(prev => ({ ...prev, [id]: true }));

//       if (!route) {
//         await axios.post('http://ec2-18-212-109-220.compute-1.amazonaws.com:3001/submission/post', {
//           id,
//           name,
//           status,
//           route,
//         });

//         setIsEventSaved(prev => ({ ...prev, [id]: true }));
//         toast.success(`Configuration for "${name}" saved successfully.`);

//       } else {
//         await axios.patch(`http://ec2-18-212-109-220.compute-1.amazonaws.com:3001/submission/update/${id}`, {
//           route,
//           status,
//         });

//         toast.success(`Route for "${name}" updated successfully.`);
//       }
//     } catch (error) {
//       console.error(`Failed to save or update configuration for "${name}":`, error);
//       toast.error(`Failed to save or update configuration for "${name}". Please try again.`);
//     } finally {
//       setSaving(prev => ({ ...prev, [id]: false }));
//     }
//   };

//   const fetchUpdatedEvents = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://ec2-18-212-109-220.compute-1.amazonaws.com:3001/allevents');
//       const fetchedEvents = response.data.events;

//       const initializedEvents = fetchedEvents.map(event => ({
//         id: event.id,
//         name: event.name,
//         status: event.status || false, 
//         route: event.route || '', 
//         // isSaved: true, 
//       }));

//       setEvents(initializedEvents);
//     } catch (error) {
//       console.error('Failed to fetch updated events:', error);
//       toast.error('Failed to fetch updated events. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!isInitialLoad) {
//       fetchUpdatedEvents();
//     }
//   }, [isInitialLoad]);

//   if (loading) {
//     return (
//       <Flex justify="center" align="center" height="100vh">
//         <Spinner size="xl" />
//       </Flex>
//     );
//   }

//   return (
//     <Flex justify="center" align="center" minHeight="100vh" bg="gray.50" p={6}>
//       <Box
//         w="100%"
//         maxWidth="800px"
//         p={8}
//         borderWidth="1px"
//         borderRadius="lg"
//         boxShadow="lg"
//         bg="white"
//       >
//         <Text fontSize="3xl" mb={6} fontWeight="bold" textAlign="center" color="teal.600">
//           Admin Panel
//         </Text>
//         <Divider mb={6} />
//         <VStack spacing={8} align="stretch">
//           {events.map(event => (
//             <Box
//               key={event.id}
//               p={6}
//               borderWidth="1px"
//               borderRadius="lg"
//               boxShadow="md"
//               bg="gray.100"
//               _hover={{ bg: "gray.200" }}
//               transition="background-color 0.3s ease"
//             >
//               <HStack justify="space-between" mb={4}>
//                 <Text fontSize="xl" fontWeight="semibold" color="teal.700">
//                   {event.name}
//                 </Text>
//                 <Switch
//                   colorScheme="teal"
//                   isChecked={event.status}
//                   onChange={() => handleToggle(event.id)}
//                 />
//               </HStack>
//               <FormControl>
//                 <FormLabel fontWeight="medium">Route</FormLabel>
//                 <Input
//                   placeholder="Enter route (e.g., /web-n-app)"
//                   value={event.route}
//                   onChange={(e) => handleRouteChange(event.id, e.target.value)}
//                   bg="white"
//                   borderColor="teal.400"
//                   focusBorderColor="teal.600"
//                 />
//               </FormControl>
//               <Button
//                 mt={6}
//                 w="full"
//                 colorScheme="teal"
//                 onClick={() => handleSave(event)}
//                 isLoading={saving[event.id]}
//                 loadingText="Saving"
//               >
//                 {isEventSaved[event.id] ? 'Update' : 'Save'}
//               </Button>
//             </Box>
//           ))}
//         </VStack>
//       </Box>
//     </Flex>
//   );
// };

// export default AdminPage;
