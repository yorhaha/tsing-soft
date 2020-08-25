<template>
    <v-app-bar app clipped-left color="primary" dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-icon class="mx-4" large>
        mdi-youtube
      </v-icon>
      <v-toolbar-title class="mr-12 align-center">
        <span class="title">清软论坛</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-row
        align="center"
        style="max-width: 650px"
      >
      <v-container>
          <v-row align="center" justify="center">
                <v-text-field
                    :append-icon-cb="() => {}"
                    placeholder="Search..."
                    single-line
                    append-icon="mdi-magnify"
                    color="white"
                    hide-details
                >
                </v-text-field>
                <v-btn icon>
                    <v-icon>mdi-alert-circle-outline</v-icon>
                </v-btn>
        </v-row>
          
      </v-container>
        
      </v-row>
    </v-app-bar>
</template>

<script>
export default {
    name: "navbar",
    data() {
        return {
        }
    }
}
</script>