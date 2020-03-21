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

var getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

Vue.component("quiz", {
    props:['vocab', 'stage'],
    template: `
    <v-card-text>
        <h1>{{countdown}}</h1><br/>
        <v-simple-table dense>
            <thead></thead>
            <tbody>
                <v-radio-group v-model="values.selected">
                    <tr v-for="n in 4" :key="n">
                        <td><v-radio :value="n"></v-radio></td>
                        <td >Word</td>
                        <td><img src="./assets/apple_photo.png" height=54px></img></td>
                        <td><audio controls src="./assets/apple_chnaudio.mp3"></audio></td>
                    </tr>
                </v-radio-group>
            </tbody>
        </v-simple-table>
        <v-btn block v-if="values.role==2 && values.selected">Assist</v-btn>
        <v-btn block v-if="values.role==1 && values.selected">Submit</v-btn>
        <v-btn block v-if="values.isSubmitted && values.selected">Next</v-btn>
    </v-card-text>
    `,
    data(){
        return{
            duration:600,
            countdown: undefined,
            values: {
                selected: undefined,
                role: undefined, //submitter 1 hinter 2
                isSubmitted: undefined
            }
        }
    },
    methods: {
        
    },
    mounted(){
        setCountdown(this);
    },
});

var vue = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        asset: [
            {id:1, chn:"苹果", eng:"apple", chnaudio: "./assets/apple_chnaudio.mp3", engaudio: "./assets/apple_engaudio.mp3", image: "./assets/apple_photo.png"},
            {id:2, chn:"香蕉", eng:"banana", chnaudio: "./assets/banana_chnaudio.mp3", engaudio: "./assets/banana_engaudio.mp3", image: "./assets/banana_photo.png"},
            {id:3, chn:"橙子", eng:"orange", chnaudio: "./assets/orange_chnaudio.mp3", engaudio: "./assets/orange_engaudio.mp3", image: "./assets/orange_photo.png"},
            {id:4, chn:"草莓", eng:"strawberry", chnaudio: "./assets/strawberry_chnaudio.mp3", engaudio: "./assets/strawberry_engaudio.mp3", image: "./assets/strawberry_photo.png"},
            {id:5, chn:"西瓜", eng:"watermelon", chnaudio: "./assets/watermelon_chnaudio.mp3", engaudio: "./assets/watermelon_engaudio.mp3", image: "./assets/watermelon_photo.png"},
            {id:6, chn:"土豆", eng:"potato", chnaudio: "./assets/potato_chnaudio.mp3", engaudio: "./assets/potato_engaudio.mp3", image: "./assets/potato_photo.png"},
            {id:7, chn:"黄瓜", eng:"cucumber", chnaudio: "./assets/cucumber_chnaudio.mp3", engaudio: "./assets/cucumber_engaudio.mp3", image: "./assets/cucumber_photo.png"},
            {id:8, chn:"菜花", eng:"cauliflower", chnaudio: "./assets/cauliflower_chnaudio.mp3", engaudio: "./assets/cauliflower_engaudio.mp3", image: "./assets/cauliflower_photo.png"},
            {id:9, chn:"生菜", eng:"lettuce", chnaudio: "./assets/lettuce_chnaudio.mp3", engaudio: "./assets/lettuce_engaudio.mp3", image: "./assets/lettuce_photo.png"},
            {id:10, chn:"洋葱", eng:"onion", chnaudio: "./assets/onion_chnaudio.mp3", engaudio: "./assets/onion_engaudio.mp3", image: "./assets/onion_photo.png"},
        ]
    }, 
});