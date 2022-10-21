// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YourNFT is ERC721Royalty, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    address private marketplaceAddress;

    mapping(uint256 => address) private _creators;

    mapping(uint256 => string) private _tokenURIs;

    // Base URI
    string private _baseURIextended;

    event TokenMinted(
        uint256 indexed tokenId,
        string tokenURI,
        address marketplaceAddress
    );

    constructor(address _marketplaceAddress) ERC721("NFT_Manager", "NM") {
        marketplaceAddress = _marketplaceAddress;
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        _baseURIextended = baseURI_;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }

    function mint(string memory token_uri, uint96 feeNumerator)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _exists(newItemId);
        _mint(msg.sender, newItemId);
        _creators[newItemId] = msg.sender;
        _setTokenURI(newItemId, token_uri);
        setTokenRoyalty(newItemId, msg.sender, feeNumerator);

        _tokenIds.increment();

        // Give the NFT manager approval to transact NFTs between users
        setApprovalForAll(marketplaceAddress, true);

        emit TokenMinted(newItemId, token_uri, marketplaceAddress);

        return newItemId;
    }

    function getUserOwnedTokens() public view returns (uint256[] memory) {
        uint256 totalTokens = _tokenIds.current();
        uint256 ownedTokenCount = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](ownedTokenCount);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = i;
            if (ownerOf(tokenId) != msg.sender) continue;
            ownedTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return ownedTokenIds;
    }

    function getUserTokenById(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    function getUserCreatedToken() public view returns (uint256[] memory) {
        uint256 totalTokens = _tokenIds.current();
        uint256 totalTokensCreated = 0;

        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = i;
            if (_creators[tokenId] != msg.sender) continue;
            totalTokensCreated += 1;
        }

        uint256[] memory createdTokenIds = new uint256[](totalTokensCreated);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < totalTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            createdTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return createdTokenIds;
    }

    // set royalty for each token
    function setTokenRoyalty(
        uint256 _tokenId,
        address _receiver,
        uint96 _feeNumerator
    ) public {
        _setTokenRoyalty(_tokenId, _receiver, _feeNumerator);
    }
}
