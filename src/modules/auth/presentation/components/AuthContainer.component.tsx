import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeContext } from "@/core/contexts/theme.context";

interface AuthContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthContainer = ({
  title,
  subtitle,
  children,
}: AuthContainerProps) => {
  const { palette } = useThemeContext();

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: palette.colors.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor:
                palette.colors.surfaceSecondary,
            },
          ]}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={42}
            color={palette.colors.primary.default}
          />
        </View>

        <Text
          style={[
            styles.title,
            { color: palette.texts.primary },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: palette.texts.secondary },
          ]}
        >
          {subtitle}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.colors.surface,
              borderColor: palette.colors.border,
              ...palette.shadows.sm,
            },
          ]}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 40,
  },
  iconBox: {
    alignSelf: "center",
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 7,
    marginBottom: 24,
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 18,
  },
});