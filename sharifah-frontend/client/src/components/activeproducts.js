import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Input,
  Divider,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';
import ProductCard from '../components/dashboardproduct.js'
import { Web3Button } from "@thirdweb-dev/react";
import { NUM_TO_STAGE } from '../constants.js'

// Panels
import { useAddress, useContract} from '@thirdweb-dev/react';

import { contractAddress } from '../constants.js';

export default function ActiveProducts() {
  
  const address = useAddress();
  const { contract, isLoading } = useContract(contractAddress);
  const [products, setProducts] = useState();


  const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      contract.call("createProduct", [address, data.name, data.quantity]);
    }

  async function fetchData() {
    if(address && !isLoading) // logged in
    {
      setProducts(await contract.call("getAllProducts", [address]));
    }
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 250);

  }, [address, contract, isLoading]);
  
  return (
    <>
        <Box justify="center" py="10px" fontSize="xl">
        <form onSubmit={handleSubmit} >
            <HStack>
                <FormControl isRequired>
                  <FormLabel>Product Name</FormLabel>
                  <Input name="name" isRequired />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Quantity</FormLabel>
                  <Input name="quantity" isRequired />
                </FormControl>
            </HStack>
            <Button colorScheme="blue" type="submit">Submit</Button>
            </form>

            <Divider color="white" my="20px" w="800px"/>

        {products && products.map(product => 
        { 
            let partyName = product[6] + " (" + product[5] + ")";
            return <ProductCard name={product[2]} id={product[0]._hex} stage={NUM_TO_STAGE.get(product[1])} party={partyName} progress={product[1] * 25}/>
        })}
        </Box>
    </>
  );
}
