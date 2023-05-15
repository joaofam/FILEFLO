# School of Computing &mdash; Year 4 Project Proposal Form

## SECTION A

|                     |                   |
|---------------------|-------------------|
|Project Title:       | Fileflo           |
|Student 1 Name:      | Joao Pereira      |
|Student 1 ID:        | 19354106          |
|Student 2 Name:      | Aaron Cleary      |
|Student 2 ID:        | 19495324          |
|Project Supervisor:  | Geoff Hamilton    |

## SECTION B

### Introduction

Our proposed project, Fileflo, is an application that will enable users to securely upload files on the blockchain, which can then be shared with and downloaded by other users.


### Outline

Fileflo will have a main homepage where users can upload their files. When a user uploads a file, it is encrypted using an asymmetric encryption algorithm before then being uploaded. A unique hash will then be generated for the file, so uploaded files can be searched for by either filename or the unique hash. 

There will also be another page for downloading files from other users. Upon entering the hash of the desired file, the user can then download the file provided their private key is associated with the public key used to encrypt the file. 

Finally, there will be a profile page where users can see their personal public and private keys. Users will also have the ability to add “friends” by saving the public key of another user. 


### Background

Before we started brainstorming project ideas together, the only criteria we had was that our project must make use of modern and genuinely interesting technology whilst having actual real-world utility. After following this criteria, we ultimately decided to make a file sharing application where users could buy or sell files using cryptocurrency. Since both of us are investors in cryptocurrency, we recognised the value of using a technology as exciting as blockchain in our project. 

The word “blockchain” is a bit of a buzzword in the cryptocurrency space, most people don’t actually understand what it is, ourselves included. Upon looking further into our idea, we learned that it was actually possible to share files on the blockchain. Once we realised this, we immediately knew that an application where users could upload and download files on the blockchain was a far more challenging, engaging and enterprising idea.


### Achievements

Our project will enable users to store and transfer files under a very secure and private decentralised blockchain. Fileflo will provide functions such as being able to upload files and have them be encrypted as well as the hash stored into a blockchain with the use of IFPS. Sharing files with other users will be another function our application will provide. Finally, the ability to generate a profile and have configured settings will also be another feature of Fileflo.

Our target audience will be users who intend to encrypt and store files within a decentralised blockchain and who also may have further intentions to safely transfer these encrypted files to another user on a different device. For example, researchers who possess sensitive data such as datasets may require to have these datasets stored away in an encrypted and immutable state where no other user has granted access, this is where our service will come in handy.

### Justification

A file sharing application will be handling potentially sensitive files/information and as such would massively benefit from the decentralised nature of the blockchain, as there is no central entity and thus a greater guarantee of privacy.

The most popular methods of file sharing, such as Google Drive and Dropbox, continue to have several high-profile hacks where users’ personal information and data is leaked. The security provided by the blockchain would be able to address such a flaw as our application will be using asymmetric encryption to protect our users' data from any malicious activity.

The peer-to-peer architecture of the blockchain also goes hand-in-hand with one of the core tenets of our app, which is to provide our users with a simple and efficient way of sharing files between themselves. The process of uploading or downloading a file will be lightning-fast and incredibly intuitive. 

Our project will improve upon the flaws of blockchain file storage. For example, one of the main issues with blockchain file storage is the blockchain proof-of-work mechanisms prevent large files being stored. Our project circumvents this by using IPFS (Interplanetary File System), which stores the hash of a file rather than the file itself.


### Programming language(s)

- Solidity
- React
- Python
- JavaScript


### Programming tools / Tech stack

- Truffle
- Web3.js
- AWS Services (Amplify, Cognito, S3, AppSync, Lambda, DynamoDB, API Gateway)
- CSS
- HTML
- Jenkins


### Learning Challenges

Neither of us have any experience with several components of our project, including: Solidity, IFPS, Truffle, Ethereum smart contracts, Web3.js and certain AWS Services (S3, AppSync, DynamoDB). 


### Breakdown of work

#### Student 1 (Joao Pereira)

- Implementation of front-end UI for profile and uploading pages
- IPFS development
- User authentication
- Web3.js implementation
- AWS Services
- Learning and use of Solidity

#### Student 2 (Aaron Cleary)

- AWS Services
- Ethereum blockchain and Truffle development
- Web3.js implementation
- Learning and use of Solidity
- Jenkins Automation testing
