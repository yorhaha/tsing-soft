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
    beforeMount() {
      Vue.prototype.$jwt = this.db.get("jwt")
      if (this.$jwt != null) {
        this.autologinsucceed = true
        this.loginsucceed()
      }
      else {
        this.db.clear()
      }
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
        autologin: true,
        autologinsucceed: false
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

            this.db.clear()
            if (this.autologin === true) {
              this.db.save("jwt", this.$jwt)
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
        // Get user info for 'posts.vue'
        this.$axios({
            method: "get",
            url: "http://simplebbs.iterator-traits.com/api/v1/user",
            headers: {
                "Authorization": this.$jwt
            }
        }).then(response => {
            this.db.save("userinfo", response.data)

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
                // Vue.prototype.$postlist = response.data.posts
                this.db.save("postlist", response.data.posts)
                
                console.log("Get posts")

                this.$router.push({
                  name: "posts",
                  params: {
                    "autologinsucceed": this.autologinsucceed
                  }
                })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
      }
    }
  }
</script>