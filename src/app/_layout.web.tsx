import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "2048 web ver (Ben)" }} />
    </Stack>
  );
}
