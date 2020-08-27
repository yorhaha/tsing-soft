<template>
  <v-app id="about">
    <navbar></navbar>
    <v-main>
        <v-card
            class="mx-auto mt-10"
            max-width="400"
            outlined
        >
            <v-list-item three-line>
            <v-list-item-content>
                <v-list-item-title class="headline mb-1">沈澎博</v-list-item-title>
                <v-list-item-subtitle>Tsinghua University</v-list-item-subtitle>
                <v-list-item-subtitle>School of Software</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80" color="grey">
                <v-img 
                    src="https://avatars3.githubusercontent.com/u/42489990?s=460&u=90214f35df601ef82e0fadad14e1ce2d4b3bc4ce&v=4"
                >
                </v-img>
            </v-list-item-avatar>
            </v-list-item>

            <v-card-actions>
                <v-btn class="ml-auto mr-2" href="https://github.com/blueice-thu" target="_blank">Github</v-btn>
            </v-card-actions>
        </v-card>

    </v-main>
  </v-app>
</template>

<script>
import navbar from "./navbar.vue"

export default {
    components: {
        navbar,
    },
    created() {
    },
    data() {
    },
    methods: {
    }
}
</script>