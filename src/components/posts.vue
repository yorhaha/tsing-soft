<template>
  <v-app id="posts">
    <v-navigation-drawer app clipped v-model="drawer">
        <v-card class="pa-md-4 mx-lg-auto" max-width="344" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                  <v-list-item-title class="headline mb-1">{{ this.userinfo.nickname }}</v-list-item-title>
                  <v-divider class="my-3"></v-divider>
                  <v-list-item-subtitle class="my-1">ID：{{ this.userinfo.id }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="my-1">用户名：{{ this.userinfo.username }}</v-list-item-subtitle>
                  <v-list-item-subtitle class="my-1">创建时间：{{ this.userinfo.created.substr(0, 10) }}</v-list-item-subtitle>
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
          <v-list-item link @click="getcollect">
            <v-list-item-action><v-icon>mdi-star</v-icon></v-list-item-action>
            <v-list-item-content><v-list-item-title>我的收藏</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item link @click="gethistory">
            <v-list-item-action><v-icon>mdi-history</v-icon></v-list-item-action>
            <v-list-item-content><v-list-item-title>浏览历史</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="pa-md-4 mx-lg-auto" max-width="344" outlined>
          <v-list-item link @click.stop="showexitdialog">
            <v-list-item-action><v-icon>mdi-logout-variant</v-icon></v-list-item-action>
            <v-list-item-content><v-list-item-title>退出登录</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-card>
        
    </v-navigation-drawer>
    <navbar></navbar>

    <v-main>
      <v-container class="fill-height">
        <v-row>
          <v-col class="grow">
            <v-row class="mx-3">
              <span class="text-h6">{{ this.customearea }}的帖子</span>
              <v-spacer v-show="customuserid >= 0"></v-spacer>
              <v-btn v-show="customuserid >= 0" @click="changeorder">
                按
                <span v-if="orderByReply === false">发帖时间</span>
                <span v-else>回复时间</span>
                排序
              </v-btn>
            </v-row>
            
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
              <v-card color="white" v-if="this.allposts.length === 0" class="my-5">
                <v-card-title class="headline"><span class="mx-auto">（空）</span></v-card-title>
              </v-card>
              <v-row justify="center" align="center">
                <v-spacer></v-spacer>
                  <v-btn @click="getmoreposts" v-if="(this.allposts.length != 0) && (this.customuserid >= 0)">
                      查看更多
                  </v-btn>
                  <v-btn @click="cleanhistory" v-if="(this.customearea === '看过')">
                      清除历史
                  </v-btn>
                <v-spacer></v-spacer>
              </v-row>
            </v-container>

          </v-col>
        </v-row>
      </v-container>

      <v-snackbar v-model="this.autologinsucceed">
        自动登录成功
      </v-snackbar>

      <v-dialog v-model="this.exitdialog" max-width="350">
        <v-card>
          <v-card-title class="headline">确认退出账号？</v-card-title>
          <v-card-text>
            将清除本地的登录状态、收藏、历史等数据！
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

    </v-main>
  </v-app>
</template>

<script>
import navbar from "./navbar.vue"
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
export default {
    components: {
        navbar,
        VueMarkdown
    },
    created() {
        // console.log("posts page")
        this.$jwt = this.db.get("jwt")
        if (this.$jwt === undefined) {
          this.$router.push({
            name: "index"
          })
        }
        let sourceList = ["customearea", "postorder", "page", "customuserid"]
        for (let i = 0; i < sourceList.length; i++) {
          let tmp = this.db.get(sourceList[i])
          if (tmp != null) {
            this[sourceList[i]] = tmp
          }
        }
        this.userinfo = this.db.get("userinfo")
        this.allposts = this.db.get("postlist")
        this.autologinsucceed = this.$route.params.autologinsucceed
        if (this.allposts[0].mypost === undefined) {
          for (let i = 0; i < this.allposts.length; i++) {
            this.$set(this.allposts[i], "mypost", (this.allposts[i].userId === this.userinfo.id))
          }
          this.db.save("postlist", this.allposts)
        }
    },
    beforeDestroy() {
      this.db.save("postlist", this.allposts)
      this.db.save("customearea", this.customearea)
      this.db.save("postorder", this.orderByReply)
      this.db.save("page", this.page)
      this.db.save("customuserid", this.customuserid)
    },
    data() {
        return {
          userinfo: {},
          drawer: null,
          allposts: [],
          page: 1,
          orderByReply: false,
          customuserid: 0,
          customearea: "广场",
          autologinsucceed: false,
          exitdialog: false,
        }
    },
    mounted() {
      setTimeout(() => {
          let imgs = document.querySelectorAll(".markdown-body img")
          for (let i = 0; i < imgs.length; i++) {
              // console.log(imgs[i].style)
              imgs[i].style.maxWidth = "300px"
              imgs[i].style.maxHeight = "300px"
              imgs[i]._bigged = false
              imgs[i].addEventListener('click', function(){
                if (imgs[i]._bigged === true) {
                  imgs[i]._bigged = false
                  imgs[i].style.maxWidth = "300px"
                  imgs[i].style.maxHeight = "300px"
                }
                else {
                  imgs[i]._bigged = true
                  imgs[i].style.maxWidth = "100%"
                  imgs[i].style.maxHeight = "100%"
                }
                // console.log("Click")
              })
          }
          // console.log("Find imgs ", imgs.length)
      }, 300)
    },
    methods: {
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
        this.customuserid = this.userinfo.id
        this.getnewposts(1, this.userinfo.id, false)
      },
      getnewposts(newpage=1, newuserid=0, more=false) {
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
                newposts[i].mypost = (newposts[i].userId === this.userinfo.id)
              }
              if (more === true) {
                this.allposts = this.allposts.concat(response.data.posts)
              }
              else {
                this.page = 1
                this.allposts = response.data.posts
              }
            }).catch(error => console.log(error))
      },
      changeorder() {
        this.orderByReply = !(this.orderByReply)
        this.getnewposts(1, this.customuserid)
      },
      commentpost(thispost) {
        this.db.save("thispost", thispost)
        let customhistory = this.db.get("historyposts")
        if (customhistory === null) {
          customhistory = []
        }
        for (let i = 0; i < customhistory.length; i++) {
          if (thispost.id === customhistory[i].id) {
            customhistory.splice(i, 1)
            break
          }
        }
        customhistory.push(thispost)
        this.db.save("historyposts", customhistory)
        this.$router.push({
            name: "comment"
        })
      },
      editpost(thepost) {
        this.$router.push({
          name: "write", 
          params: {
              "thepost": thepost
          }
        })
      },
      showexitdialog() {
        this.exitdialog = true
      },
      logout() {
        this.exitdialog = false
        this.db.clear()
        this.$router.push({
          name: "index"
        })
      },
      getcollect() {
        this.customearea = "收藏"
        this.allposts = this.db.get("collectposts")
        if (this.allposts === null) {
          this.allposts = []
        }
        else {
          this.allposts = this.allposts.reverse()
        }
        this.customuserid = -1
      },
      gethistory() {
        this.customearea = "看过"
        this.allposts = this.db.get("historyposts")
        if (this.allposts === null) {
          this.allposts = []
        }
        else {
          this.allposts = this.allposts.reverse()
        }
        this.customuserid = -1
      },
      cleanhistory() {
        this.allposts = []
        this.db.remove("historyposts")
      }
    }
}
</script>