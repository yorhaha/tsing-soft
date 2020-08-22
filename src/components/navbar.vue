<template>
    <div id="nav-bar">
        <v-app-bar color="primary" dense dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>清软论坛</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
            <v-icon>mdi-alert-circle-outline</v-icon>
        </v-btn>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name: "navbar",
}
</script>