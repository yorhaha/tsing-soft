<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
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
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="密码"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    hint="密码至少6位"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="testApi">登录</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="testApi">测试</v-btn>
              </v-card-actions>
              <v-alert type="success">{{ testResult }}</v-alert>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
      info: {},
    },
    data() {
      return {
        testResult: ""
      }
    },
    methods: {
      testApi() {
        this.$axios.get('/api/v1/hello').then(response => (this.testResult = response.data))
        console.log(this.testResult)
      }
    }
  }
</script>