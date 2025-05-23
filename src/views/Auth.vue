<template>
  <div class="auth-wrapper">
    <v-container fluid fill-height class="auth-container">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="24" class="rounded-lg auth-card">
            <v-card-text class="text-center">
              <v-img
                src="logo1.png"
                alt="ROTC Sys Logo"
                max-width="150"
                class="mx-auto mb-4 logo"
              />
              <h1 class="font-weight-bold display-3">ROTC Sys</h1>
            </v-card-text>

            <v-card-title class="headline primary white--text text">
              <v-icon large left color="black">mdi-shield-account</v-icon>
              {{ isLogin ? "Login" : "Sign Up" }}
            </v-card-title>

            <v-card-text class="text-center mb-4">
              <h2>
                {{
                  isLogin
                    ? "Please enter your credentials to login:"
                    : "Please enter your details to sign up:"
                }}
              </h2>
            </v-card-text>

            <v-card-text class="pt-4">
              <v-form @submit.prevent="handleSubmit" ref="form">
                <v-text-field
                  v-if="!isLogin"
                  v-model="fullName"
                  :rules="[rules.required]"
                  label="Full Name"
                  prepend-icon="mdi-account"
                  required
                  color="primary"
                />

                <v-text-field
                  v-if="!isLogin"
                  v-model="phoneNumber"
                  :rules="[rules.required, rules.phone]"
                  label="Phone Number"
                  prepend-icon="mdi-phone"
                  required
                  color="primary"
                />

                <v-text-field
                  v-model="email"
                  :rules="[rules.required, rules.email]"
                  label="Email"
                  prepend-icon="mdi-email"
                  type="email"
                  required
                  color="primary"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :rules="[rules.required, rules.min]"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  required
                  color="primary"
                ></v-text-field>

                <!-- Role Select (Mandatory in both login and sign up) -->
                <v-select
                  v-model="role"
                  :items="['Cadet', 'Officer']"
                  :rules="[rules.required]"
                  label="Select Role"
                  prepend-icon="mdi-account-badge"
                  required
                  color="primary"
                />

                <!-- Remember Me Checkbox (only in login mode) -->
                <v-checkbox
                  v-if="isLogin"
                  v-model="rememberMe"
                  label="Remember Me"
                  class="mt-2"
                  color="primary"
                ></v-checkbox>
              </v-form>
            </v-card-text>

            <!-- Login/SignUp Button -->
            <v-row justify="center" class="pt-4">
              <v-col cols="12" class="text-center">
                <v-btn
                  color="black"
                  :loading="loading"
                  @click="handleSubmit"
                  class="px-6 white--text mx-6 text"
                  elevation="8"
                >
                  <v-icon left>{{
                    isLogin ? "mdi-login" : "mdi-account-plus"
                  }}</v-icon>
                  {{ isLogin ? "Login" : "Sign Up" }}
                </v-btn>
              </v-col>
            </v-row>

            <!-- Toggle and Logout Buttons -->
            <v-row>
              <v-col
                cols="12"
                class="d-flex justify-space-between align-center pt-4"
              >
                <v-btn
                  text
                  color="transparent"
                  class="text ms-3 mb-2"
                  @click="toggleForm"
                  v-if="!isLogin"
                >
                  Already have an account? Login
                </v-btn>
                <v-btn
                  text
                  color="transparent"
                  class="text ms-3 mb-2"
                  @click="toggleForm"
                  v-if="isLogin"
                >
                  Don't have an account? Register
                </v-btn>

                <!-- <v-btn
                  v-if="isLoggedIn"
                  color="red"
                  class="px-6 white--text logout-button text me-3"
                  elevation="8"
                  @click="handleLogout"
                >
                  <v-icon left>mdi-logout</v-icon>
                  Logout
                </v-btn> -->
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { signUp, login, logout } from "./supabase";
import { useRouter } from "vue-router";

export default {
  name: "ChromaticAuthForm",
  setup() {
    const email = ref("");
    const password = ref("");
    const fullName = ref("");
    const phoneNumber = ref("");
    const showPassword = ref(false);
    const role = ref("");
    const router = useRouter();

    const isLogin = ref(true);
    const loading = ref(false);
    const snackbar = ref(false);
    const snackbarText = ref("");
    const snackbarColor = ref("success");
    const form = ref(null);
    const isLoggedIn = ref(false);
    const rememberMe = ref(true);

    const rules = reactive({
      required: (v) => !!v || "This field is required",
      email: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      phone: (v) => /^\d+$/.test(v) || "Phone number must be numeric",

      min: (v) => {
        if (v.length < 8) return "Password must be at least 8 characters";
        if (v.length > 20) return "Password must not exceed 20 characters";
        return true;
      },
    });

    onMounted(() => {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail && savedPassword) {
        email.value = savedEmail;
        password.value = savedPassword;
        rememberMe.value = true;
      }
    });

    const toggleForm = () => {
      isLogin.value = !isLogin.value;
      email.value = "";
      password.value = "";
      fullName.value = "";
      phoneNumber.value = "";
      rememberMe.value = false;
      form.value.resetValidation();
      role.value = "";
    };

    const showMessage = (message, color = "success") => {
      snackbarText.value = message;
      snackbarColor.value = color;
      snackbar.value = true;
    };

    const handleSubmit = async () => {
      if (form.value.validate()) {
        loading.value = true;
        try {
          const { error } = isLogin.value
            ? await login(email.value, password.value, role.value)
            : await signUp(
                email.value,
                password.value,
                fullName.value,
                phoneNumber.value,
                role.value
              );

          if (error) throw error;

          if (isLogin.value && rememberMe.value) {
            localStorage.setItem("rememberedEmail", email.value);
            localStorage.setItem("rememberedPassword", password.value);
          } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
          }

          showMessage(
            isLogin.value ? "Login Successful" : "Sign Up Successful"
          );
          isLoggedIn.value = true;

          // Add a 2-second delay before redirecting
          await new Promise((resolve) => setTimeout(resolve, 5000));

          // Redirect to /home after the delay
          router.push("/home");
        } catch (error) {
          showMessage(error.message, "error");
        } finally {
          loading.value = false;
        }
      }
    };

    const handleLogout = async () => {
      await logout();
      isLoggedIn.value = false;
      showMessage("Logout Successful", "info");
    };

    return {
      email,
      password,
      fullName,
      phoneNumber,
      showPassword,
      isLogin,
      loading,
      snackbar,
      snackbarText,
      snackbarColor,
      form,
      rules,
      isLoggedIn,
      rememberMe,
      toggleForm,
      handleSubmit,
      handleLogout,
      role,
    };
  },
};
</script>

<style scoped>
* {
  font-family: sans-serif;
}

.text {
  font-family: monospace !important;
}

h1 {
  font-size: 2.5rem !important;
  font-family: monospace;
}

h2 {
  font-size: 1.3rem;
  font-family: serif;
}

.v-input__control .v-input__slot input {
  font-size: 16px;
}

.v-label {
  font-size: 21px;
}

.v-btn {
  color: white;
}

.auth-wrapper {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

.auth-container {
  max-width: 100%;
  max-height: 100%;
  
}

.auth-card {
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.auth-card::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ffffff, #ffffff);
  z-index: -1;
  filter: blur(10px);
  animation: glowing 20s linear infinite;
}

@keyframes glowing {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}

.bottom-buttons {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
