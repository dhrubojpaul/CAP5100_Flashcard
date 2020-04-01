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

var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

var getRandomInt = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var findObjectByID = function(asset, id){
    var object = asset.find(function(item){
        return item.id == id;
    });
    //return JSON.parse(JSON.stringify(object));  
    return object;
}

var play = function(id){
    document.getElementById(id).play();
}

Vue.component("quiz", {
    template: `
    <v-container>
    <v-card>
        <v-toolbar color="indigo" dark >
            <v-toolbar-title>{{countdown}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>Score: {{score.right + " out of " + score.total}}</v-toolbar-title>
        </v-toolbar>

        <v-card class="pa-3" flat tile>
        <v-row justify="center" align="center">
            <v-col cols=12 md=12 sm=12>
            <div align=center>
                <v-card tile height=110px @click="play('word')" flat>
                    <v-card flat tile v-if="current.type == 2"><img :src="current.word.image" height=60px></img></v-card>
                    <v-card flat tile class="display-1 font-weight-black" height=60px v-if="current.type==1">{{current.word.chn}}</v-card>
                    <v-card flat tile class="headline font-weight-medium" height=50px>{{current.type==1 ? current.word.pinyin : current.word.eng}}</v-card>
                    <audio autoplay id="word" :src="current.type == 1 ? current.word.chnaudio : current.word.engaudio"></audio>
                </v-card>
            </div>
            </v-col>
        </v-row>
        </v-card>

        <div class="teal darken-2 text-center">
            <span class="white--text">{{instruction}}</span>
        </div>  

        <v-card class="pa-6" flat>
        <v-row justify="center" align="center">
            <v-col cols=12 md=3 sm=6 v-for="(option,optionIndex) in current.options">
            <div align=center>
                <v-card tile :disabled="(current.hint && !values.isHinted) || values.isSubmitted" @click="clickOnOption(option.id)" 
                        :color=color[optionIndex] height=120px>
                        <v-card height=100px flat>
                            <v-card tile width=115px class="pa-2" flat>{{current.type == 1 ? option.eng : option.chn}}</v-card>
                            <v-card tile width=130px class="pa-2" flat v-if="current.type == 2">{{option.pinyin}}</v-card>
                            <v-card tile class="pa-0"  flat v-if="current.type == 1"><img :src="option.image" height=54px></img></v-card>
                            <audio :src="current.type == 1 ? option.engaudio : option.chnaudio" :id="option.id"></audio>
                        </v-card>
                </v-card>
            </div>
            </v-col>
        </v-row>
        </v-card>

        <v-btn block v-if="values.role==1 && values.selected && !values.isSubmitted && !values.isHinted" @click="assist">Assist</v-btn>
        <v-btn block v-if="values.role==2 && values.selected && !values.isSubmitted && values.isHinted" @click="submit">Submit</v-btn>
        <v-btn block v-if="values.isSubmitted && values.selected && currentIndex<39" @click="next">Next</v-btn>
        <v-btn block disabled flat v-if="values.isSubmitted && values.selected && currentIndex>=39" >Quiz Completed</v-btn>
    </v-card>
    </v-container>
    `,
    data(){
        return{
            duration:600,
            score: {right:0,wrong:0,total:0},
            countdown: undefined,
            currentIndex: 0,
            current: {},
            values: {
                selected: undefined,
                role: undefined, //submitter 1 hinter 2
                isSubmitted: undefined,
                isHinted: undefined
            },
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
            questions: [
                //question, options, type, hint
                //type can be chinese->english(1) or english->chinese(2)
                //if there is no hint, that means player is the hinter
                {q:1,o:[3,1,6,10], t:1, h:6},//1
                {q:2,o:[1,5,2,4], t:1, h:2},
                {q:3,o:[7,9,5,3], t:1, h:3},
                {q:4,o:[4,10,8,1], t:1, h:10},//2
                {q:5,o:[6,5,2,9], t:1, h:5},
                {q:6,o:[7,10,3,6], t:1, h:6},
                {q:7,o:[7,1,9,5], t:1, h:7},
                {q:8,o:[10,8,3,4], t:1, h:3},//3
                {q:9,o:[1,5,6,9], t:1, h:1},//4
                {q:10,o:[10,7,3,4], t:1, h:10},
    
                {q:1,o:[3,1,6,10], t:1, h:1},
                {q:2,o:[1,5,2,4], t:1, h:2},
                {q:3,o:[7,9,5,3], t:1, h:3},
                {q:4,o:[4,10,8,1], t:1, h:8},//5
                {q:5,o:[6,5,2,9], t:1, h:5},
                {q:6,o:[7,10,3,6], t:1, h:6},
                {q:7,o:[7,1,9,5], t:1, h:7},
                {q:8,o:[10,8,3,4], t:1, h:8},
                {q:9,o:[1,5,6,9], t:1, h:9},
                {q:10,o:[10,7,3,4], t:1, h:10},
    
                {q:1,o:[3,1,6,10], t:2, h:1},
                {q:2,o:[1,5,2,4], t:2, h:2},
                {q:3,o:[7,9,5,3], t:2, h:3},
                {q:4,o:[4,10,8,1], t:2, h:4},
                {q:5,o:[6,5,2,9], t:2, h:5},
                {q:6,o:[7,10,3,6], t:2, h:10},//6
                {q:7,o:[7,1,9,5], t:2, h:7},
                {q:8,o:[10,8,3,4], t:2, h:8},
                {q:9,o:[1,5,6,9], t:2, h:9},
                {q:10,o:[10,7,3,4], t:2, h:10},
    
                {q:1,o:[3,1,6,10], t:2, h:1},
                {q:2,o:[1,5,2,4], t:2, h:5},//7
                {q:3,o:[7,9,5,3], t:2, h:9},//8
                {q:4,o:[4,10,8,1], t:2, h:4},
                {q:5,o:[6,5,2,9], t:2, h:5},
                {q:6,o:[7,10,3,6], t:2, h:6},
                {q:7,o:[7,1,9,5], t:2, h:7},
                {q:8,o:[10,8,3,4], t:2, h:8},
                {q:9,o:[1,5,6,9], t:2, h:9},
                {q:10,o:[10,7,3,4], t:2, h:10},
            ]
        }
    },
    computed: {
        instruction: function(){
            if (this.current.hint){
                if (this.values.isHinted){
                    if(this.values.isSubmitted){
                        return "You have submitted."
                    } else {
                        return "Choose correct answer and submit."
                    }
                } else {
                    return "Wait for your partner to assist."
                }
            } else {
                if (this.values.isHinted){
                    if(this.values.isSubmitted){
                        return "Partner has submitted."
                    } else {
                        return "Wait for your partner to submit."
                    }
                } else {
                    return "Choose correct answer and assist."
                }
            }
        },
        color: function(){
            var hintColor = "#aed1ee", selectedColor = "#659ac6", incorrectColor = "#f1a4a4", correctColor = "#95b68f";
            var tempColor = [];
            var currentOptions = [];
            currentOptions = this.current.options;

            if(this.current.hint){
                for(var i= 0; i<4; i++){
                    if(currentOptions[i].id == this.current.hint && this.values.isHinted){
                        tempColor[i] = hintColor;
                    }
                    if(currentOptions[i].id == this.values.selected && currentOptions[i].id != this.current.hint){
                        tempColor[i] = selectedColor;
                    }
                    if(currentOptions[i].id == this.values.selected && this.values.isSubmitted && this.values.selected != this.current.word.id){
                        tempColor[i] = incorrectColor;
                    }
                    if(this.values.isSubmitted && currentOptions[i].id == this.current.word.id){
                        tempColor[i] = correctColor;
                    }
                }
            } else{

            }
            return tempColor;
        },
    },
    methods: {
        clickOnOption: function(id){
            this.values.selected = id;
            play(id);
        },
        play: function(id){
            play(id);
        },
        init: function(){
            shuffleArray(this.questions);
            this.setup(this.currentIndex);
        },
        setup: function(qIndex){
            this.reset();
            this.current = this.setCurrent(qIndex,this.questions,this.asset);
        },
        reset: function(){
            this.values = {selected: undefined, role: undefined, isSubmitted: undefined, isHinted: undefined};
        },
        setCurrent: function(qIndex, questions, asset){
            var current = {};
            current.qIndex = qIndex;
            current.type = questions[qIndex].t;
            current.hint = questions[qIndex].h;
            current.autoSubmittedOption = questions[qIndex].s;
            current.word = findObjectByID(asset, questions[qIndex].q);
            current.options = [];
            questions[qIndex].o.forEach(function(item,index){
                current.options.push(findObjectByID(asset, item));
            });

            this.values.role = questions[qIndex].h ? 2 : 1;
            if(current.hint){
                this.startAssistCountdown();
            }

            return current;
        },
        assist: function(){
            this.values.isHinted = true;
            this.startSubmitCountdown();
        },
        autoHint: function(){
            this.values.isHinted = true;
            this.values.selected = this.current.hint;
        },
        startAssistCountdown: function(){
            var component = this;
            setTimeout(function(){
                component.autoHint();
            },getRandomInt(5000,8000));
        },
        autoSubmit: function(){
            this.values.selected = this.current.autoSubmittedOption;
            this.values.isSubmitted = true;
            if(this.values.selected == this.current.word.id){this.score.right++;}
            else{this.score.wrong++;}
            this.score.total++;
        },
        startSubmitCountdown: function(){
            var component = this;
            setTimeout(function(){
                component.autoSubmit();
            },3000);
        },
        submit: function(){
            this.values.isSubmitted = true;

            if(this.values.selected == this.current.word.id){this.score.right++;}
            else{this.score.wrong++;}
            this.score.total++;
        },
        next: function(){
            this.currentIndex++;
            this.setup(this.currentIndex);
        },
    },
    mounted(){
        setCountdown(this);
        this.init();
    },
});

var vue = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
});