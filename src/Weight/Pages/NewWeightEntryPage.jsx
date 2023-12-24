import React from 'react'
import WeightInput from '../Components/WeightInput'
import Calendar from '../Components/Calendar'
import {
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

const NewWeightEntryPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} rightIcon={<AddIcon />}>Add New Weight</Button>
      <Drawer placement='bottom' isOpen={isOpen} onClose={onClose} size='full'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>New Weight Entry</DrawerHeader>
          <DrawerBody>
            <form
              id='my-form'
              onSubmit={(e) => {
                e.preventDefault()
                console.log('submitted')
              }}
            >
              <Calendar/>
              <WeightInput/>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button type='submit' form='my-form'>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default NewWeightEntryPage