import { Image, StyleSheet, Platform, View, Text } from "react-native";
import { useState } from "react";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { List, Checkbox, Button } from "react-native-paper";
import ShabhaManjari from "../data/shabdha-manjari.json";
import { useNavigation } from "@react-navigation/native";
import { useSelectedWordsContext } from "@/components/SelectedWordsContext"; // Import the custom hook
import { Data } from "@/app/interfaces";

export default function HomeScreen() {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  const { sharedState, setSharedState } = useSelectedWordsContext();

  const handleCheckboxToggle = (key: string, value: string) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [`${key}-${value}`]: !prevState[`${key}-${value}`],
    }));
    setSharedState((prevState) => {
      const newWords =
        prevState[key] && prevState[key].includes(value)
          ? prevState[key].filter((item) => item != value)
          : prevState[key]
          ? [...prevState[key], value]
          : [value];
      const cleanedObj = Object.fromEntries(
        Object.entries({ ...prevState, [key]: newWords }).filter(
          ([key, value]) => value.length > 0
        )
      );
      return cleanedObj;
    });
  };

  const shabdhaManjari: Data = ShabhaManjari;
  const words = "शब्दाः";
  const navigation = useNavigation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/premio-cosmos-800x600.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">सङ्गठन</ThemedText>
        <HelloWave />
      </ThemedView>
      <List.AccordionGroup>
        {Object.keys(shabdhaManjari).map((gender, index) => (
          <List.Accordion title={gender + " " + words} id={gender} key={index}>
            {Object.keys(shabdhaManjari[gender]).map((word, itemIndex) => (
              <View
                key={itemIndex}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Checkbox
                  status={
                    checkedItems[`${gender}-${word}`] ? "checked" : "unchecked"
                  }
                  onPress={() => handleCheckboxToggle(gender, word)}
                />
                <List.Item
                  title={word}
                  onPress={() => handleCheckboxToggle(gender, word)}
                />
              </View>
            ))}
          </List.Accordion>
        ))}
      </List.AccordionGroup>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => navigation.navigate("exam" as never)}
      >
        परीक्षाम् आरभताम्।
      </Button>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
