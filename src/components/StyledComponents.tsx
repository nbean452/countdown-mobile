/* eslint-disable import/prefer-default-export */
import styled from "styled-components/native";

interface DarkMode {
  isDarkMode: boolean;
}

export const Container = styled.View<DarkMode>`
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  justify-content: center;
`;
