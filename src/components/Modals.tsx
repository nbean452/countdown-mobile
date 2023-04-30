import React, { useState } from "react";

import camelcaseKeys from "camelcase-keys";
import dayjs from "dayjs";
import {
  KeyboardAvoidingView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Modal, Text, Button, FAB, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import uuid from "react-native-uuid";

import { Container } from "./StyledComponents";
import { setCountdowns, setCurrentCountdown } from "../redux/countdownSlice";
import { setModal } from "../redux/modalSlice";
import client from "../utils/client";
import { useDispatch, useSelector } from "../utils/hooks";
import sortFunc from "../utils/sort";
import type { CountdownProps, CountdownPropsSnakeCase } from "../utils/types";
import { vh, vw } from "../utils/viewport";

const Modals = () => {
  const isDarkMode = useColorScheme() === "dark";

  const { modal, countdown } = useSelector((state) => state);

  const currentCountdown = countdown.currentCountdown as CountdownProps;

  const dispatch = useDispatch();

  // new countdown variables
  const [newCountdownName, setNewCountdownName] = useState<string>("");
  const [newCountdownEndDate, setNewCountdownEndDate] = useState<string>(
    dayjs(new Date()).endOf("day").toISOString(),
  );

  const FABStyle: any = {
    bottom: 75,
    margin: 0,
    position: "absolute",
    right: 25,
    zIndex: 5,
  };

  const containerStyle: any = {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    borderRadius: 10,
    width: vw(90),
  };

  const setHideAddModal = () => {
    dispatch(setModal({ add: false }));
  };

  const setHideEditModal = () => {
    dispatch(setModal({ edit: false }));
  };

  const setHideDeleteModal = () => {
    dispatch(setModal({ delete: false }));
  };

  return (
    <>
      {/* Add */}
      <Modal
        contentContainerStyle={containerStyle}
        style={{ width: vw(100) }}
        visible={modal.add}
        onDismiss={setHideAddModal}
      >
        <KeyboardAvoidingView behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container isDarkMode={isDarkMode} style={{ width: vw(90) }}>
              <Text variant="titleMedium">Add new countdown</Text>
              <TextInput
                label="Countdown Name"
                value={newCountdownName}
                onChange={(e) => setNewCountdownName(e.nativeEvent.text)}
                // onChangeText={(text) => setText(text)}
              />
              <View style={{ maxHeight: vh(10) }}>
                <DatePickerInput
                  inputMode="start"
                  label="Countdown date"
                  locale="en"
                  value={new Date(newCountdownEndDate)}
                  onChange={(d) =>
                    setNewCountdownEndDate(dayjs(d).endOf("day").toISOString())
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  disabled={!newCountdownName || !newCountdownEndDate}
                  onPress={async () => {
                    const result: CountdownPropsSnakeCase = {
                      created_by: "Nicholas",
                      end_date: newCountdownEndDate,
                      id: uuid.v4().toString(),
                      name: newCountdownName,
                    };

                    const newCountdown = camelcaseKeys(result, {
                      deep: true,
                    });

                    const newCountdowns = [
                      ...countdown.countdowns,
                      newCountdown,
                    ].sort(sortFunc);

                    // reset the useState
                    setNewCountdownEndDate(
                      dayjs(new Date()).endOf("day").toISOString(),
                    );
                    setNewCountdownName("");
                    dispatch(setCountdowns(newCountdowns));
                    dispatch(setHideAddModal);

                    const { error } = await client
                      .from("hourglass")
                      .insert(result);

                    if (error) console.error(error);
                  }}
                >
                  Confirm Add
                </Button>
                <Button onPress={setHideAddModal}>Close</Button>
              </View>
            </Container>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit */}
      <Modal
        contentContainerStyle={containerStyle}
        visible={modal.edit}
        onDismiss={setHideEditModal}
      >
        <KeyboardAvoidingView behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container isDarkMode={isDarkMode} style={{ width: vw(90) }}>
              <Text variant="titleMedium">{`Edit "${currentCountdown.name}"`}</Text>
              <TextInput
                label="Countdown Name"
                value={currentCountdown.name}
                onChange={(e) =>
                  dispatch(setCurrentCountdown({ name: e.nativeEvent.text }))
                }
                // onChangeText={(text) => setText(text)}
              />
              <View style={{ maxHeight: vh(10) }}>
                <DatePickerInput
                  inputMode="start"
                  label="Countdown date"
                  locale="en"
                  value={new Date(currentCountdown.endDate)}
                  onChange={(d) =>
                    dispatch(
                      setCurrentCountdown({
                        endDate: dayjs(d).endOf("day").toISOString(),
                      }),
                    )
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onPress={async () => {
                    const result: CountdownPropsSnakeCase = {
                      created_by: currentCountdown.createdBy,
                      end_date: currentCountdown.endDate,
                      id: currentCountdown.id,
                      name: currentCountdown.name,
                    };

                    const newCountdowns = countdown.countdowns
                      // modify current countdown
                      .map((item) =>
                        item.id === currentCountdown.id
                          ? currentCountdown
                          : item,
                      )
                      // then sort the countdowns based on new ending date
                      .sort(sortFunc);

                    dispatch(setCountdowns(newCountdowns));
                    dispatch(setHideEditModal);

                    const { error } = await client
                      .from("hourglass")
                      .update(result)
                      .eq("id", currentCountdown.id);

                    if (error) console.error(error);
                  }}
                >
                  Confirm Edit
                </Button>
                <Button onPress={setHideEditModal}>Close</Button>
              </View>
            </Container>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Delete */}
      <Modal
        contentContainerStyle={containerStyle}
        style={{ width: vw(100) }}
        visible={modal.delete}
        onDismiss={setHideDeleteModal}
      >
        <Container isDarkMode={isDarkMode} style={{ width: vw(90) }}>
          <Text variant="titleMedium">{`Delete "${currentCountdown.name}"?`}</Text>
          <Button
            onPress={async () => {
              const filteredCountdowns = countdown.countdowns.filter(
                (item) => item.id !== currentCountdown.id,
              );

              dispatch(setCountdowns(filteredCountdowns));
              dispatch(setHideDeleteModal);

              const { error } = await client
                .from("hourglass")
                .delete()
                .eq("id", currentCountdown.id);

              if (error) console.error(error);
            }}
          >
            Delete
          </Button>
          <Button onPress={setHideDeleteModal}>Close</Button>
        </Container>
      </Modal>

      <FAB
        icon="plus"
        style={FABStyle}
        visible={!(modal.delete || modal.edit) && !modal.add}
        onPress={() => dispatch(setModal({ add: true }))}
      />
    </>
  );
};

export default Modals;
