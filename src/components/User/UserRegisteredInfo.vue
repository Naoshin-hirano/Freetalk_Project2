<template>
    <v-container mt-5>
        <v-layout>
            <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <h2 class="text-center mb-5">登録情報</h2>
                            <ChangeEmail/>
                            <v-divider class="mt-10 mb-9"></v-divider>
                            <ChangePassword/>
                            <v-divider class="mt-8 mb-7"></v-divider>
                            <DeleteUserAccount/>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import ChangePassword from '../User/ChangePassword.vue'
import ChangeEmail from '../User/ChangeEmail.vue'
import DeleteUserAccount from '../User/DeleteUserAccount.vue'
export default {
  components: { ChangePassword, ChangeEmail, DeleteUserAccount }
}
</script>

