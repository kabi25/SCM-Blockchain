import React, { useEffect, useState } from 'react';
import {
  Center,
  Card,
  CardBody,
  Box,
  Text,
  Flex,
  VStack,
  Button,
  HStack,
  Heading,
  Progress,
  Input,
  Divider,
  Tabs,
  TabList,
  Tab,
  option,
  TabPanels,
  TabPanel,
  FormLabel,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  Select,
} from '@chakra-ui/react';
import ProductCard from '../components/dashboardproduct.js'

// Panels
import ManageChain from '../components/managechain.js'
import Transaction from '../components/transaction.js'
import ActiveProducts from '../components/activeproducts.js'
import { useAddress, useContract } from '@thirdweb-dev/react';

import { contractAddress } from '../constants.js';

export default function Dashboard() {
  const address = useAddress();
  const { isLoading, contract } = useContract(contractAddress);
  const [products, setProducts] = useState();
  const [party, getParty] = useState();
  const [isChainManager, setIsChainManager] = useState();

  useEffect(() => {
    async function fetchData() {
      if(address && !isLoading) // logged in
      {
        getParty(await contract.call('getParty', [address]));
      }
    }
  
    fetchData();
  }, [address, contract, isLoading]);

  useEffect(() => {
    if(party) setIsChainManager(party[3] == 0)
  }, [party]);

  return (
    <>

      <Center m={{base: "25px", md: "50px"}}>
                <VStack border="1px" p="10px" rounded={7} w="95%" maxW="1200px" minH="700px">
                  <Tabs align="center" minW="1000px">
                    <TabList isFitted mb='1em'>
                      <Tab>Active Products</Tab>
                      {<Tab>Manage My Supply Chain</Tab>}
                      <Tab>Make Transaction</Tab>
                    </TabList>
                    <Divider/>
                    <TabPanels>
                      <TabPanel>
                        {/* Active Products */}
                        <ActiveProducts/>
                      </TabPanel>
                      {
                        <TabPanel>
                          {/* Manage My Supply Chain */}
                          <ManageChain/>
                        </TabPanel>
                      }
                      <TabPanel>
                        {/* Track Product History */}
                        <Transaction/>
                        
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </VStack>
            </Center>
    </>
  );
}
