<template>
  <v-app id="comment">
    <navbar></navbar>
    <v-main>
        <v-card class="mx-auto" max-width="800">
            <v-card-title class="mt-2">
                <span class="mx-3 text-h5">{{thispost.title}}</span>
            </v-card-title>
            <v-card-subtitle>
                <span class="mx-3">{{thispost.nickname}}</span>
                <span class="mx-3">{{formatDate(this.postdetail.created)}}</span>
            </v-card-subtitle>
            <v-divider class="mb-2"></v-divider>

            <v-card-text>
                <div class="markdown-body mx-3">
                    <VueMarkdown :source="thispost.content"></VueMarkdown>
                </div>
                <v-row>
                    <v-spacer></v-spacer>
                    <v-btn class="mx-2" @click="onlyseeposter">只看楼主</v-btn>
                    <v-btn class="mx-2" @click="replydialog = true">评论</v-btn>
                </v-row>
            </v-card-text>
            
        </v-card>

        <!-- Reply a reply in post -->
        <v-card class="mx-auto my-2" max-width="800" outlined v-for="(reply, index) in this.allreply" :key="reply.id">
            <v-list-item>
                <v-list-item-content>
                    <v-row class="mb-1 px-4" justify="center" align="center">
                        <a class="mr-4 text-decoration-none">{{ reply.nickname }}</a>
                        <span class="mr-4">回复</span>
                        <a v-if="reply.replyId == 0" class="mr-4 text-decoration-none">{{ thispost.nickname }}</a>
                        <a v-else class="mr-4 text-decoration-none">{{ getreplytarget(reply) }}</a>
                        <div class="text-caption grey--text">{{ formatDate(reply.created) }}</div>
                        <v-spacer></v-spacer>
                        <div class="text-caption">{{index + 1}}楼</div>
                    </v-row>
                    <div class="markdown-body mx-1">
                        <VueMarkdown :source="reply.content"></VueMarkdown>
                        <v-row>
                            <v-spacer></v-spacer>
                            <v-btn class="mx-6" @click="replyareply(reply)">评论</v-btn>
                        </v-row>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-card>

        <v-dialog v-model="replydialog" max-width="700">
            <v-card>
                <v-card-title class="headline">评论{{this.replytargetname}}</v-card-title>
                <v-card-text>
                    <v-textarea solo no-resize clearable height="300" 
                        label="输入评论内容……（支持Markdown语法）" v-model="replycontent"
                        :rules="replyrules" counter maxlength="3000" hint="最多3000个字符">
                    </v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="light" class="mb-2 mx-4" @click="replydialog = false">取消</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" class="mb-2 mx-4" @click="submitreply">确认</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-main>
  </v-app>
</template>

<script>
import navbar from "./navbar.vue"
import VueMarkdown from 'vue-markdown'
// import Vue from 'vue'
export default {
    components: {
        navbar,
        VueMarkdown
    },
    created() {
        console.log("comment page")
        this.thispost = this.$route.params.thepost
        // Read LocalStorage
        if (this.thispost === undefined) {
            let postStorage = JSON.parse(localStorage.getItem('thispost'))
            if (postStorage != null) {
                this.thispost = postStorage.thispost
            }
            else {
                this.$router.push({
                    name: "index"
                })
            }
            this.$jwt = JSON.parse(localStorage.getItem('jwt')).jwt
        }
        else {
            localStorage.setItem("thispost", JSON.stringify({
                "thispost": this.thispost,
            }));
        }
        console.log("this.$jwt: ", this.$jwt)

        //Get post detail
        this.$axios({
            method: "get",
            url: `http://simplebbs.iterator-traits.com/api/v1/post/${this.thispost.id}`,
            headers: {
                "Authorization": this.$jwt
            }
        }).then(response => {
            this.postdetail = response.data
            this.allreply = this.postdetail.reply
        })
    },
    data() {
        return {
            thispost: this.$route.params.thepost,
            postdetail: {},
            replydialog: false,
            replycontent: "",
            replyrules: [v => (v.length <= 3000 && v.length > 0) || 'Max 3000 characters'],
            allreply: [],
            onlyposter: false,
            replytarget: 0,
            replytargetname: "楼主"
        }
    },
    methods: {
        submitreply() {
            this.replydialog = false
            console.log("Reply target: ", this.replytarget)
            this.$axios({
                method: "post", 
                url: `http://simplebbs.iterator-traits.com/api/v1/post/${this.thispost.id}/reply`,
                headers: {
                    "Authorization": this.$jwt
                },
                data: JSON.stringify({
                    "content": this.replycontent,
                    "replyId": this.replytarget
                })
            }).then(response => {
                this.replytarget = 0
                this.replytargetname = "楼主"
                if (response.data.message === "ok") {
                    this.$router.go(0);
                }
            })
        },
        getreplytarget(reply) {
            let replyid = reply.replyId
            for (let i = 0; i < this.allreply.length; i++) {
                if (this.allreply[i].id === replyid) {
                    return this.allreply[i].nickname
                }
            }
            return "Wrong!"
        },
        onlyseeposter() {
            if (this.onlyposter === false){
                this.allreply = []
                for (let i = 0; i < this.postdetail.reply.length; i++) {
                    if (this.postdetail.reply[i].userId === this.postdetail.userId) {
                        this.allreply.push(this.postdetail.reply[i])
                    }
                }
                this.onlyposter = true
            }
            else {
                this.allreply = this.postdetail.reply
                this.onlyposter = false
            }
        },
        replyareply(targetreply) {
            this.replytarget = targetreply.id
            this.replytargetname = targetreply.nickname
            this.replydialog = true
        }
    }
}
</script>