import React from 'react';
import {
  Text,
  Flex,
  Card,
  CardBody,
  VStack,
  Progress,
  Button,
  Link
} from '@chakra-ui/react';

export default function ProductCard({name, id, stage, party, progress}) {

  const trackingRoute = "/track/" + id;

  return (<>
   <Card mx="10px" my="20px" overflow='hidden' variant='outline' maxW="90%" bgColor="blackAlpha.300" color="white">
        <CardBody mt="-7px">
        <Flex align="center" justify="space-between" w="100%">
            <VStack align="start" h="90px" w="80%">
                
                <Text>Name: {name} | ID: {id} | Party: <Link isExternal href={"https://sepolia.etherscan.io/address/" + party.toString()}>{party}</Link> | Stage: {stage} </Text>
                
                <Progress align="left" height="16px" color="white" w="100%" value={progress}/>
                
            </VStack>
            <Link href={trackingRoute}><Button variant='outline' mx="5px" my="5px" _hover={{ backgroundColor: "blue.800", borderColor: "blue.300" }}>View History</Button></Link>
            </Flex>
        </CardBody>
    </Card>
      </>)
}