var play = function(id){
    document.getElementById(id).play();
}


Vue.component("cards", {
    template: `
    <v-container>
    <div class="text-center">
        <v-icon x-small :color="n==index+1?'#676767':'#EDEDED'" v-for="n in 10" class="ma-3">mdi-circle</v-icon>
    </div>
    <v-card height=60vh @click="chnSide = !chnSide">
        <v-container fill-height >
            <v-row justify="center" align="center">
                <div align=center v-if="chnSide">
                    <p class="font-weight-black display-3">{{word.chn}}</p>
                    <p class="font-weight-black display-3">{{word.pinyin}}</p>
                    <!--<v-btn icon @click="play('chn')"><v-icon>mdi-play</v-icon></v-btn>-->
                    <audio autoplay :src="word.chnaudio" id="chn"></audio>
                </div>
                <div align=center v-else>
                    <img :src="word.image" height=100px></img>
                    <p class="font-weight-black display-3">{{word.eng}}</p>
                    <!--<v-btn icon @click="play('eng')"><v-icon>mdi-play</v-icon></v-btn>-->
                    <audio autoplay :src="word.engaudio" id="eng"></audio>
                </div>
            </v-row>
        </v-container>
        
    </v-card>

    

    <v-row>
        <v-col cols=12 md=6 sm=6><v-btn block @click="previous">Previous</v-btn></v-col>
        <v-col cols=12 md=6 sm=6><v-btn block @click="next">Next</v-btn></v-col>
    </v-row>
    
    </v-container>
    `,
    data(){
        return{
            asset: [
                {id:1, chn:"苹果", eng:"apple", pinyin: "píng guǒ", chnaudio: "./assets/apple_chnaudio.mp3", engaudio: "./assets/apple_engaudio.mp3", image: "./assets/apple_photo.jpg"},
                {id:2, chn:"香蕉", eng:"banana", pinyin: "xiāng jiāo", chnaudio: "./assets/banana_chnaudio.mp3", engaudio: "./assets/banana_engaudio.mp3", image: "./assets/banana_photo.jpg"},
                {id:3, chn:"橙子", eng:"orange", pinyin: "chéng zǐ", chnaudio: "./assets/orange_chnaudio.mp3", engaudio: "./assets/orange_engaudio.mp3", image: "./assets/orange_photo.jpg"},
                {id:4, chn:"草莓", eng:"strawberry", pinyin: "cǎo méi", chnaudio: "./assets/strawberry_chnaudio.mp3", engaudio: "./assets/strawberry_engaudio.mp3", image: "./assets/strawberry_photo.jpg"},
                {id:5, chn:"西瓜", eng:"watermelon", pinyin: "xī guā", chnaudio: "./assets/watermelon_chnaudio.mp3", engaudio: "./assets/watermelon_engaudio.mp3", image: "./assets/watermelon_photo.jpg"},
                {id:6, chn:"土豆", eng:"potato", pinyin: "tǔ dòu", chnaudio: "./assets/potato_chnaudio.mp3", engaudio: "./assets/potato_engaudio.mp3", image: "./assets/potato_photo.jpg"},
                {id:7, chn:"黄瓜", eng:"cucumber", pinyin: "huáng guā", chnaudio: "./assets/cucumber_chnaudio.mp3", engaudio: "./assets/cucumber_engaudio.mp3", image: "./assets/cucumber_photo.jpg"},
                {id:8, chn:"菜花", eng:"cauliflower", pinyin: "cài huā", chnaudio: "./assets/cauliflower_chnaudio.mp3", engaudio: "./assets/cauliflower_engaudio.mp3", image: "./assets/cauliflower_photo.jpg"},
                {id:9, chn:"生菜", eng:"lettuce", pinyin: "shēng cài", chnaudio: "./assets/lettuce_chnaudio.mp3", engaudio: "./assets/lettuce_engaudio.mp3", image: "./assets/lettuce_photo.jpg"},
                {id:10, chn:"洋葱", eng:"onion", pinyin: "yáng cōng", chnaudio: "./assets/onion_chnaudio.mp3", engaudio: "./assets/onion_engaudio.mp3", image: "./assets/onion_photo.jpg"},
            ],
            word:{},
            index: 0,
            chnSide: true
        }
    },
    methods: {
        play: function(id){
            play(id);
        },
        next: function(){
            this.chnSide=true;
            this.index = this.index<9 ? this.index+1 : 0;
            this.word = this.asset[this.index];
        },
        previous: function(){
            this.chnSide=true;
            this.index = this.index==0 ? 9 : this.index-1;
            this.word = this.asset[this.index];
        }
    },
    mounted(){
        this.word = this.asset[this.index];

        this._keyListener = function(e) {
            switch (e.keyCode) {
                case 32:
                    this.chnSide = !this.chnSide;
                    break;
                case 37:
                    this.previous();
                    break;
                case 39:
                    this.next();
                    break;
            }
        };
        document.addEventListener('keydown', this._keyListener.bind(this));
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this._keyListener);
    }
});

var vue = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
});