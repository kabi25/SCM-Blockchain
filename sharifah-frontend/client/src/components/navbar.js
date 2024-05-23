import React, { useEffect } from 'react';
import {
  Button,
  Center,
  Box,
  Text,
  Flex,
  Link,
  Heading,
  Image,
  HStack,
} from '@chakra-ui/react';
import { ConnectWallet, useAddress, useContract, useContractWrite} from '@thirdweb-dev/react';
import { contractAddress } from '../constants';

export default function Navbar() {
  const address = useAddress();
  const { isLoading, contract } = useContract(contractAddress);

  useEffect(() => {
    async function fetchData() {
      if(address && !isLoading) // logged in
      {
        const isNewParty = await contract.call('isNewParty', [address])
      }
    }
  
    fetchData();
  }, [address, contract, isLoading]);

  return (
    <>
      <Center Center justify="center">
        <Box maxW="1100px" w="100%" mx="25px" pt={{base: 0, sm: 0}}>
            <Flex align="center" justify="space-between" flexDir={{ base: "column", md: "row" }} p="20px">
                <HStack><Link href="/"><Heading fontSize="2xl">Sharifa Ready to Eat</Heading></Link><Image src="plate-fork.png" borderRadius="lg" maxW="50px" margin-inline-start="-0.5rem"/></HStack>
                <HStack spacing={6} flexWrap="wrap" justify="center">
                    <Link href="/" _hover={{color: "white"}}><Text color="whiteAlpha.700" fontSize="xl" _hover={{color: "white"}}>Home</Text></Link>
                    <Link href="/Dashboard" _hover={{color: "white"}}><Text color="whiteAlpha.700" fontSize="xl" _hover={{color: "white"}}>Dashboard</Text></Link>
                    <ConnectWallet theme="dark"/>
                </HStack>
            </Flex>
        </Box>
      </Center>
    </>
  );
}
