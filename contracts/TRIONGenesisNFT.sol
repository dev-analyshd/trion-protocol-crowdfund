// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title TRIONGenesisNFT
 * @notice TRION Genesis Passport - Soulbound NFT with dynamic metadata.
 *         Non-transferable after minting. Tier-based (Bronze/Silver/Gold).
 *         Dynamic NFT: Network health updates visual metadata for all holders.
 */
contract TRIONGenesisNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    enum Tier { Bronze, Silver, Gold }

    uint256 private _nextTokenId;

    uint256 public networkHealth = 50; // 0-100 score

    struct PassportData {
        Tier tier;
        uint256 mintTimestamp;
        uint256 contributionAmount;
        address minter;
    }

    // tokenId => Passport data
    mapping(uint256 => PassportData) public passports;

    // tokenURI base
    string private _baseTokenURI;

    event PassportMinted(address indexed minter, uint256 indexed tokenId, Tier tier, uint256 amount);
    event NetworkHealthUpdated(uint256 oldHealth, uint256 newHealth);

    constructor() ERC721("TRION Genesis Passport", "TRIONPASS") Ownable(msg.sender) {
        _baseTokenURI = "https://api.trion.network/passport/";
    }

    /**
     * @notice Mints a soulbound passport to the contributor
     * @param to Recipient address
     * @param tier Contribution tier
     * @param amount Contribution amount in wei
     */
    function mintPassport(address to, Tier tier, uint256 amount) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        passports[tokenId] = PassportData({
            tier: tier,
            mintTimestamp: block.timestamp,
            contributionAmount: amount,
            minter: to
        });

        _safeMint(to, tokenId);

        emit PassportMinted(to, tokenId, tier, amount);

        return tokenId;
    }

    /**
     * @notice SOULBOUND: Override _update to prevent transfers
     *         Tokens can only be minted (from == address(0)) or burned (to == address(0))
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721URIStorage)
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // Allow minting and burning, block all other transfers
        if (from != address(0) && to != address(0)) {
            revert("TRION: Passport is soulbound and cannot be transferred");
        }

        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Updates the network health score (only owner)
     *         This affects the dynamic visual metadata of all NFTs
     */
    function setNetworkHealth(uint256 health) external onlyOwner {
        require(health <= 100, "Health must be 0-100");
        uint256 oldHealth = networkHealth;
        networkHealth = health;
        emit NetworkHealthUpdated(oldHealth, health);
    }

    /**
     * @notice Generates dynamic tokenURI based on tier and network health
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        _requireOwned(tokenId);

        PassportData memory data = passports[tokenId];
        string memory tierName;
        if (data.tier == Tier.Bronze) tierName = "bronze";
        else if (data.tier == Tier.Silver) tierName = "silver";
        else tierName = "gold";

        string memory json = string(abi.encodePacked(
            '{"name":"TRION Genesis Passport #', tokenId.toString(), '",',
            '"description":"A soulbound proof of early citizenship in the TRION Protocol.",',
            '"attributes":[',
            '{"trait_type":"Tier","value":"', tierName, '"},',
            '{"trait_type":"Network Health","value":"', Strings.toString(networkHealth), '"},',
            '{"trait_type":"Mint Date","value":"', Strings.toString(data.mintTimestamp), '"},',
            '{"trait_type":"Contribution (wei)","value":"', Strings.toString(data.contributionAmount), '"}',
            '],',
            '"image":"https://api.trion.network/passport/', tierName, '?health=', Strings.toString(networkHealth), '"}'
        ));

        return string(abi.encodePacked("data:application/json;base64,", _encode(json)));
    }

    /**
     * @notice Returns passport data for a token
     */
    function getPassport(uint256 tokenId) external view returns (
        Tier tier,
        uint256 mintTimestamp,
        uint256 contributionAmount,
        address minter
    ) {
        PassportData memory data = passports[tokenId];
        return (data.tier, data.mintTimestamp, data.contributionAmount, data.minter);
    }

    // Base64 encoding helper
    function _encode(string memory data) internal pure returns (string memory) {
        bytes memory encoded = Base64.encode(bytes(data));
        return string(encoded);
    }
}

// Minimal Base64 library (inline to avoid dependency)
library Base64 {
    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (bytes memory) {
        if (data.length == 0) return "";

        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        bytes memory result = new bytes(encodedLen);
        uint256 i = 0;
        uint256 j = 0;

        for (; i + 3 <= data.length; i += 3) {
            uint256 chunk = uint256(uint8(data[i])) << 16 | uint256(uint8(data[i + 1])) << 8 | uint256(uint8(data[i + 2]));
            result[j++] = TABLE[chunk >> 18];
            result[j++] = TABLE[(chunk >> 12) & 0x3F];
            result[j++] = TABLE[(chunk >> 6) & 0x3F];
            result[j++] = TABLE[chunk & 0x3F];
        }

        if (data.length % 3 == 1) {
            uint256 chunk = uint256(uint8(data[i])) << 16;
            result[j++] = TABLE[chunk >> 18];
            result[j++] = TABLE[(chunk >> 12) & 0x3F];
            result[j++] = bytes1("=");
            result[j++] = bytes1("=");
        } else if (data.length % 3 == 2) {
            uint256 chunk = uint256(uint8(data[i])) << 16 | uint256(uint8(data[i + 1])) << 8;
            result[j++] = TABLE[chunk >> 18];
            result[j++] = TABLE[(chunk >> 12) & 0x3F];
            result[j++] = TABLE[(chunk >> 6) & 0x3F];
            result[j++] = bytes1("=");
        }

        return result;
    }
}
