<template>
    <v-app>
        <navbar></navbar>
        <v-main>
            <h1>This is posts.vue</h1>
        </v-main>
    </v-app>
</template>

<script>
import navbar from "./navbar"
export default {
    components: {
        navbar
    }
}
</script>