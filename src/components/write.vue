<template>
  <v-app id="write">
    <navbar></navbar>
    <v-main>
        <v-container class="px-3" grow>
            <v-chip class="my-2" outlined label>标题</v-chip>
            <v-text-field solo no-resize clearable 
                label="输入标题……" v-model="title"
                :rules="titlerules" counter maxlength="50" hint="最多50个字符">
            </v-text-field>
            <v-chip class="mb-2" outlined label auto-grow>正文</v-chip>
            <v-textarea solo no-resize clearable height="300" 
                label="输入帖子内容……（支持Markdown语法）" v-model="content"
                :rules="contentrules" counter maxlength="3000" hint="最多1000个字符">
            </v-textarea>
            <v-row align="center">
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-2" @click.stop="releasepost">发布</v-btn>
            </v-row>
        </v-container>

        <v-dialog v-model="releasedialog" max-width="290">
            <v-card>
                <v-card-title class="headline">发布成功！</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary darken-1" text @click="gotopost">
                    确认
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="emptydialog" max-width="290">
            <v-card>
                <v-card-title class="headline">标题或内容为空！</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary darken-1" text @click="emptydialog = false">
                    确认
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-main>
  </v-app>
</template>

<script>
import navbar from "./navbar.vue"

export default {
    components: {
        navbar
    },
    created() {
        // if (this.$logged === false || this.$logged === undefined) {
        //     this.$router.push({
        //         name: "index"
        //     })
        // }
    },
    data() {
        return {
            "title": "", 
            "content": "",
            "releasedialog": false,
            "emptydialog": false,
            "newpostid": 0,
            "titlerules": [v => v.length <= 50 || 'Max 25 characters'],
            "contentrules": [v => v.length <= 3000 || 'Max 1000 characters'],
        }
    },
    methods: {
        releasepost() {
            console.log("release post")
            if (this.title === "" || this.content === "") {
                this.emptydialog = true
            }
            else {
                this.$axios({
                    method: "post",
                    url: "http://simplebbs.iterator-traits.com/api/v1/post",
                    headers: {
                        "Authorization": this.$jwt
                    },
                    data: JSON.stringify({
                        "title": this.title,
                        "content": this.content
                    })
                }).then(response => {
                    if (response.data.message === "ok") {
                        this.releasedialog = true
                        this.newpostid = response.data.postId
                    }
                }).catch(error => console.log(error))
                console.log("release success")
            }
        },
        gotopost() {
            this.releasedialog = false
        }
    }
}
</script>