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
        Canceled
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
    Escrow escrow;

    mapping(uint256 => Escrow) public escrowOrder;

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

    event CancleEscrow(
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

    function updateFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

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

    function createEscrow(
        uint256 _txId,
        uint256 _tokenId,
        uint256 _paymentAmount,
        address _nftAddress,
        address _buyerAddress
    ) public {
        require(_paymentAmount > 0);
        require(_nftAddress != address(0));
        require(_buyerAddress != address(0));
        IERC721(_nftAddress).transferFrom(msg.sender, address(this), _tokenId);
        escrow.tokenId = _tokenId;
        escrow.paymentAmount = _paymentAmount;
        escrow.deadline = block.timestamp + 1 hours;
        escrow.nftAddress = _nftAddress;
        escrow.buyerAddress = _buyerAddress;
        escrow.sellerAddress = msg.sender;
        escrow.status = Status.Pending;
        escrowOrder[_txId] = escrow;
        emit NewEscrow(_txId, block.timestamp, msg.sender, _buyerAddress);
    }

    function payEscrow(uint256 _txId) public payable onlyBuyer(_txId) {
        require(block.timestamp < escrowOrder[_txId].deadline);
        require(escrowOrder[_txId].status == Status.Pending);
        require(msg.value == escrowOrder[_txId].paymentAmount);
        (bool success, ) = payable(escrowOrder[_txId].sellerAddress).call{
            value: msg.value
        }("");
        require(success);
        escrowOrder[_txId].status = Status.Accepted;
        _transferNft(_txId, msg.sender);
        emit PaymentEscrow(
            _txId,
            block.timestamp,
            escrowOrder[_txId].paymentAmount,
            escrowOrder[_txId].sellerAddress,
            msg.sender
        );
    }

    function cancleEscrow(uint256 _txId) public onlySeller(_txId) {
        require(block.timestamp > escrowOrder[_txId].deadline);
        require(escrowOrder[_txId].status == Status.Pending);
        escrowOrder[_txId].status = Status.Canceled;
        _transferNft(_txId, msg.sender);
        emit CancleEscrow(
            _txId,
            block.timestamp,
            msg.sender,
            escrowOrder[_txId].buyerAddress
        );
    }

    function rejectEscrow(uint256 _txId) public onlyBuyer(_txId) {
        require(block.timestamp < escrowOrder[_txId].deadline);
        require(escrowOrder[_txId].status == Status.Pending);
        escrowOrder[_txId].status = Status.Rejected;
        _transferNft(_txId, escrowOrder[_txId].sellerAddress);
        emit RejectEscrow(
            _txId,
            block.timestamp,
            escrowOrder[_txId].sellerAddress,
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
