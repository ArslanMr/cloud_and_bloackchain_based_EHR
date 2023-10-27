// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



contract Report {
    struct Image {
        string hash;
        string date;
        string fileName;
    }

    mapping(uint256 => Image[]) private imagesByUniqueId;

    function set(
        uint256 uniqueId,
        string memory imageHash,
        string memory imageDate,
        string memory imageFileName
    ) public {
        Image memory newImage = Image({
            hash: imageHash,
            date: imageDate,
            fileName: imageFileName
        });
        imagesByUniqueId[uniqueId].push(newImage);
    }

    function getImageCount(uint256 uniqueId) public view returns (uint256) {
        return imagesByUniqueId[uniqueId].length;
    }

    function getImageByIndex(uint256 uniqueId, uint256 index)
        public
        view
        returns (string memory, string memory, string memory)
    {
        require(index < imagesByUniqueId[uniqueId].length, "Invalid index");
        Image memory image = imagesByUniqueId[uniqueId][index];
        return (image.hash, image.date, image.fileName);
    }
}








































// pragma solidity ^0.8.0;

// contract Report {
//   struct Image {
//         string hash;
//     }
    
//     mapping(uint256 => Image[]) private imagesByUniqueId;
    
//     function set(uint256 uniqueId, string memory imageHash) public {
//         Image memory newImage = Image(imageHash);
//         imagesByUniqueId[uniqueId].push(newImage);
//     }
    
//     function getImageCount(uint256 uniqueId) public view returns (uint256) {
//         return imagesByUniqueId[uniqueId].length;
//     }
    
//     function getImageByIndex(uint256 uniqueId, uint256 index) public view returns (string memory) {
//         require(index < imagesByUniqueId[uniqueId].length, "Invalid index");
//         return imagesByUniqueId[uniqueId][index].hash;
//     }
// }






// pragma solidity ^0.8.0;

// contract Contract {
    
    
//     // string image;
//      mapping(uint256 => string[]) private image;

//     // Write function
//     function set(uint256 _number,string memory _imagelocal) public {
//         // image = _imagelocal;
//         image[_number].push(_imagelocal);
//     }

//     // Read function
//     function get(uint256 _number) public view returns (string[] memory) {
//         // return image;
//         return image[_number];
//     }

// }