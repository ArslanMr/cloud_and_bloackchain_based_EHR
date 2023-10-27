// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Surgeries {
    struct Data {
        string date;
        string surgeryName;
        string doctorName;
        string hospitalName;
    }

    mapping(uint256 => Data[]) private SurUniqueId;

    function set(
        uint256 uniqueId,
        string memory surDate,
        string memory surSurgeryName,
        string memory surDoctorName,
        string memory surHospitalName
    ) public {
        Data memory newData = Data({
            date: surDate,
            surgeryName: surSurgeryName,
            doctorName: surDoctorName,
            hospitalName: surHospitalName
        });
        SurUniqueId[uniqueId].push(newData);
    }

    function getSurgeryCount(uint256 uniqueId) public view returns (uint256) {
        return SurUniqueId[uniqueId].length;
    }

    function getSurgeryByIndex(uint256 uniqueId, uint256 index)
        public
        view
        returns (string memory, string memory, string memory, string memory)
    {
        require(index < SurUniqueId[uniqueId].length, "Invalid index");
        Data memory surgery = SurUniqueId[uniqueId][index];
        return (surgery.date, surgery.surgeryName, surgery.doctorName, surgery.hospitalName);
    }
}
