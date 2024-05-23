import React from 'react';
import {
  Button,
  Heading,
  Input,
  Divider,
  Textarea,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';
import { useAddress, useContract, useSDK } from '@thirdweb-dev/react';
import { contractAddress, STAGE, STAGE_TO_NUM } from '../constants';
import web3 from 'web3';

/**
 * 
 * @returns struct Transaction {
        uint id;
        address sender;
        address receiver;
        uint productID;
        uint price;
        string memo;
        uint timestamp;
    }
 */

export default function Transaction() {
  const address = useAddress();
  const sdk = useSDK();
  const { isLoading, contract } = useContract(contractAddress);

  async function handleSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());

      
      const res = await contract.call("createTransaction", [address, data.receiver, data.productID, web3.utils.toWei(data.price, 'ether'), data.memo]);
      console.log(res);
      if (parseInt(res[0]._hex, 16) == 1)
      {
        console.log("Valid Transaction");
        sdk.wallet.transfer(data.receiver, data.price);
      } else
      console.log("Error! Transaction not in correct order!");
    }
  return (
    <>
                <Heading m="7" size="lg" textAlign="center">Make Transaction</Heading>
                
                <Divider/>
                <form onSubmit={handleSubmit}>
                    <FormControl py="2" minW="700px" isRequired>
                        <FormLabel>Recieving Address</FormLabel>
                        <Input name="receiver" isRequired />
                    </FormControl>
                    <FormControl py="2" isRequired>
                        <FormLabel>Product ID</FormLabel>
                        <Input name="productID" isRequired />
                    </FormControl>
                    <FormControl py="2" isRequired>
                        <FormLabel>Price (ETH)</FormLabel>
                        <Input name="price" isRequired />
                    </FormControl>
                    <FormControl py="2">
                        <FormLabel>Memo</FormLabel>
                        <Textarea name="memo" />
                    </FormControl>
                    <Button mt="4" colorScheme="blue" type="submit" size="md" w="full" loadingText="Logging In">Confirm Transaction</Button>
                </form>
                    {/* <Heading py="10px">Products</Heading> */}
    </>
  );
}
