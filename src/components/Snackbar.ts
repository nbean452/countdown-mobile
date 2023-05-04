import RNSnackbar from "react-native-snackbar";

interface SnackbarProps {
  text: string;
}

const Snackbar = ({ text }: SnackbarProps) => {
  RNSnackbar.show({
    action: {
      text: "close",
      textColor: "yellow",
    },
    text,
  });
};

export default Snackbar;
