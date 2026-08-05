import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";
import { AuthContainer } from "../components/AuthContainer.component";

interface LoginErrors {
  email: string;
  password: string;
}

export const LoginScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<LoginErrors>({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    const cleanEmail = email.trim();

    const nextErrors: LoginErrors = {
      email:
        cleanEmail.length === 0
          ? "Ingrese su correo"
          : !/^\S+@\S+\.\S+$/.test(cleanEmail)
            ? "Ingrese un correo válido"
            : "",
      password:
        password.length === 0
          ? "Ingrese su contraseña"
          : password.length < 6
            ? "La contraseña debe tener al menos 6 caracteres"
            : "",
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    router.replace("/products");
  };

  return (
    <AuthContainer
      title="Bienvenido"
      subtitle="Inicia sesión para organizar tus tareas."
    >
      <View style={styles.form}>
        <InputField
          label="Correo electrónico"
          placeholder="correo@ejemplo.com"
          value={email}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({
              ...current,
              email: "",
            }));
          }}
        />

        <InputField
          label="Contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          error={errors.password}
          secureTextEntry
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({
              ...current,
              password: "",
            }));
          }}
        />

        <View style={styles.button}>
          <CustomButton
            title="Iniciar sesión"
            onPress={handleLogin}
          />
        </View>

        <View style={styles.registerRow}>
          <Text style={{ color: palette.texts.secondary }}>
            ¿No tienes una cuenta?
          </Text>

          <Pressable onPress={() => router.push("/register")}>
            <Text
              style={[
                styles.link,
                { color: palette.colors.primary.default },
              ]}
            >
              Regístrate
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
  button: {
    height: 54,
    marginTop: 4,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  link: {
    fontWeight: "700",
  },
});