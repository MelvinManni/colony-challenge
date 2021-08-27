// See section "Handling Numbers" for how BigNumber plays a role
import { utils } from "ethers";
import { getBlockTime } from "@colony/colony-js";
import { ColonyRole } from "@colony/colony-js";

export const getUserAddress = async (data: any, client: any) => {
  try {
    const singleLog = data;

    const humanReadableFundingPotId = new utils.BigNumber(singleLog.values.fundingPotId).toString();

    const { associatedTypeId } = await client?.getFundingPot(humanReadableFundingPotId);

    const { recipient: userAddress } = await client?.getPayment(associatedTypeId);
    return userAddress;
  } catch (error) {
    console.log(error);
  }
};

export const bigNumberHandler = (data: any, param: string): string => {
  const singleLog = data;
  const wei = new utils.BigNumber(10);
  // Create a new BigNumber instance from the hex string amount in the parsed log
  return new utils.BigNumber(singleLog.values[param]).div(wei.pow(18)).toString();
};

export const formatHexValue = (data: any, param: string) => {
  const singleLog = data;

  // Create a new BigNumber instance from the hex string amount in the parsed log
  const humanReadableAmount = new utils.BigNumber(singleLog.values[param]);
  return humanReadableAmount.toNumber();
};

export const timeHandler = async (data: any, provider: any) => {
  const singleLog = data;
  const logTime = await getBlockTime(provider, singleLog.blockHash);
  return logTime;
};

export const roleParser = (id: number) => {
  return ColonyRole[id];
};

export const getTokenSymbol = async (address: string) => {
  const data = await fetch(`https://api.ethplorer.io/getTokenInfo/${address}?apiKey=EK-6TrNw-TABtNAU-yJNU1`);

  const res = await data.json();

  return res.symbol;
};

const monthMMMFormat = (val: number) => {
  switch (val) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      return null;
  }
};

export const dateFormater = (date: Date) => {
  const dateVal: Date = new Date(date);
  let day = dateVal.getDate().toString();
  if (day.length < 2) day = "0" + day;
  if (new Date().getFullYear() === dateVal.getFullYear()) {
    return day + " " + monthMMMFormat(dateVal.getMonth());
  } else {
    return day + " " + monthMMMFormat(dateVal.getMonth()) + " " + dateVal.getFullYear();
  }
};
