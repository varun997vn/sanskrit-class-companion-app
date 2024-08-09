import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View, Image } from "react-native";
import { Button } from "react-native-paper";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSelectedWordsContext } from "@/components/SelectedWordsContext";
import { useNavigation } from "@react-navigation/native";
import ShabhaManjari from "../data/shabdha-manjari.json";
import { Data, Word } from "@/app/interfaces";
import Evam from "../data/evam.json";
import { Colors } from "@/constants/Colors";

let previousQuestion = "",
  previousAnswer = "";

function getRandomKey(obj: { [key: string]: string[] }) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function getRandomElement(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getQuestion(
  selectedWords: { [key: string]: string[] },
  showAnswer: boolean
) {
  if (showAnswer) {
    return [previousQuestion, previousAnswer];
  }
  const shabdhaManjari: Data = ShabhaManjari;
  const evam: Word = Evam;
  const isEvam = Math.floor(Math.random() * 10) == 2;
  const gender = getRandomKey(selectedWords);
  const word = getRandomElement(selectedWords[gender]);
  const vibhakthi = getRandomElement(Object.keys(shabdhaManjari[gender][word]));
  const answer = isEvam
    ? evam[gender][word]
      ? evam[gender][word].join(" | ")
      : "अस्य शब्दस्य एवम् न अस्ति।"
    : shabdhaManjari[gender][word][vibhakthi].join("   |   ");

  const question = isEvam
    ? `${word} शब्दस्य एवम् किम् अस्ति?`
    : `${word} शब्दस्य ${vibhakthi} विभक्ति किञ्चित् अस्ति?`;

  previousQuestion = question;
  previousAnswer = answer;

  return [question, answer];
}

export default function TabTwoScreen() {
  const { sharedState } = useSelectedWordsContext();
  const [newQuestionToggle, setNewQuestionToggle] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const hasNonEmptyList = Object.values(sharedState).some(
    (arr) => arr.length > 0
  );
  const navigation = useNavigation();
  const [question, answer] = hasNonEmptyList
    ? getQuestion(sharedState, showAnswer)
    : ["", ""];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/636215634914521096-image001.webp")}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">परीक्षा</ThemedText>
      </ThemedView>
      {hasNonEmptyList ? (
        <View>
          <ThemedText>{question}</ThemedText>

          {showAnswer && <ThemedText>{answer}</ThemedText>}
          <View style={styles.buttonAnswerView}>
            <Button
              icon="eye"
              mode="contained"
              buttonColor={Colors.light.tabIconSelected}
              onPress={() => setShowAnswer(true)}
            >
              <ThemedText type="button">उत्तरम् पश्य</ThemedText>
            </Button>
          </View>
        </View>
      ) : (
        <ThemedText>सङ्गठनात् शब्दान् चिनु</ThemedText>
      )}

      {hasNonEmptyList ? (
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              icon="cog"
              mode="contained"
              buttonColor={Colors.light.tabIconSelected}
              onPress={() => navigation.navigate("index" as never)}
            >
              <ThemedText type="button">सङ्गठन</ThemedText>
            </Button>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              icon="chevron-right"
              mode="contained"
              buttonColor={Colors.light.tabIconSelected}
              onPress={() => {
                getQuestion(sharedState, showAnswer);
                setNewQuestionToggle(!newQuestionToggle);
                setShowAnswer(false); // Reset answer visibility
              }}
            >
              <ThemedText type="button">अग्रम्</ThemedText>
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.buttonAnswerView}>
          <Button
            icon="cog"
            mode="contained"
            buttonColor={Colors.light.tabIconSelected}
            onPress={() => navigation.navigate("index" as never)}
          >
            <ThemedText type="button">सङ्गठन</ThemedText>
          </Button>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  buttonContainer: {
    flexDirection: "row", // Align buttons side by side
    justifyContent: "space-between", // Space out buttons evenly
    marginTop: 20, // Add some margin to separate from other elements
  },
  buttonWrapper: {
    flex: 1, // Take up equal space for each button
    marginHorizontal: 5, // Add some space between the buttons
  },
  buttonAnswerView: {
    flex: 1, // Take up equal space for each button
    marginHorizontal: 5, // Add some space between the buttons
    marginTop: 20,
  },
});
