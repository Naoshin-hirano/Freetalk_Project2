<template>
    <v-container mt-5>
        <v-layout>
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <h2 class="text-center mb-5">{{$t('registration_info')}}</h2>
                            <changeEmail/>
                            <v-divider class="mt-10 mb-9"></v-divider>
                            <changePassword/>
                            <v-divider class="mt-8 mb-7"></v-divider>
                            <deleteUserAccount/>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import changePassword from '../User/ChangePassword.vue'
import changeEmail from '../User/ChangeEmail.vue'
import deleteUserAccount from '../User/DeleteUserAccount.vue'
export default {
  components: { changePassword, changeEmail, deleteUserAccount }
}
</script>

