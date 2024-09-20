import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react'


const ButtonWithModal = ({handleSubmit}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button
        bg={"#203449"}
        color={"white"}
        _hover={{
          bg: "#88B788",
        }}
        width={"100px"}
        justifyItems={"center"}
        type="button"
        onClick={onOpen}
      >
        Submit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are You Sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Entry once submitted cannot be edited.
          </ModalBody>

          <ModalFooter>
            <Button
              bg={"#88B788"}
              color={"white"}
              _hover={{
                bg: "#88B788",
              }}
              type="submit"
              onClick={handleSubmit}
              // isLoading={loading}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ButtonWithModal