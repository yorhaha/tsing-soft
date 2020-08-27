<template>
  <v-app id="posts">
    <v-navigation-drawer app clipped v-model="drawer">
        <v-card class="pa-md-4 mx-lg-auto" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                  <v-list-item-title class="headline mb-1">{{ this.$userinfo.nickname }}</v-list-item-title>
                  <v-divider class="my-3"></v-divider>
                  <v-list-item-subtitle class="my-1">ID：{{ this.$userinfo.id }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="my-1">用户名：{{ this.$userinfo.username }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="my-1">创建时间：{{ this.$userinfo.created.substr(0, 10) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
        </v-card>
        <v-card class="pa-md-4 mx-lg-auto" max-width="344" outlined>
          <v-list-item link @click="getallposts">
            <v-list-item-action><v-icon>mdi-forum</v-icon></v-list-item-action>
            <v-list-item-content><v-list-item-title>最新帖子</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item link @click="gotowrite">
            <v-list-item-action><v-icon>mdi-pen</v-icon></v-list-item-action>
            <v-list-item-content><v-list-item-title>发布帖子</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item link @click="getmyposts">
            <v-list-item-action><v-icon>mdi-note-multiple</v-icon></v-list-item-action>
            <v-list-item-content><v-list-item-title>我的帖子</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-card>
        
    </v-navigation-drawer>
    <navbar></navbar>

    <v-main>
      <v-container class="fill-height">
        <v-row>
          <v-col class="grow">
            <span class="mx-3 text-h6">{{ this.customearea }}的帖子</span>
            <v-container v-for="(post, index) in allposts" :key="index">
              <v-card color="white">
                <v-card-title class="headline">{{ post.title }}</v-card-title>
                <v-card-subtitle>
                  <a @click="getuserposts(post.userId, post.nickname)">
                    <span class="mr-3 text--grey">{{ post.nickname }}</span>
                  </a>
                  <span class="mr-3">{{formatDate(post.created)}}</span>
                  <span class="mr-3" v-show="post.created != post.updated">已编辑</span>
                </v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn v-show="post.mypost" @click="editpost(post)">编辑</v-btn>
                  <v-btn @click="commentpost(post)">评论</v-btn>
                  <v-btn @click="changeshow(post, index)">阅读</v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="post.showcontent">
                    <v-divider></v-divider>
                    <v-card-text>
                      <div class="markdown-body">
                        <VueMarkdown :source="post.content"></VueMarkdown>
                      </div>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-container>

            <v-container>
              <v-row justify="center" align="center">
                <v-spacer></v-spacer>
                  <v-btn @click="getmoreposts">
                      查看更多
                  </v-btn>
                <v-spacer></v-spacer>
              </v-row>
            </v-container>

          </v-col>
        </v-row>
      </v-container>

      <v-snackbar v-model="this.$route.params.autologinsucceed">
        自动登录成功
      </v-snackbar>

    </v-main>
  </v-app>
</template>

<script>
import navbar from "./navbar.vue"
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
import { formatDate } from '../common'
export default {
    components: {
        navbar,
        VueMarkdown
    },
    created() {
        console.log("posts page")
        this.allposts = this.$postlist
        this.$jwt = JSON.parse(localStorage.getItem('jwt')).jwt
        if (this.allposts === undefined) {
          let postStorage = JSON.parse(localStorage.getItem('postlist'))
            if (postStorage != null) {
                this.allposts = postStorage.postlist
                this.$userinfo = JSON.parse(localStorage.getItem('userinfo')).userinfo
                console.log("Read local storage succeed")
            }
            else {
                this.$router.push({
                    name: "index"
                })
            }
        }
        else {
          for (let i = 0; i < this.allposts.length; i++) {
            this.$set(this.allposts[i], "showcontent", false)
            this.$set(this.allposts[i], "mypost", (this.allposts[i].userId === this.$userinfo.id))
          }
          localStorage.setItem("postlist", JSON.stringify({
              "postlist": this.allposts,
          }));
          localStorage.setItem("userinfo", JSON.stringify({
              "userinfo": this.$userinfo,
          }));
          console.log("create storage")
          console.log("this.jwt: ", this.$jwt)
        }
        
        if (this.$jwt === undefined) {
          this.$logged = false
          console.log("logged === false")
        }
        else {
          this.$logged = true
        }
    },
    data() {
        return {
          drawer: null,
          allposts: [],
          page: 1,
          orderByReply: false,
          customuserid: 0,
          customearea: "广场"
        }
    },
    methods: {
      formatDate,
      changeshow(thepost, postindex) {
        Vue.set(this.allposts[postindex], "showcontent", !(thepost.showcontent))
      },
      gotowrite() {
        this.$router.push({
          name: "write"
        })
      },
      getmoreposts() {
        this.page += 1
        this.getnewposts(this.page, this.customuserid, true)
      },
      getallposts() {
        this.customearea = "广场"
        this.customuserid = 0
        this.getnewposts(1, 0, false)
      },
      getuserposts(userid, nickname) {
        this.customearea = nickname
        this.customuserid = userid
        this.getnewposts(1, userid, false)
      },
      getmyposts() {
        this.customearea = "我"
        this.customuserid = this.$userinfo.id
        this.getnewposts(1, this.$userinfo.id, false)
      },
      getnewposts(newpage=1, newuserid=0, more=false) {
        console.log("New action")
        this.$axios({
                method: "get",
                url: "http://simplebbs.iterator-traits.com/api/v1/post",
                headers: {
                    "Authorization": this.$jwt
                },
                params: {
                  "page": newpage,
                  "size": 10,
                  "userId": newuserid, 
                  "orderByReply": this.orderByReply
                }
            }).then(response => {
              let newposts = response.data.posts
              for (let i = 0; i < newposts.length; i++) {
                newposts[i].mypost = (newposts[i].userId === this.$userinfo.id)
              }
              if (more === true) {
                this.allposts = this.allposts.concat(response.data.posts)
              }
              else {
                this.page = 1
                this.allposts = response.data.posts
              }
              console.log(this.allposts)
            }).catch(error => console.log(error))
      },
      commentpost(thepost) {
        this.$router.push({
            name: "comment",
            params: {
                "thepost": thepost
            }
        })
      },
      editpost(thepost) {
        this.$router.push({
          name: "write", 
          params: {
              "thepost": thepost
          }
        })
      }
    }
}
</script>