import { useEffect, useState } from "react";

import camelcaseKeys from "camelcase-keys";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Text } from "react-native-paper";

import CountdownTimer from "./components/CountdownTimer";
import { Container } from "./components/StyledComponents";
import { setCountdowns } from "./redux/countdownSlice";
import { clearModal } from "./redux/modalSlice";
import client from "./utils/client";
import { useDispatch, useSelector } from "./utils/hooks";
import { CountdownProps } from "./utils/types";
import { vh } from "./utils/viewport";

const Home = () => {
  const isDarkMode = useColorScheme() === "dark";

  const dispatch = useDispatch();

  const { countdown: countdownSelector } = useSelector((state) => state);

  const { countdowns } = countdownSelector;

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    minHeight: vh(100),
  };

  const getCountdowns = async () => {
    try {
      const { data } = await client
        .from("hourglass")
        .select()
        .order("end_date", { ascending: true });
      const camelcaseCountdowns: CountdownProps[] = camelcaseKeys(
        data as never[],
        {
          deep: true,
        },
      );
      dispatch(setCountdowns(camelcaseCountdowns));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    dispatch(clearModal());

    getCountdowns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        backgroundColor={backgroundStyle.backgroundColor}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              getCountdowns();
              setRefreshing(false);
            }}
          />
        }
      >
        <Container isDarkMode={isDarkMode}>
          <Text style={{ textAlign: "center" }} variant="headlineLarge">
            Countdowns
          </Text>
          {countdowns.length > 0 ? (
            countdowns.map((countdown) => (
              <CountdownTimer countdown={countdown} key={countdown.id} />
            ))
          ) : (
            <Text>Nothing yet</Text>
          )}
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
