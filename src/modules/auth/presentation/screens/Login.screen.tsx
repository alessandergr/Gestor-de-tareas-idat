import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View,} from "react-native";
import { firebaseAuth } from "@/config/firebase/firebase.config";
import { CustomButton } from "@/core/components/CustomButton.component";
import { InputField } from "@/core/components/InputField.components";
import { useThemeContext } from "@/core/contexts/theme.context";
import { AuthContainer } from "../components/AuthContainer.component";

interface LoginErrors {
  email: string;
  password: string;
}

const getLoginErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return "Ocurrió un error inesperado.";
  }

  switch (error.code) {
    case "auth/invalid-credential":
      return "El correo o la contraseña son incorrectos.";

    case "auth/invalid-email":
      return "El correo electrónico no es válido.";

    case "auth/too-many-requests":
      return "Se realizaron demasiados intentos. Intenta más tarde.";

    case "auth/network-request-failed":
      return "Revisa tu conexión a internet.";

    default:
      return "No se pudo iniciar sesión.";
  }
};

export const LoginScreen = () => {
  const router = useRouter();
  const { palette } = useThemeContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<LoginErrors>({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
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

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(
        firebaseAuth,
        cleanEmail,
        password,
      );

      router.replace("/products");
    } catch (error: unknown) {
      Alert.alert(
        "No se pudo iniciar sesión",
        getLoginErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
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
          editable={!isLoading}
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
          editable={!isLoading}
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
            title={
              isLoading
                ? "Iniciando sesión..."
                : "Iniciar sesión"
            }
            disabled={isLoading}
            onPress={handleLogin}
          />
        </View>

        <View style={styles.registerRow}>
          <Text
            style={{
              color: palette.texts.secondary,
            }}
          >
            ¿No tienes una cuenta?
          </Text>

          <Pressable
            disabled={isLoading}
            onPress={() => router.push("/register")}
          >
            <Text
              style={[
                styles.link,
                {
                  color:
                    palette.colors.primary.default,
                  opacity: isLoading ? 0.5 : 1,
                },
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