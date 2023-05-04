import React, { useEffect, useState } from "react";

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

import Snackbar from "./Snackbar";
import { Container } from "./StyledComponents";
import { setCountdowns } from "../redux/countdownSlice";
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

  const [editCountdownName, setEditCountdownName] = useState<string>("");
  const [editCountdownEndDate, setEditCountdownEndDate] = useState<string>("");

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

  useEffect(() => {
    setEditCountdownEndDate(currentCountdown.endDate);
    setEditCountdownName(currentCountdown.name);
  }, [currentCountdown]);

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

                    if (error) Snackbar({ text: error.message });
                    else Snackbar({ text: `Added "${result.name}"` });
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
                value={editCountdownName}
                onChange={(e) => setEditCountdownName(e.nativeEvent.text)}
              />
              <View style={{ maxHeight: vh(10) }}>
                <DatePickerInput
                  inputMode="start"
                  label="Countdown date"
                  locale="en"
                  value={new Date(editCountdownEndDate)}
                  onChange={(d) =>
                    setEditCountdownEndDate(dayjs(d).endOf("day").toISOString())
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
                  disabled={
                    currentCountdown.name === editCountdownName &&
                    currentCountdown.endDate === editCountdownEndDate
                  }
                  onPress={async () => {
                    const result: CountdownPropsSnakeCase = {
                      created_by: currentCountdown.createdBy,
                      end_date: editCountdownEndDate,
                      id: currentCountdown.id,
                      name: editCountdownName,
                    };

                    const newCountdowns = countdown.countdowns
                      // modify current countdown
                      .map((item) =>
                        item.id === currentCountdown.id
                          ? camelcaseKeys(result, { deep: true })
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

                    if (error) Snackbar({ text: error.message });
                    else
                      Snackbar({
                        text: `Edited "${result.name}"`,
                      });
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

              if (error) Snackbar({ text: error.message });
              else Snackbar({ text: `Deleted "${currentCountdown.name}"` });
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
