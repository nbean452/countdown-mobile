import React from "react";
// import type { PropsWithChildren } from "react";

import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

const App = (): JSX.Element => {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        backgroundColor={backgroundStyle.backgroundColor}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      {/* <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
      </ScrollView> */}
    </SafeAreaView>
  );
};

export default App;
