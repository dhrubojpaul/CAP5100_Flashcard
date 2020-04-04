var setCountdown = function(component){
    var countupto = new Date().getTime() + component.duration*1000;
    var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countupto - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        component.countdown = minutes +"m " + seconds + "s ";
        if (distance < 0) {
            clearInterval(x);
            component.countdown = "Time Over";
            component.$emit('over');
        }
    }, 1000);
}

var play = function(id){
    document.getElementById(id).play();
}

Vue.component("list", {
    template: `
    <v-container>
        <v-card>
            <v-toolbar color="indigo" dark >
                <v-toolbar-title>{{countdown}}</v-toolbar-title>
            </v-toolbar>

            <v-card class="pa-3" flat tile height=70vh style="overflow:scroll" v-if="countdown != 'Time Over'">
                <v-row v-for="word in asset">
                    <v-col cols=12 md=6 sm=6>
                        <v-card class="pa-2" height=100px @click="play(word.id + 'chn')">
                            <p class="font-weight-bold display-1">{{word.chn}}</p>
                            <!--<p class="font-weight-bold heading">{{word.pinyin}}</p>-->
                            <audio :src="word.chnaudio" :id="word.id+'chn'"></audio>
                        </v-card>
                    </v-col>
                    <v-col cols=12 md=6 sm=6>
                        <v-card class="pa-2" height=100px @click="play(word.id + 'eng')">
                            <img :src="word.image" height=54px></img>
                            <p class="font-weight-bold heading">{{word.eng}}</p>
                            <audio :src="word.engaudio" :id="word.id+'eng'"></audio>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-card>
    </v-container>
    `,
    data(){
        return{
            duration:180,
            countdown: undefined,
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
        }
    },
    methods: {
        play: function(id){
            play(id);
        },
    },
    mounted(){
        setCountdown(this);
    },
});

var vue = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
});