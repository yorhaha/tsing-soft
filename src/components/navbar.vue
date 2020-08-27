<template>
    <v-app-bar app clipped-left color="primary" dense dark>
      <v-btn class="ml-4" icon>
        <v-icon large>
          mdi-code-greater-than
        </v-icon>
      </v-btn>
      <v-toolbar-title class="mr-12 align-center" @click.stop="gotoindex">
        <v-btn text class="title">清软论坛</v-btn>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon href="/about"><v-icon>mdi-alert-circle-outline</v-icon></v-btn>

      
    </v-app-bar>
</template>

<script>
export default {
    name: "navbar",
    data() {
        return {
        }
    },
    methods: {
      gotoindex() {
        if (this.db.get("jwt") != null) {
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