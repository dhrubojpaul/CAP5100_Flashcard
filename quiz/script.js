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
            <template v-slot:default>
            <thead></thead>
            <tbody>
                <v-radio-group v-model="radios" mandatory>
                    <tr v-for="n in 4" :key="n">
                        <td>Word</td>
                        <td><img src="./assets/apple_photo.png" height=54px></img></td>
                        <td><audio controls src="./assets/apple_chnaudio.mp3"></audio></td>
                        <td><v-radio label="Select" :value="n"></v-radio></td>
                    </tr>
                </v-radio-group>
            </tbody>
            </template>
        </v-simple-table>
    </v-card-text>
    `,
    data(){
        return{
            duration:600,
            countdown: undefined,
            currentWord: undefined,
            suggestedWord: undefined,
            options:undefined,
            disabled: true,
            history: []
        }
    },
    methods: {
        testNextWord(vocabulary){
            this.suggestedWord = undefined;this.options=undefined;this.disabled=true;
            this.currentWord = vocabulary[getRandomInt(0,vocabulary.length)];
            this.options = [];
            var tempOptions = [];
            tempOptions.push(this.currentWord);
            tempOptions[0].isCorrect = true;
            for(var i=1;i<=3;i++){
                while(!tempOptions[i]){
                    var randomIndex = getRandomInt(0,vocabulary.length);
                    if(!tempOptions.find(function(option){return option.id == randomIndex+1})){
                        tempOptions.push(vocabulary[randomIndex]);
                    } 
                }
            }
            shuffleArray(tempOptions);

            tempOptions.forEach(function(item,index){
                item.color = undefined;
            });

            var suggestedIndex = getRandomInt(0,4);
            tempOptions[suggestedIndex].isSuggested = true;
            this.suggestedWord = tempOptions[suggestedIndex];

            this.options = Array.from(tempOptions);
            this.history.push(this.currentWord.id);
            var component = this;
            setTimeout(function(){
                component.disabled = false;
                component.suggestedWord.color = "primary";
            }, getRandomInt(3000,8000));
        },
        verify(option){
            if(option.id == this.currentWord.id){
                option.color="green";
            } else {
                option.color="red";
                this.options.find(function(item){return item.isCorrect==true;}).color="green";
            }
            var component = this;
            setTimeout(function(){
                component.testNextWord(component.vocab);
            }, 5000);
        }
    },
    mounted(){
        setCountdown(this);
        //this.testNextWord(this.vocab);
    },
});

var vue = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        asset: [
            {chn:"苹果", eng:"apple", chnaudio: ""},
            {chn:"香蕉", eng:"banana"},
            {chn:"橙子", eng:"orange"},
            {chn:"草莓", eng:"strawberry"},
            {chn:"西瓜", eng:"watermelon"},
            {chn:"土豆", eng:"potato"},
            {chn:"黄瓜", eng:"cucumber"},
            {chn:"菜花", eng:"cauliflower"},
            {chn:"生菜", eng:"lettuce"},
            {chn:"洋葱", eng:"onion"}
        ]
    }, 
});