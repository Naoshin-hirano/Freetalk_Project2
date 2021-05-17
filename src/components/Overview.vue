<template>
    <v-container>
        <v-layout class="mb-5">
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h1>1.{{$t('about')}} </h1>
                <v-divider></v-divider>
                <p class="mt-10 title" style="font-weight:bold;">{{$t('beginning')}} </p>
                <p class="mt-10">{{$t('how_to_help')}} </p>
                <p>・{{$t('target1')}}</p>
                <p>・{{$t('target2')}}</p>
                <p>・{{$t('target3')}}</p>
                <p>・{{$t('target4')}}</p>
                <p class="mt-10" style="text-decoration:underline; font-weight:bold;">
                   <router-link to="/login">{{$t('guest_user_link')}}</router-link>
                </p>
            </v-flex>
        </v-layout>
        <v-layout class="mt-15">
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h1>2.{{$t('usage')}} </h1>
                <v-divider></v-divider>
                <h3 class="mt-10">■{{$t('theme_of_usage1')}}</h3>
                <p class="mt-5">{{$t('explanation1')}}</p>
                <img src="@/assets/gif1.gif" class="hidden-xs-only" alt="" width="70%">
                <img src="@/assets/gif1.gif" class="hidden-sm-and-up" alt="" width="100%">
                <h3 class="mt-10">■{{$t('theme_of_usage2')}}</h3>
                <p class="mt-5">{{$t('explanation2')}}</p>
                <img src="@/assets/gif2.gif" class="hidden-xs-only" alt="" width="70%">
                <img src="@/assets/gif2.gif" class="hidden-sm-and-up" alt="" width="100%">
                <h3 class="mt-10">■{{$t('theme_of_usage3')}}</h3>
                <p class="mt-5">{{$t('explanation3')}} </p>
                <img src="@/assets/gif3.gif" class="hidden-xs-only" alt="" width="70%">
                <img src="@/assets/gif3.gif" class="hidden-sm-and-up" alt="" width="100%">
            </v-flex> 
        </v-layout>
        <v-layout>
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h3 class="mt-10" style="text-decoration:underline;">
                   <router-link to="/login">{{$t('login')}}</router-link>
                </h3>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<style scoped>
ul li{
    font-size: 108%;
    font-weight: bold;
    margin-bottom: 0.6%;
}
#reason li{
    font-weight: normal;
}
</style>