// SPDX-License-Identifier: MIT
// Declare the version of Solidity to be used
pragma solidity ^0.8.0;

// Define the contract
contract SupplyChain {
    enum STAGE {
        ChainManager,
        Raw_Material,
        Manufacturer,
        Distributor,
        Retailer,
        Consumer
    }
    
    struct Transaction {
        uint id;
        address sender;
        address receiver;
        uint productID;
        uint price;
        string memo;
        uint timestamp;
        STAGE senderStage;
        STAGE receiverStage;
    }

    // Define a struct to represent a shipment
    struct Product {
        uint id; // hashed ID
        STAGE stage; // always start as raw materials
        string item;
        uint quantity;
        // Put in a tracking number, we can see everything about the product 
        uint[] history; // Transaction ID history
        address currentowner;
        string ownerName;
    }

    struct Party {
        address wallet;
        string name;
        string location;
        STAGE role;
        uint[] productIDs; // list of product IDs associated with owner
    }

    mapping (address => Party) public parties;
    mapping (uint => Product) public products;
    mapping (uint => Transaction) public transactions;

    address[] partyAddresses;

     mapping(STAGE => uint256) public STAGE_TO_NUM;
     mapping(uint256 => STAGE) public NUM_TO_STAGE;
    
     constructor() {
     // Initialize the mappings in the constructor
     STAGE_TO_NUM[STAGE.ChainManager] = 0;
     STAGE_TO_NUM[STAGE.Raw_Material] = 1;
     STAGE_TO_NUM[STAGE.Manufacturer] = 2;
     STAGE_TO_NUM[STAGE.Distributor] = 3;
     STAGE_TO_NUM[STAGE.Retailer] = 4;
     STAGE_TO_NUM[STAGE.Consumer] = 5;

     NUM_TO_STAGE[1] = STAGE.Raw_Material;
     NUM_TO_STAGE[2] = STAGE.Manufacturer;
     NUM_TO_STAGE[3] = STAGE.Distributor;
     NUM_TO_STAGE[4] = STAGE.Retailer;
     NUM_TO_STAGE[5] = STAGE.Consumer;
     }

    // Input: product name, quantity | Returns item ID
    function createProduct(address _wallet, string memory _item, uint _quantity) public returns (uint) {
        uint _id = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender))) % 10000000000;
        Product storage product = products[_id];
        // require(some condition)
        product.id = _id;
        product.quantity = _quantity;
        product.stage = STAGE.ChainManager;
        product.item = _item;
        product.currentowner = _wallet;
        product.ownerName = parties[_wallet].name;
        parties[_wallet].productIDs.push(_id);
        
        return _id;        
    }
    
    // Input: party name, location, stage # (starts at 0), wallet address
    function createParty(string memory _name, string memory _location, STAGE _role, address _wallet) public {
        Party storage party = parties[_wallet];
        // if (party.wallet != 0x0000000000000000000000000000000000000000) return;
        
        partyAddresses.push(_wallet);

        party.name = _name;
        party.wallet = _wallet;
        party.role = _role;
        party.location = _location;
    }

    function createTransaction(address _sender, address _receiver, uint _productID, uint _price, string memory _memo) public returns (uint) {
        uint _id = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender))) % 10000000000;

        Transaction storage transaction = transactions[_id];

        transaction.id = _id;
        transaction.sender = _sender;
        transaction.receiver = _receiver;
        transaction.productID = _productID;
        transaction.price = _price;
        transaction.memo = _memo;
        transaction.timestamp = block.timestamp; // convert unix timestamp to actual time https://www.unixtimestamp.com/
        transaction.senderStage = parties[_sender].role;
        transaction.receiverStage = parties[_receiver].role;

        products[_productID].history.push(_id); // add transaction ID to transaction history
        
        // NUM_TO_STAGE[STAGE_TO_NUM[products[_productID].stage]++];
        products[_productID].currentowner = _receiver; // Set the current owner of the product to whoever received it
        products[_productID].ownerName = parties[_receiver].name;
        products[_productID].stage = parties[_receiver].role; // Set the current stage to whatever role the party is

        giveProduct(_receiver, _productID);

        return _id;
    }
    
    function isNewParty(address _id) public view returns (bool) {
        for (uint i = 0; i < partyAddresses.length; i++)
            if (partyAddresses[i] == _id) return false;
        return true;
    }

    function getParty(address _partyAddress) public view returns (Party memory) {
        return parties[_partyAddress];
    }

    // No parameters | Returns list of parties (but why???)
    function getAllParties() public view returns (Party[] memory) {
        uint length = partyAddresses.length;
        Party[] memory allParties = new Party[](length);

        for (uint i = 0; i < length; i++) {
            allParties[i] = parties[partyAddresses[i]];
        }
        return allParties;
    }

    // Input: Product ID | Returns product
    function getProduct(uint _productId) public view returns (Product memory) {
        return products[_productId];
    }

    // Input: party wallet ID | Returns all products under an address, # of products
    function getAllProducts(address _wallet) public view returns (Product[] memory) {
        Party memory party = parties[_wallet];
        uint length = party.productIDs.length;
        Product[] memory allProducts = new Product[](length);

        for (uint i = 0; i < length; i++) {
            Product memory product = products[party.productIDs[i]];

            allProducts[i] = product;
        }
        return allProducts;
    }
    
    function getTransactionHistory(uint _id) public view returns (Transaction[] memory) {
        Product memory product = products[_id];
        uint length = product.history.length;
        Transaction[] memory transactionHistory = new Transaction[](length);

        for (uint i = 0; i < length; i++) {
            Transaction memory transaction = transactions[product.history[i]];

            transactionHistory[i] = transaction;
        }
        return transactionHistory;
    }

    function giveProduct(address _wallet, uint _productID) public {
        parties[_wallet].productIDs.push(_productID);
    }
}