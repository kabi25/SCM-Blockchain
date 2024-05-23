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
  Link,
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
import { useAddress, useContract } from '@thirdweb-dev/react';
import { contractAddress, STAGE, STAGE_TO_NUM } from '../constants';

function ChainTable({party_name, parties, party_enum}) {
    useEffect(() => {
        console.log(party_name, parties)
    }, [])
    return (
        <>
            <TableContainer border="1px" rounded={7}>
                <Text p="10px">{party_name}</Text>
                <Table variant='simple'>
                <Thead>
                <Tr>
                    <Th>Address</Th>
                    <Th>Name</Th>
                    <Th>Location</Th>
                </Tr>
                </Thead>
                {parties && parties.map(party => 
                    <Tbody>
                        <Td><Link isExternal href={"https://sepolia.etherscan.io/address/" + party[0].toString()}>{party[0]}</Link></Td>
                        <Td>{party[1]}</Td>
                        <Td>{party[2]}</Td>
                    </Tbody>
                )}
                </Table>
            </TableContainer>
        </>
    )
}

export default function ManageChain() {
    const address = useAddress();
    const { isLoading, contract } = useContract(contractAddress);
    const [parties, setParties] = useState([]);

    async function fetchData() {
        if(address && !isLoading) // logged in
        {
            const parties = await contract.call('getAllParties');
            setParties(parties);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 250);

    }, [address, contract, isLoading]);


    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        contract.call("createParty", [data.name, data.location, STAGE_TO_NUM.get(data.type), data.address])
      }

  return (
    <>
        <form onSubmit={handleSubmit}>
            <HStack>
                <FormControl py="2" isRequired>
                <FormLabel>Type</FormLabel>
                <Select name="type" isRequired>
                    <option>Raw Materials</option>
                    <option>Supplier</option>
                    <option>Manufacturer</option>
                    <option>Distributor</option>
                    <option>Consumer</option>
                </Select>
                </FormControl>
                <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input name="name" isRequired />
                </FormControl>
                <FormControl isRequired>
                <FormLabel>Wallet Address</FormLabel>
                <Input name="address" isRequired />
                </FormControl>
                <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input name="location" isRequired />
                </FormControl>
            </HStack>
            <Button colorScheme="blue" type="submit">Submit</Button>
            </form>


        <Divider color="white" my="10px"  w={{base: "400px", md: "700px"}}/>

        <ChainTable party_name="Raw Materials" parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Raw Materials"))}/>
        <Divider color="white" my="10px" w="800px"/>

        <ChainTable party_name="Supplier" parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Supplier"))}/>
        <Divider color="white" my="10px" w="800px"/>

        <ChainTable party_name="Manufacturer" parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Manufacturer"))}/>
        <Divider color="white" my="10px" w="800px"/>

        <ChainTable party_name="Distributor" parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Distributor"))}/>
        <Divider color="white" my="10px" w="800px"/>

        <ChainTable party_name="Consumer" parties={parties.filter(party => party[3] == STAGE_TO_NUM.get("Consumer"))}/>
    </>
  );
}
