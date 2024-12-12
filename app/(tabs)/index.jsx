import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import SerialPortAPI from "react-native-serial-port-api";
import tw from "twrnc";
// import { serialPort } from "serialport";

const App = () => {
  const fuelInvoice = `
  1B40                              // Initialize printer
  1B6101                            // Center alignment
  4645454C204445504F540A            // "FUEL DEPOT" (centered)
  3120474F4F44535052494E47532052442C0A // "1 GOODSPRINGS RD,"
  4A45414E2C204E562038393031390A    // "JEAN, NV 89019"
  3730322D3736312D373030300A        // "702-761-7000"
  1B6100                            // Left alignment
  2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A    // Divider line (dashes)
  4441544520202020202030372F31302F323032300A // "DATE        07/10/2020"
  54494D45202020202031303A343020414D0A       // "TIME        10:40 AM"
  50554D5020202020202020380A                 // "PUMP        8"
  5452414E2320202020203137310A               // "TRAN#       171"
  2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A            // Divider line (dashes)
  44455441494C530A                          // "DETAILS"
  424153452050524943452020202420322E3937202F2047414C0A // "BASE PRICE   $2.97 / GAL"
  47414C4C4F4E532020202033332E313832300A               // "GALLONS      33.1820"
  544F54414C20202020202020242039382E35350A            // "TOTAL        $98.55"
  0A                                            // Line feed
  24582039382E353520524547204655454C0A              // "$98.55 REG FUEL"
  245820342E3433205441580A                           // "$4.43 TAX"
  24582D3130322E3938205649534120444542495420504149440A // "$-102.98 VISA DEBIT PAID"
  0A                                            // Line feed
  245820302E30302042414C414E43450A                    // "$0.00 BALANCE"
  0A                                            // Line feed
  1B6101                                      // Center alignment
  5448414E4B20594F5520464F52205649534954494E470A // "THANK YOU FOR VISITING"
  4645454C204445504F540A                      // "FUEL DEPOT"
  1B6402                                      // Feed 2 lines
  1D564100                                    // Cut paper
  `;

  // const hexToBytes = (hex) => {
  //   return Buffer.from(hex.replace(/\n|\s|\/\/.*$/g, ""), "hex");
  // };

  const hexToBytes = (hex) => {
    // Remove whitespace, newline characters, and comments
    hex = hex.replace(/\n|\s|\/\/.*$/g, "");

    // Ensure the hex string has an even length
    if (hex.length % 2 !== 0) {
      hex = "0" + hex;
    }

    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return bytes;
  };

  const commandBytes = hexToBytes(fuelInvoice);
  console.log(commandBytes);

  const [inputValue, setInputValue] = useState();
  // console.log('====================================');
  // console.log(inputValue);
  // console.log('====================================');
  function hexToString(hex) {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  }

  function convertToHex(str) {
    var hex = "";
    for (var i = 0; i < str.length; i++) {
      hex += "" + str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  // console.log(serialPort.list());

  const [chg, setChg] = useState({ hex: "", text: "" });
  useEffect(() => {
    const setupSerialPort = async () => {
      try {
        console.log("start pro");
        const serialPort = await SerialPortAPI.open("/dev/ttyS5", {
          baudRate: 9600,
        });

        console.log(serialPort);
        // Check if the serial port is open
        if (serialPort) {
          console.log("Serial port is open");
          // Subscribe to received data
          const subscription = serialPort.onReceived((buff) => {
            console.log("====================================");
            console.log(buff);
            console.log("====================================");
            console.log("to hex", buff.toString("hex").toUpperCase());
            console.log(
              " to text",
              hexToString(buff.toString("hex").toUpperCase())
            );

            setChg({
              hex: buff.toString("hex").toUpperCase(),
              text: hexToString(buff.toString("hex").toUpperCase()),
            });

            console.log(subscription);

            // Handle the received data as neede
          });

          // Remember to close the port and unsubscribe when the component unmounts
          return () => {
            console.log("port close");
            subscription.remove();
            serialPort.close();
          };
        } else {
          console.log("Failed to open the serial port");
        }
      } catch (error) {
        console.log("Error opening the serial port:", error);
      }
    };

    // Call the setup function
    setupSerialPort();
  }, []); // The empty dependency array ensures that this effect runs only once on mount

  // useEffect(() => {
  //   try {
  //     const sentFun = async () => {
  //       const serialPort = await SerialPortAPI.open("/dev/ttyS5", {
  //         baudRate: 9600,
  //       });
  //       if (chg.hex) {
  //         await serialPort.send("5245434549564544");
  //       }
  //     };
  //     sentFun();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [chg]);

  const stationName = convertToHex("Kyawsan(027) - Nyaung Tone");
  const location = convertToHex("KywalTatSone, Shan,");
  const location2 = convertToHex("East, Myanmar");
  const phone1 = convertToHex("09123456789");
  const phone2 = convertToHex("09123456789");
  const date = convertToHex("23/11/2003");
  const time = convertToHex("10:40 AM");
  const noz = convertToHex("08");
  const vocono = convertToHex("m1/345342534342/20");
  const basePrice = convertToHex("4500");
  const liter = convertToHex("10.5");
  const total = convertToHex("45000");
  const fuel = convertToHex("005-Premium Diesel(92)");

  const sentBtn = async () => {
    try {
      console.log("start clicked");
      const serialPort = await SerialPortAPI.open("/dev/ttyS5", {
        baudRate: 9600,
      });
      await serialPort.send(`1B401B6101${stationName}0A`);
      await serialPort.send(`${location}0A`);
      await serialPort.send(`${location2}0A`);
      await serialPort.send(`${phone1}2C20${phone2}0A`);
      // await serialPort.send("3730322D3736312D373030300A");
      await serialPort.send("1B6100");
      await serialPort.send(
        "2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A"
      );
      await serialPort.send(`564F434F4E4F202020${vocono}0A`);
      await serialPort.send(`444154452020202020${date}0A`);
      await serialPort.send(`54494D452020202020${time}0A`);
      await serialPort.send(`4E4F5A5A4C45202020${noz}0A`);
      await serialPort.send(
        "2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A"
      );
      // await serialPort.send("44455441494C530A");
      await serialPort.send(`4655454C20202020${fuel}0A`);
      await serialPort.send(
        `4241534520505249434520202020${basePrice}204D4D4B202F204C495445520A`
      );
      await serialPort.send(`53414C45204C4954455253202020${liter}204C490A`);
      await serialPort.send(`544F54414C202020202020202020${total}204D4D4B0A`);
      await serialPort.send(
        `202020202020202020202020202028494E434C555349564520544158290A`
      );
      // await serialPort.send("0A");
      await serialPort.send(
        "2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D2D0A"
      );
      // await serialPort.send("0A");
      // await serialPort.send("24582039382E353520524547204655454C0A");
      // await serialPort.send("245820342E3433205441580A");
      // await serialPort.send(
      //   "24582D3130322E3938205649534120444542495420504149440A"
      // );
      // await serialPort.send("0A");
      // await serialPort.send("245820302E30302042414C414E43450A");
      // await serialPort.send("0A");
      await serialPort.send("1B6101");
      await serialPort.send("5448414E4B20594F5520464F52205649534954494E470A");
      // await serialPort.send("4645454C204445504F540A");
      await serialPort.send("1B6401");
      await serialPort.send("1D564100");

      // await serialPort.send(
      //   "1B4048656C6C6F2C20576F726C64210A576F726C640A2D2D2D2D2D2D2D2D2D2D0A"
      // );
      console.log("wk");
    } catch (error) {
      console.log(error);
    }
  };

  const sentCustom = async () => {
    try {
      const serialPort = await SerialPortAPI.open("/dev/ttyS5", {
        // baudRate: 38400,
        baudRate: 9600,
      });
      console.log("start clicked", serialPort);

      const hexData = convertToHex(inputValue);
      // await serialPort.send([
      //   0x1b, 0x40, 0x1b, 0x61, 0x01, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20,
      //   0x57, 0x6f, 0x72, 0x6c, 0x64, 0x21, 0x0a,
      // ]);
      await serialPort.send(`1B40${hexData}0A`);
      // await serialPort.send("1B3048656C6C6F2048746F6F");
      // await serialPort.send("1B6402");

      //1B64 print
      //04 paper size
      //48 to end = Hello Htoo

      // await serialPort.send("1B640448656C6C6F2048746F6F");
      // await serialPort.send("1B40");
      // await serialPort.send("48656C6C6F");
      // await serialPort.send("1B4048656C6C6F2C20576F726C64210A");

      // console.log(data, "this is");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <TouchableOpacity onPress={sentBtn} style={tw`p-5 mb-5 bg-red-400`}>
        <Text>Click me!</Text>
      </TouchableOpacity>
      <View
        style={tw`flex w-[800px] gap-4 items-center justify-center flex-row`}
      >
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          style={tw`bg-gray-200 w-[250px] my-5  rounded-md pl-4 text-xl`}
        />
        <TouchableOpacity
          onPress={sentCustom}
          style={tw`py-4 px-6 rounded-md bg-green-400`}
        >
          <Text>Click me!</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={tw`text-[2rem]`}>hex: {chg.hex}</Text>
        <Text style={tw`text-[2rem]`}>text: {chg.text}</Text>
      </View>
    </View>
  );
};

export default App;
