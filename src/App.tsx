import React from "react";

import {
  Portal as RNPaperPortal,
  Provider as RNPaperProvider,
} from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Modals from "./components/Modals";
import Home from "./Home";
import configureStore from "./redux/configureStore";

registerTranslation("en", en);

const App = () => {
  const { store, persistor } = configureStore();
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RNPaperProvider>
          <RNPaperPortal>
            <Home />
            <Modals />
          </RNPaperPortal>
        </RNPaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default App;
