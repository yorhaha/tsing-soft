<template>
  <v-app id="index">
    <navbar></navbar>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>登录</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="用户名"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="username"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="密码"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    hint="密码至少6位"
                    v-model="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-checkbox v-model="autologin" label="下次自动登录" class="mr-4"></v-checkbox>
                <v-btn color="primary" @click.stop="login" id="login-button">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-alert type="error" v-show="wrongPassword" 
          transition="scroll-y-reverse-transition" class="mx-auto"
          width="50%">
          密码错误！
        </v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import navbar from "./navbar.vue"
  import Vue from 'vue'
  export default {
    created() {
      Vue.prototype.$logged = false
      let storage = JSON.parse(localStorage.getItem('localstorage'))
      if (storage != null) {
        console.log("LocalStorage: ", storage)
        Vue.prototype.$jwt = storage.jwt
        this.loginsucceed()
      }
      console.log("LocalStorage clean")
    },
    components: {
      navbar
    },
    data() {
      return {
        submitResult: "",
        username: "",
        password: "",
        wrongPassword: false,
        status: 0,
        autologin: true
      }
    },
    methods: {
      login() {
        this.$axios({
          method: "patch",
          url: "http://simplebbs.iterator-traits.com/api/v1/login",
          data: JSON.stringify({
            "username": this.username,
            "password": this.password
          })
        }).then(response => {
          this.submitResult = response.data,
          this.status = response.status

          if (this.status === 200) {
            Vue.prototype.$jwt = this.submitResult.jwt
            this.wrongPassword = false

            localStorage.clear();
            if (this.autologin === true) {
              localStorage.setItem("localstorage", JSON.stringify({
                "jwt": this.$jwt,
              }));
            }

            console.log("Login succeed!")
            this.loginsucceed()
          }
          else {
            this.wrongPassword = true
            console.log("Login failed!", this.status)
          }
        }).catch(error => console.log(error))
      },
      loginsucceed() {
        Vue.prototype.$logged = true
        // Get user info for 'posts.vue'
        this.$axios({
            method: "get",
            url: "http://simplebbs.iterator-traits.com/api/v1/user",
            headers: {
                "Authorization": this.$jwt
            }
        }).then(response => {
            console.log(response)
            Vue.prototype.$userinfo = response.data
            console.log("Get user info")

            // Get posts for 'posts.vue'
            this.$axios({
                method: "get",
                url: "http://simplebbs.iterator-traits.com/api/v1/post",
                headers: {
                    "Authorization": this.$jwt
                },
                params: {
                  "page": 1,
                  "size": 10,
                  "userId": "", 
                  "orderByReply": false
                }
            }).then(response => {
                Vue.prototype.$postlist = response.data.posts
                
                console.log("Get posts")

                this.$router.push({
                  name: "posts"
                })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
      }
    }
  }
</script>