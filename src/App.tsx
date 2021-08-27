import EventItem from "./components/EventItem";
import style from "./styles.module.css";
import { ColonyClient, getColonyNetworkClient, Network } from "@colony/colony-js";
import { Wallet } from "ethers";
import { InfuraProvider } from "ethers/providers";
import { useEffect, useState } from "react";
import { getLogs } from "@colony/colony-js";
import { bigNumberHandler, formatHexValue, getUserAddress, getTokenSymbol, timeHandler, roleParser } from "./utils";
import BackToTop from "./components/BackToTop";

// Set up the network address constants that you'll be using
// The two below represent the current ones on mainnet
// Don't worry too much about them, just use them as-is
const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

interface formatedEventInterface {
  event: string;
  eventType: string;
  html: Element;
  date: Date;
  avatar: string;
}

function App() {
  const [formatedEvents, setFormatedEvent] = useState<formatedEventInterface[]>([]);
  const setUpClient = async () => {
    try {
      // Get a new Infura provider (don't worry too much about this)
      const provider = new InfuraProvider();

      // Get a random wallet
      // You don't really need control over it, since you won't be firing any trasactions out of it
      const wallet = Wallet.createRandom();
      // Connect your wallet to the provider
      const connectedWallet = wallet.connect(provider);

      // Get a network client instance
      const networkClient = await getColonyNetworkClient(Network.Mainnet, connectedWallet, {
        networkAddress: MAINNET_NETWORK_ADDRESS,
      });

      // Get the colony client instance for the betacolony
      const client: ColonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);
      setFormatedEvent([]);
      // payOutHandler(client, provider);
      // colInitializedHandler(client, provider);
      colRoleHandler(client, provider);
      // handledomainAdded(client, provider);
    } catch (error) {
      console.log(error);
    }
  };

  const payOutHandler = async (client: any, provider: any) => {
    try {
      // Get the filter
      // There's a corresponding filter method for all event types
      const eventFilter = client.filters.PayoutClaimed();
      // Get the raw logs array
      const eventLogs = await getLogs(client, eventFilter);
      const parsedLogs = eventLogs.map((event) => client.interface.parseLog(event));

      // Loop through events to ptoperly format
      for (let index = 0; index < eventLogs.length; index++) {
        const userAddress = await getUserAddress(parsedLogs[index], client);
        const fundingPotId = formatHexValue(parsedLogs[index], "fundingPotId");
        const date = await timeHandler(eventLogs[index], provider);
        const token = await getTokenSymbol(parsedLogs[index].values?.token);
        const amount = bigNumberHandler(parsedLogs[index], "amount");
        setFormatedEvent(
          (prev) =>
            [
              ...(prev as formatedEventInterface[]),
              {
                event: `User ${userAddress} claimed ${amount}${token} payout from pot ${fundingPotId}.`,
                html: (
                  <p className={style.text}>
                    User <span className={style.heavy}>{userAddress}</span> claimed <span className={style.heavy}>{amount}</span>
                    <span className={style.heavy}>{token}</span> payout from pot <span className={style.heavy}>{fundingPotId}</span>.
                  </p>
                ),
                eventType: "PayoutClaimed",
                date: new Date(date).toLocaleDateString(),
                avatar: userAddress,
              },
            ] as formatedEventInterface[]
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const colInitializedHandler = async (client: any, provider: any) => {
    const eventFilter = client.filters.ColonyInitialised();
    const eventLogs = await getLogs(client, eventFilter);

    // Loop through events to ptoperly format
    for (let index = 0; index < eventLogs.length; index++) {
      const date = await timeHandler(eventLogs[index], provider);
      setFormatedEvent(
        (prev) =>
          [
            ...(prev as formatedEventInterface[]),
            {
              event: "Congratulations! It's a beautiful baby colony!",
              html: <p className={style.text}>Congratulations! It's a beautiful baby colony!</p>,
              eventType: "ColonyInitialised",
              date: new Date(date).toLocaleDateString(),
              avatar: eventLogs[index].blockHash,
            },
          ] as formatedEventInterface[]
      );
    }
  };

  const colRoleHandler = async (client: any, provider: any) => {
    const eventFilter = client.filters.ColonyRoleSet();
    const eventLogs = await getLogs(client, eventFilter);
    const parsedLogs = eventLogs.map((event) => client.interface.parseLog(event));

    for (let index = 0; index < eventLogs.length; index++) {
      const userAddress = await parsedLogs[index]?.values?.user;
      const date = await timeHandler(eventLogs[index], provider);
      const role = roleParser(parsedLogs[index].values?.role);
      const domainId = formatHexValue(parsedLogs[index], "domainId");

      setFormatedEvent(
        (prev) =>
          [
            ...(prev as formatedEventInterface[]),
            {
              event: `${role} role assigned to user ${userAddress} in domain ${domainId}.`,
              html: (
                <p className={style.text}>
                  <span className={style.heavy}>{role}</span> role assigned to user <span className={style.heavy}>{userAddress}</span> in domain{" "}
                  <span className={style.heavy}>{domainId}</span>.
                </p>
              ),
              eventType: "ColonyRoleSet",
              date: new Date(date).toLocaleDateString(),
              avatar: userAddress,
            },
          ] as formatedEventInterface[]
      );
    }
  };

  const handledomainAdded = async (client: any, provider: any) => {
    const eventFilter = client.filters.DomainAdded();
    const eventLogs = await getLogs(client, eventFilter);
    const parsedLogs = eventLogs.map((event) => client.interface.parseLog(event));

    for (let index = 0; index < eventLogs.length; index++) {
      const date = await timeHandler(eventLogs[0], provider);
      const domainId = formatHexValue(parsedLogs[2], "domainId");

      setFormatedEvent(
        (prev) =>
          [
            ...(prev as formatedEventInterface[]),
            {
              event: ` Domain ${domainId} added.`,
              html: (
                <p className={style.text}>
                  Domain <span className={style.heavy}>{domainId}</span> added.
                </p>
              ),
              eventType: "DomainAdded",
              date: new Date(date).toLocaleDateString(),
              avatar: eventLogs[index].blockHash,
            },
          ] as formatedEventInterface[]
      );
    }
  };

  useEffect(() => {
    setUpClient();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.eventList}>
        {" "}
        {formatedEvents.length < 1 ? (
          <p style={{ textAlign: "center", margin: 20 }}>Loading...</p>
        ) : (
          formatedEvents
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) //Sort the events from latest to oldest
            .map((val) => <EventItem avatar={val.avatar} children={val.html} date={val.date} />)
        )}
      </div>
      <BackToTop />
    </div>
  );
}

export default App;
