<template>
    <v-container>
        <v-layout class="mb-5">
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h1>1.FREETALKについて</h1>
                <v-divider></v-divider>
                <p class="mt-10 title" style="font-weight:bold;">FREETALKは、普段から英語でコミュニケーションする機会がない人たち同士が集まって英会話をすることで、英語でのコミュニケーション力を"無料"で養おうというサービスです。</p>
                <p class="mt-10">英語学習について以下お悩みを抱いたことがある方はぜひ使用方法を参考の上、英会話力向上に役立ててください。</p>
                <p>・「英会話教室に通いたいけど、高額な金額を支払う余裕のないサラリーマンや学生の方」</p>
                <p>・「英単語帳などでインプットしたから出来る限り多く英語の知識をアウトプットしたい方」</p>
                <p>・「英語を教えることで日本人の友人を作りたい外国人の方」</p>
                <p>・「英語の先生として経験を積みたい先生見習いの方」</p>
                <p class="mt-10" style="text-decoration:underline; font-weight:bold;">
                   <router-link to="/login">ゲストユーザーとして登録なしでご気軽にログインができますので、まずはそちらからお試しください。</router-link>
                </p>
            </v-flex>
        </v-layout>
        <v-layout class="mt-15">
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h1>2.基本的な使い方</h1>
                <v-divider></v-divider>
                <h3 class="mt-10">■英会話教室を投稿してみよう！</h3>
                <p class="mt-5">メニューの「FREETALKを投稿」にてお好みの英会話教室の情報をフォームに入力し、投稿できます。投稿した時点でメンバー募集が行われております。</p>
                <img src="@/assets/gif1.gif" class="hidden-xs-only" alt="" width="70%">
                <img src="@/assets/gif1.gif" class="hidden-sm-and-up" alt="" width="100%">
                <h3 class="mt-10">■英会話教室に参加してみよう！</h3>
                <p class="mt-5">詳細画面下部の「参加する」ボタンからその英会話教室へ参加登録ができます。左側の「出席者PickUp」に参加予定者一覧が表示されています。</p>
                <img src="@/assets/gif2.gif" class="hidden-xs-only" alt="" width="70%">
                <img src="@/assets/gif2.gif" class="hidden-sm-and-up" alt="" width="100%">
                <h3 class="mt-10">■ユーザー情報を確認しよう！</h3>
                <p class="mt-5">参加者や開催者などのユーザーアイコンをクリックすることで、ユーザープロフィール画面へ遷移できます。そのユーザーへ高評価できたり、コメントを投稿できます。<br>
                ユーザーの評価数や寄せられているコメント内容を確認することで、そのFREETALKへ参加する判断材料にしていただければと思います。</p>
                <img src="@/assets/gif3.gif" class="hidden-xs-only" alt="" width="70%">
                <img src="@/assets/gif3.gif" class="hidden-sm-and-up" alt="" width="100%">
            </v-flex>
        </v-layout>
        <v-layout class="mt-15">
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h1>3.実装した機能</h1>
                <v-divider></v-divider>
                <ul class="mt-10">
                    <li>CRUD機能</li>
                    <li>ユーザー登録</li>
                    <li>ログイン／ログアウト</li>
                    <li>ゲストログイン</li>
                    <li>Googleアカウントユーザー登録／ログイン</li>
                    <li>出席者登録／出席者一覧表示</li>
                    <li>プロフィール編集</li>
                    <li>プロフィール画像のデフォルト設定／変更</li>
                    <li>パスワード変更</li>
                    <li>メールアドレス変更</li>
                    <li>バリデーション</li>
                    <li>画像アップロード</li>
                    <li>いいね（お気に入り）／いいね一覧表示</li>
                    <li>投稿一覧表示</li>
                    <li>ユーザーフォロー</li>
                    <li>ページネーション</li>
                    <li>リアルタイム検索</li>
                    <li>コメント投稿とそのレスポンス</li>
                </ul>
            </v-flex>
        </v-layout>
        <v-layout  class="mt-15">
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h1>4.使用技術</h1>
                <v-divider></v-divider>
                <ul class="mt-10">
                    <li>フロント：Vue.js／Vuetify</li>
                    <li>バックエンド：Firebase</li>
                    <li>開発環境：VueCLI</li>
                    <li>ソース管理：Git／GitHub</li>
                </ul>
                <p class="mt-5">※ Firebaseの内、本サービスでは以下を使用しております。</p>
                <ul>
                    <li>Hosting</li>
                    <li>Authentication（Googleアカウント）</li>
                    <li>Realtime Database</li>
                    <li>Strage</li>
                </ul>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm11 md10 offset-sm1 offset-md1>
                <h3 class="mt-10" style="text-decoration:underline;">
                   <router-link to="/login">ログイン画面へ</router-link>
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
</style>