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

var findObjectByID = function(asset, id){
    var object = asset.find(function(item){
        return item.id == id;
    });
    //return JSON.parse(JSON.stringify(object));  
    return object;
}

Vue.component("quiz", {
    template: `
    <v-card-text>
        <v-toolbar color="indigo" dark >
            <v-toolbar-title>{{countdown}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title>Score: {{score}}</v-toolbar-title>
        </v-toolbar>
        <br/>
        <v-simple-table dense>
            <tbody>
                <tr>
                    <td>{{current.type==1 ? current.word.chn : current.word.eng}}</td>
                    <!--<td><img height="100px" :src="current.word.image"></img></td>-->
                    <td><audio controls autoplay :src="current.type == 1 ? current.word.chnaudio : current.word.engaudio"></audio></td>
                </tr>
            </tbody>
        </v-simple-table>

        <h3>{{instruction}}</h3>

        <v-simple-table dense>
            <tbody>
                <v-radio-group v-model="values.selected" :readonly="(current.hint && !values.isHinted) || values.isSubmitted">
                    <tr v-for="option in current.options">
                        <td><v-radio :value=option.id></v-radio></td>
                        <td>{{current.type == 1 ? option.eng : option.chn}}</td>
                        <td><img :src="option.image" height=54px></img></td>
                        <td><audio controls :src="current.type == 1 ? option.engaudio : option.chnaudio"></audio></td>
                        <td v-if="(option.id == values.selected || option.id == current.word.id) && values.isSubmitted">
                            {{current.word.id == option.id ? "Correct" : "Incorrect"}}
                        </td>
                    </tr>
                </v-radio-group>
            </tbody>
        </v-simple-table>
        <v-btn block v-if="values.role==1 && values.selected && !values.isSubmitted && !values.isHinted" @click="assist">Assist</v-btn>
        <v-btn block v-if="values.role==2 && values.selected && !values.isSubmitted && values.isHinted" @click="submit">Submit</v-btn>
        <v-btn block v-if="values.isSubmitted && values.selected && currentIndex<39" @click="next">Next</v-btn>
        <v-btn block disabled flat v-if="values.isSubmitted && values.selected && currentIndex>=39" >Quiz Completed</v-btn>
    </v-card-text>
    `,
    data(){
        return{
            duration:600,
            score: 0,
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
            ],
            questions: [
                //question, options, type, hint
                //type can be chinese->english(1) or english->chinese(2)
                //if there is no hint, that means player is the hinter
                {q:1,o:[3,1,6,10], t:1, h:1},
                {q:2,o:[1,5,2,4], t:1, s:2},
                {q:3,o:[7,9,5,3], t:1, h:3},
                {q:4,o:[4,10,8,1], t:1, s:4},
                {q:5,o:[6,5,2,9], t:1, h:5},
                {q:6,o:[7,10,3,6], t:1, s:6},
                {q:7,o:[7,1,9,5], t:1, h:7},
                {q:8,o:[10,8,3,4], t:1, s:8},
                {q:9,o:[1,5,6,9], t:1, h:9},
                {q:10,o:[10,7,3,4], t:1, s:10},
    
                {q:1,o:[3,1,6,10], t:1, s:1},
                {q:2,o:[1,5,2,4], t:1, h:2},
                {q:3,o:[7,9,5,3], t:1, s:3},
                {q:4,o:[4,10,8,1], t:1, h:4},
                {q:5,o:[6,5,2,9], t:1, s:5},
                {q:6,o:[7,10,3,6], t:1, h:6},
                {q:7,o:[7,1,9,5], t:1, s:7},
                {q:8,o:[10,8,3,4], t:1, h:8},
                {q:9,o:[1,5,6,9], t:1, s:9},
                {q:10,o:[10,7,3,4], t:1, h:10},
    
                {q:1,o:[3,1,6,10], t:2, h:1},
                {q:2,o:[1,5,2,4], t:2, s:2},
                {q:3,o:[7,9,5,3], t:2, h:3},
                {q:4,o:[4,10,8,1], t:2, s:4},
                {q:5,o:[6,5,2,9], t:2, h:5},
                {q:6,o:[7,10,3,6], t:2, s:6},
                {q:7,o:[7,1,9,5], t:2, h:7},
                {q:8,o:[10,8,3,4], t:2, s:8},
                {q:9,o:[1,5,6,9], t:2, h:9},
                {q:10,o:[10,7,3,4], t:2, s:10},
    
                {q:1,o:[3,1,6,10], t:2, s:1},
                {q:2,o:[1,5,2,4], t:2, h:2},
                {q:3,o:[7,9,5,3], t:2, s:3},
                {q:4,o:[4,10,8,1], t:2, h:4},
                {q:5,o:[6,5,2,9], t:2, s:5},
                {q:6,o:[7,10,3,6], t:2, h:6},
                {q:7,o:[7,1,9,5], t:2, s:7},
                {q:8,o:[10,8,3,4], t:2, h:8},
                {q:9,o:[1,5,6,9], t:2, s:9},
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
        }
    },
    methods: {
        init: function(){
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
            },3000);
        },
        autoSubmit: function(){
            this.values.selected = this.current.autoSubmittedOption;
            this.values.isSubmitted = true;
            if(this.values.selected == this.current.word.id){this.score++;}
        },
        startSubmitCountdown: function(){
            var component = this;
            setTimeout(function(){
                component.autoSubmit();
            },3000);
        },
        submit: function(){
            this.values.isSubmitted = true;
            if(this.values.selected == this.current.word.id){this.score++;}
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