// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract FileMetadata {
    struct File {
        string fileName;
        string fileType;
        uint256 fileSize;
        uint256 uploadTime;
        string ipfsHash;
    }
    
    mapping (string => File) private files;
    
    function addMetadata(string memory fileName, string memory fileType, uint256 fileSize, string memory ipfsHash) public {
        uint256 uploadTime = block.timestamp;
        files[ipfsHash] = File(fileName, fileType, fileSize, uploadTime, ipfsHash);
    }
    
    function getMetadata(string memory ipfsHash) public view returns (string memory, string memory, uint256, uint256, string memory) {
        File memory file = files[ipfsHash];
        return (file.fileName, file.fileType, file.fileSize, file.uploadTime, file.ipfsHash);
    }
}