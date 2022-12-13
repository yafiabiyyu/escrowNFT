// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract escrowNFT is Ownable {
    uint256 public fee;
    uint256 private constant txDigit = 8;
    uint256 private constant txModul = 10**txDigit;

    enum Status {
        Pending,
        Accepted,
        Rejected,
        Cancelled
    }

    struct Escrow {
        uint256 tokenId;
        uint256 paymentAmount;
        uint256 deadline;
        address nftAddress;
        address buyerAddress;
        address sellerAddress;
        Status status;
    }

    mapping(uint256 => Escrow) public escrowOrder;
    mapping(uint => bool) private usdIds;

    uint[] public escrowIds;

    event NewEscrow(
        uint256 _txId,
        uint256 _timestamp,
        address _seller,
        address _buyer
    );

    event PaymentEscrow(
        uint256 _txId,
        uint256 _timestamp,
        uint256 _paymentAmount,
        address _sellerAddress,
        address _buyerAddress
    );

    event CancelEscrow(
        uint256 _txId,
        uint256 _timestamp,
        address _sellerAddress,
        address _buyerAddress
    );

    event RejectEscrow(
        uint256 _txId,
        uint256 _timestamp,
        address _sellerAddress,
        address _buyerAddress
    );

    modifier onlySeller(uint256 _tokenId) {
        require(escrowOrder[_tokenId].sellerAddress == msg.sender);
        _;
    }

    modifier onlyBuyer(uint256 _tokenId) {
        require(escrowOrder[_tokenId].buyerAddress == msg.sender);
        _;
    }

    constructor(uint256 _fee) {
        fee = _fee;
    }

    /**
        * @notice allow the smart contract's owner to update the fee
     */
    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    /**
        * @notice allow users to generate a TxId
     */
    function getTxId(
        address _sellerAddress,
        address _buyerAddress,
        address _nftAddress,
        bytes memory _secret
    ) public pure returns (uint256 txId) {
        txId = uint256(
            keccak256(
                abi.encode(
                    _sellerAddress,
                    _buyerAddress,
                    _nftAddress,
                    _secret
                )
            )
        ) % txModul;
    }

    /**
        * @notice allow users to create a new escrow contract
        * @dev transaction reverts if invalid input data is sent
     */
    function createEscrow(
        uint256 _txId,
        uint256 _tokenId,
        uint256 _paymentAmount,
        address _nftAddress,
        address _buyerAddress
    ) public {
        require(!usdIds[_txId]);
        require(_paymentAmount > 0);
        require(_nftAddress != address(0));
        require(_buyerAddress != address(0));
        IERC721(_nftAddress).transferFrom(msg.sender, address(this), _tokenId);
        usdIds[_txId] = true;
        escrowIds.push(_txId);
        Escrow storage escrow = escrowOrder[_txId];
        escrow.tokenId = _tokenId;
        escrow.paymentAmount = _paymentAmount;
        escrow.deadline = block.timestamp + 1 hours;
        escrow.nftAddress = _nftAddress;
        escrow.buyerAddress = _buyerAddress;
        escrow.sellerAddress = msg.sender;
        escrow.status = Status.Pending;
        emit NewEscrow(_txId, block.timestamp, msg.sender, _buyerAddress);
    }

    /**
        * @notice allow users to accept and pay the escrow contract
        * @dev Only the buyerAddress can use this function
     */
    function payEscrow(uint256 _txId) public payable onlyBuyer(_txId) {
        Escrow storage currentEscrow = escrowOrder[_txId];
        require(block.timestamp < currentEscrow.deadline);
        require(currentEscrow.status == Status.Pending);
        require(msg.value == currentEscrow.paymentAmount);
        currentEscrow.status = Status.Accepted;

        (bool success, ) = payable(currentEscrow.sellerAddress).call{
            value: msg.value
        }("");
        require(success);
        
        _transferNft(_txId, msg.sender);
        emit PaymentEscrow(
            _txId,
            block.timestamp,
            currentEscrow.paymentAmount,
            currentEscrow.sellerAddress,
            msg.sender
        );
    }

    /**
        * @notice allows the seller to cancel the escrow contract and retrieve back the NFT
        * @dev Timestamp needs to be greater than the deadline
     */
    function cancelEscrow(uint256 _txId) public onlySeller(_txId) {
        Escrow storage currentEscrow = escrowOrder[_txId];
        require(block.timestamp > currentEscrow.deadline);
        require(currentEscrow.status == Status.Pending);
        currentEscrow.status = Status.Cancelled;
        _transferNft(_txId, msg.sender);
        emit CancelEscrow(
            _txId,
            block.timestamp,
            msg.sender,
            currentEscrow.buyerAddress
        );
    }

    /**
        * @notice rejects an escrow contract
     */
    function rejectEscrow(uint256 _txId) public onlyBuyer(_txId) {
        Escrow storage currentEscrow = escrowOrder[_txId];
        require(block.timestamp < currentEscrow.deadline);
        require(currentEscrow.status == Status.Pending);
        currentEscrow.status = Status.Rejected;
        _transferNft(_txId, currentEscrow.sellerAddress);
        emit RejectEscrow(
            _txId,
            block.timestamp,
            currentEscrow.sellerAddress,
            msg.sender
        );
    }

    function _transferNft(uint256 _txId, address _receiver) private {
        IERC721(escrowOrder[_txId].nftAddress).transferFrom(
            address(this),
            _receiver,
            escrowOrder[_txId].tokenId
        );
    }
}
