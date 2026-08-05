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

interface RegisterErrors {
  name: string;
  email: string;
  password: string;
  confirmation: string;
}

export const RegisterScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [errors, setErrors] = useState<RegisterErrors>({
    name: "",
    email: "",
    password: "",
    confirmation: "",
  });

  const handleRegister = () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();

    const nextErrors: RegisterErrors = {
      name:
        cleanName.length < 3
          ? "Ingrese un nombre válido"
          : "",
      email:
        cleanEmail.length === 0
          ? "Ingrese su correo"
          : !/^\S+@\S+\.\S+$/.test(cleanEmail)
            ? "Ingrese un correo válido"
            : "",
      password:
        password.length < 6
          ? "La contraseña debe tener al menos 6 caracteres"
          : "",
      confirmation:
        confirmation.length === 0
          ? "Confirme su contraseña"
          : confirmation !== password
            ? "Las contraseñas no coinciden"
            : "",
    };

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(
      (message) => message.length > 0,
    );

    if (hasErrors) {
      return;
    }

    router.replace("/login");
  };

  return (
    <AuthContainer
      title="Crear cuenta"
      subtitle="Regístrate para guardar y consultar tus tareas."
    >
      <View style={styles.form}>
        <InputField
          label="Nombre"
          placeholder="Ingresa tu nombre"
          value={name}
          error={errors.name}
          onChangeText={(value) => {
            setName(value);
            setErrors((current) => ({
              ...current,
              name: "",
            }));
          }}
        />

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
          placeholder="Mínimo 6 caracteres"
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

        <InputField
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={confirmation}
          error={errors.confirmation}
          secureTextEntry
          onChangeText={(value) => {
            setConfirmation(value);
            setErrors((current) => ({
              ...current,
              confirmation: "",
            }));
          }}
        />

        <View style={styles.button}>
          <CustomButton
            title="Registrarme"
            onPress={handleRegister}
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={{ color: palette.texts.secondary }}>
            ¿Ya tienes una cuenta?
          </Text>

          <Pressable onPress={() => router.replace("/login")}>
            <Text
              style={[
                styles.link,
                { color: palette.colors.primary.default },
              ]}
            >
              Inicia sesión
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  button: {
    height: 54,
    marginTop: 4,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  link: {
    fontWeight: "700",
  },
});