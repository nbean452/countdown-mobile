import { useEffect, useMemo, useRef, useState } from "react";

import { IconButton, Card, Text, MD3Colors } from "react-native-paper";

import { setCurrentCountdown } from "../redux/countdownSlice";
import { setModal } from "../redux/modalSlice";
import options from "../utils/dateOptions";
import { useDispatch } from "../utils/hooks";
import { CountdownProps } from "../utils/types";

interface CountdownTimerProps {
  countdown: CountdownProps;
}

const CountdownTimer = ({ countdown }: CountdownTimerProps) => {
  const {
    endDate,
    //  createdBy,
    name,
  } = countdown;

  const dispatch = useDispatch();

  const startDate = new Date();

  const [timeLeft, setTimeLeft] = useState(
    new Date(endDate).getTime() - startDate.getTime() > 0
      ? (new Date(endDate).getTime() - startDate.getTime()) / 1000
      : 0,
  );

  const daysLeft = useMemo(
    () => Math.floor(timeLeft / (24 * 3600)),
    [timeLeft],
  );

  const intervalRef: any = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current);
    }
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(
      new Date(endDate).getTime() - startDate.getTime() > 0
        ? (new Date(endDate).getTime() - startDate.getTime()) / 1000
        : 0,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);
  return (
    <Card>
      <Card.Content>
        <Text variant="headlineMedium">{name}</Text>
        {/* <Text>{createdBy}</Text> */}
        <Text>{new Date(endDate).toLocaleDateString("en-us", options)}</Text>
        <Text>{`${daysLeft} day(s) left`}</Text>
      </Card.Content>
      <Card.Actions>
        <IconButton
          icon="pencil"
          iconColor={MD3Colors.primary40}
          size={20}
          onPress={() => {
            dispatch(
              setModal({
                edit: true,
              }),
            );
            dispatch(setCurrentCountdown(countdown));
          }}
        />
        <IconButton
          icon="trash-can"
          iconColor={MD3Colors.error50}
          size={20}
          onPress={() => {
            dispatch(
              setModal({
                delete: true,
              }),
            );
            dispatch(setCurrentCountdown(countdown));
          }}
        />
      </Card.Actions>
    </Card>
  );
};

export default CountdownTimer;
