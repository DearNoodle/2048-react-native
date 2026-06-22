import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "2048 (Ben)",
          // 設定標題列背景顏色
          headerStyle: {
            backgroundColor: "#5c534c",
          },
          // 設定返回按鈕及標題文字的顏色
          headerTintColor: "#fff",
          // 設定標題文字的字型大小與粗細
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          // 讓標題文字在 Android 上置中對齊（iOS 預設為置中）
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
