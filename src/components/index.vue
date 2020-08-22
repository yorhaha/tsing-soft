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
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">登录</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="testApi">测试</v-btn>
              </v-card-actions>
              <v-alert type="success">{{ testResult }}</v-alert>
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
  import navbar from "./navbar"
  export default {
    props: {
      source: String,
      info: {},
    },
    components: {
      navbar
    },
    data() {
      return {
        testResult: "",
        submitResult: "",
        username: "",
        password: "",
        wrongPassword: false,
        status: 0,
        jwt: ""
      }
    },
    methods: {
      testApi() {
        this.$axios({
          method: "get",
          url: "/api/v1/hello"
        }).then(response => (this.testResult = response.data))
      },
      login() {
        this.$axios({
          method: "patch",
          url: "/api/v1/login",
          data: JSON.stringify({
            "username": this.username,
            "password": this.password
          })
        }).then(response => (
          this.submitResult = response.data,
          this.status = response.status
        ))
        if (this.status === 200) {
          this.jwt = this.submitResult.jwt
          this.userinfo = {
            "nickname": this.submitResult.nickname,
            "userId": this.submitResult.userId,
            "username": this.submitResult.username
          }
          this.wrongPassword = false
          console.log("Login succeed!")
          this.$router.push({
            name: "posts",
            params: {
              "jwt": this.jwt,
              "userinfo": this.userinfo
            }
          })
        }
        else {
          this.wrongPassword = true
        }
        console.log(this.submitResult)

      }
    }
  }
</script>