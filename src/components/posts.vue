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
          <v-list-item link @click="refreshposts">
            <v-list-item-action><v-icon>mdi-forum</v-icon></v-list-item-action>
            <v-list-item-content><v-list-item-title>最新帖子</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item link>
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
            <v-container v-for="(post, index) in allposts" :key="index">
              <v-card color="white">
                <v-card-title class="headline">{{ post.title }}</v-card-title>
                <v-card-subtitle>{{ post.nickname }}</v-card-subtitle>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="changeshow(post, index)">more</v-btn>
                </v-card-actions>
                <v-expand-transition>
                  <div v-show="post.showcontent">
                    <v-divider></v-divider>
                    <v-card-text>
                      {{ post.content }}
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
    </v-main>
  </v-app>
</template>

<script>
import navbar from "./navbar.vue"
import Vue from 'vue'
export default {
    components: {
        navbar
    },
    created() {
        console.log("posts page")
        for (let i = 0; i < this.$postlist.length; i++) {
          this.$set(this.$postlist[i], "showcontent", false)
        }
        this.allposts = this.$postlist
    },
    data() {
        return {
          drawer: null,
          allposts: [],
          page: 1,
          orderByReply: false
        }
    },
    methods: {
      changeshow(thepost, postindex) {
        Vue.set(this.allposts[postindex], "showcontent", !(thepost.showcontent))
      },
      getmoreposts() {
        this.page += 1
        this.$axios({
                method: "get",
                url: "http://simplebbs.iterator-traits.com/api/v1/post",
                headers: {
                    "Authorization": this.$jwt
                },
                params: {
                  "page": this.page,
                  "size": 10,
                  "userId": "", 
                  "orderByReply": this.orderByReply
                }
            }).then(response => {
              this.allposts = this.allposts.concat(response.data.posts)
            }).catch(error => console.log(error))
      },
      refreshposts() {
        this.allposts = []
        this.$axios({
                method: "get",
                url: "http://simplebbs.iterator-traits.com/api/v1/post",
                headers: {
                    "Authorization": this.$jwt
                },
                params: {
                  "page": 1,
                  "size": 10,
                  "userId": "", 
                  "orderByReply": this.orderByReply
                }
            }).then(response => {
              this.allposts = response.data.posts
            }).catch(error => console.log(error))
      },
      getmyposts() {
        this.allposts = []
        this.$axios({
                method: "get",
                url: "http://simplebbs.iterator-traits.com/api/v1/post",
                headers: {
                    "Authorization": this.$jwt
                },
                params: {
                  "page": 1,
                  "size": 10,
                  "userId": this.$userinfo.id, 
                  "orderByReply": this.orderByReply
                }
            }).then(response => {
              this.allposts = response.data.posts
            }).catch(error => console.log(error))
      }
    }
}
</script>
<!--

            <h1>This is posts.vue</h1>
            <h1>{{this.$route.params.jwt}}</h1>
-->