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

Vue.component("cards", {
    template: `
    <v-card-text>
        <v-toolbar color="white" flat><v-toolbar-title>{{countdown}}</v-toolbar-title></v-toolbar>
        <h1>Read Flashcards</h1>
    </v-card-text>
    `,
    data(){
        return{
            duration:10,
            countdown: undefined
        }
    },
    mounted(){
        setCountdown(this);
    },
});

Vue.component("quiz", {
    props:['vocab', 'stage'],
    template: `
    <v-card-text>
        <h1>{{countdown}}</h1><br/>
        <h3>Choose the correct translation.</h3><br/>
        <h1>{{currentWord.chn}}</h1>
        <v-btn block x-large v-for="option in options" :disabled=disabled :color=option.color
            @click="verify(option)">{{option.eng}}</v-btn>
    </v-card-text>
    `,
    data(){
        return{
            duration:60,
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
        this.testNextWord(this.vocab);
    },
});

Vue.component("assessment", {
    template: `
    <div>assessment</div>
    `
});

var vue = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        vocabulary: [
            {chn:"苹果", eng:"apple", set:1, id: 1, },
            {chn:"香蕉", eng:"banana", set:1, id: 2, },
            {chn:"芒果", eng:"mango", set:1, id: 3, },
            {chn:"橙子", eng:"orange", set:1, id: 4, },
            {chn:"草莓", eng:"strawberry", set:1, id: 5, },
            {chn:"西瓜", eng:"watermelon", set:1, id: 6, },
            {chn:"土豆", eng:"potato", set:2, id: 7, },
            {chn:"黄瓜", eng:"cucumber", set:2, id: 8, },
            {chn:"菜花", eng:"cauliflower", set:2, id: 9, },
            {chn:"茄子", eng:"eggplant", set:2, id: 10, },
            {chn:"生菜", eng:"lettuce", set:2, id: 11, },
            {chn:"洋葱", eng:"onion", set:2, id: 12, }
        ],
        stage: 1
    }, 
});