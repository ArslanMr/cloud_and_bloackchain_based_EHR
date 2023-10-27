// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Record {
    struct PRecord {
        string Date;
        string DRName;
        string Disease;
        string Medicine;
        string Tests;
    }

    mapping(uint256 => PRecord[]) private SurUniqueId;

    function set(
    uint256 uniqueId,
    string memory recDate,
    string memory recDRName,
    string memory recDisease,
    string memory recMedicine,
    string memory recTests
) public {
        PRecord memory newRecord = PRecord({
            Date: recDate,
            DRName: recDRName,
            Disease: recDisease,
            Medicine: recMedicine,
            Tests:recTests
        });
        SurUniqueId[uniqueId].push(newRecord);
    }

    function getRecordCount(uint256 uniqueId) public view returns (uint256) {
        return SurUniqueId[uniqueId].length;
    }

    function getRecordByIndex(uint256 uniqueId, uint256 index)
        public
        view
        returns (string memory, string memory, string memory, string memory, string memory)
    {
        require(index < SurUniqueId[uniqueId].length, "Invalid index");
        PRecord memory record = SurUniqueId[uniqueId][index];
        return (record.Date, record.DRName, record.Disease, record.Medicine, record.Tests);
    }
}
