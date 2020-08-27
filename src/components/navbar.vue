<template>
    <v-app-bar app clipped-left color="primary" dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-icon class="mx-4" large>
        mdi-youtube
      </v-icon>
      <v-toolbar-title class="mr-12 align-center" @click.stop="gotoindex">
        <span class="title">清软论坛</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon><v-icon>mdi-alert-circle-outline</v-icon></v-btn>
      <v-btn icon v-show="showexitbutton" class="mx-2" @click.stop="exitdialog = true">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>

      <v-dialog v-model="exitdialog" max-width="290">
        <v-card>
          <v-card-title class="headline">确认退出账号？</v-card-title>
          <v-card-text>
            将删去保存的登录状态
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" text @click="logout">
              确认
            </v-btn>
            <v-btn color="primary darken-1" text @click="exitdialog = false">
              取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
</template>

<script>
import Vue from 'vue'
export default {
    name: "navbar",
    data() {
        return {
          // showexitbutton: Vue.prototype.$logged,
          exitdialog: false,
        }
    },
    computed: {
      showexitbutton: function() {
        return Vue.prototype.$logged
      }
    },
    methods: {
      logout() {
        this.exitdialog = false
        localStorage.clear();
        Vue.prototype.$logged = false
        this.$router.push({
          name: "index"
        })
      },
      gotoindex() {
        if (this.$logged === true) {
          this.$router.push({
            name: "posts"
          })
        }
        else {
          this.$router.push({
            name: "index"
          })
        }
      }
    }
}
</script>