import React from 'react';
import { Linking,StyleSheet, Text, View, Button, ScrollView, TextInput, useState, Image, FlatList, TouchableOpacity, TouchableOpacityBase } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { AsyncStorage } from 'react-native';



export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null,
            loaded: true,
            error: null,
            dataURL:null,
            stored_ing: [],
            
            
            
        }
        //AsyncStorage.clear();
        this.retrieve_saved();
        
    }
    baseURL = 'https://api.spoonacular.com/recipes/findByIngredients?'; //https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,+flour,+sugar
    ingredients = ['', '', '', '', ''];
    rec_ingredients = ['', '', '', '', ''];
    getURL = 'https://api.spoonacular.com/recipes/';
    

    recommend_recipe = () =>{
      
      var freq_arr = [];
      var ing ='';
      var visited = [];
      for(var i in this.state.stored_ing){
        console.log(this.state.stored_ing[i])

        ing = this.state.stored_ing[i];
        freq_arr[i] = 0;
        var j = i;
        
        for(j in this.state.stored_ing){
            if(ing == this.state.stored_ing[j]){
              freq_arr[i] = freq_arr[i] + 1;
            }
        }
        console.log(this.state.stored_ing.length);
        
        console.log(freq_arr);


        var rec_freq = [];
        var r = 0;
        j = 0;
        ing = '';
        for(var i in this.state.stored_ing){
          if(!this.rec_ingredients.includes(this.state.stored_ing[i])){
            if(r<5){
              this.rec_ingredients[r] = this.state.stored_ing[i];
              rec_freq[r] = freq_arr[i];
              r++;
            }
            else{
              var low ;
              for(var k in rec_freq){
                
                for(var l in rec_freq){
                  if(rec_freq[k] <= rec_freq[l] ){
                    low = rec_freq[l];
                  }
                }   
              }
              if(low !== null){
                this.rec_ingredients[low] = this.state.stored_ing[i];
                rec_freq[low] = freq_arr[i];
              }
            }
          }       
        }
        


      }

      console.log(this.rec_ingredients);

      console.log(freq_arr);
      
      console.log(this.state.stored_ing.length);
    }




    
    recommend_url= () =>{
      this.setState({ loaded: false, error: null });
      this.recommend_recipe();
        let i = 0;
        let qry = 'ingredients=';
        var x = true; //first element
        

        while (i < 5) {
            if (this.rec_ingredients[i] !== '') {
                if (x == true) {
                    qry = qry + this.rec_ingredients[i];
                    
                    
                    x = false;
                    

                }
                else {
                    qry = qry + ',+' + this.rec_ingredients[i];
                }
                
                 
                
                
            }
            i++;
        }


        let url = this.baseURL + qry + '&ranking=2&number=30&apiKey=7fab14b8039e45ff8d2d8ad94f3e3bc5';
        //let h = new Headers();
        console.log(url);
        //h.append('Authorization', 'dab1c331b016493681a18bfcc75420b3');
        //h.append('X-Client', 'Steve and Friends');

        let req = new Request(url, {
            //headers: h,
            method: 'GET'
        });

        fetch(req)
            .then(response => response.json())
            .then(this.showData)
            .catch(this.badStuff)
    }


    save_ingredients = async () =>{
        var i = 0;
        
        console.log(this.state.stored_ing);

        try {
          
            await AsyncStorage.setItem('saved_ingredients', JSON.stringify({stored_ing:this.state.stored_ing}));
              
              
            
        } catch (err) {
            console.log(err);
        }
    }

    retrieve_saved = async() =>{
        try {
           const str_ing = await AsyncStorage.getItem('saved_ingredients');
            const Str_ing = JSON.parse(str_ing);
            
            if(Str_ing !== null){
             
               
                
                this.setState({stored_ing:Str_ing.stored_ing});
                
                console.log(this.state.stored_ing);
                this.recommend_recipe();
              
                
            }

            //AsyncStorage.getItem('saved_ingredients', (error, result) => {
            //this.setState({ stored_ing: JSON.parse(result) }, function () {   });});
            
            
        } catch (err) {
          
            console.log(err);
        }
    }



    getRecipeURL = (id) => {
        let qry = this.getURL;
        qry = qry +id;
        qry = qry + '/information?apiKey=7fab14b8039e45ff8d2d8ad94f3e3bc5';
        
        //console.log(qry);
        
        let url = qry;
        let req = new Request(url, {
            //headers: h,
            method: 'GET'
        });
        
        fetch(req)
            .then(response => response.json())
            .then(this.showDataURL)
    }

    getData = (ingredients) => {
        this.setState({ loaded: false, error: null });
        let i = 0;
        let qry = 'ingredients=';
        var x = true; //first element
        

        while (i < 5) {
            if (this.ingredients[i] !== '') {
                if (x == true) {
                    qry = qry + this.ingredients[i];
                    
                    
                    x = false;
                    

                }
                else {
                    qry = qry + ',+' + this.ingredients[i];
                }
                
                  this.state.stored_ing.push(this.ingredients[i]);
                console.log("pushed :- " + this.ingredients[i]);
                
                
            }
            i++;
        }
        this.save_ingredients();


        let url = this.baseURL + qry + '&ranking=2&number=30&apiKey=7fab14b8039e45ff8d2d8ad94f3e3bc5';
        //let h = new Headers();
        console.log(url);
        //h.append('Authorization', 'dab1c331b016493681a18bfcc75420b3');
        //h.append('X-Client', 'Steve and Friends');

        let req = new Request(url, {
            //headers: h,
            method: 'GET'
        });

        fetch(req)
            .then(response => response.json())
            .then(this.showData)
            .catch(this.badStuff)
    }
    showData = (data) => {
        this.setState({ loaded: true, data });
        console.log(data);
    }

    showDataURL = (data) => {
        this.setState({ dataURL: data });
        //console.log(data.sourceUrl);
        //console.log(data.title);
        //console.log(data.id);
        //console.log(data.image);
        
        Linking.openURL(data.sourceUrl);


    }
    badStuff = (err) => {
        this.setState({ loaded: true, error: err.message });
    }
    componentDidMount() {
        //this.getData();
        //geolocation -> fetch
    }

    renderItem = ({item}) =>{
        
    }
    
    render() {
        return (
            <View style={{backgroundColor:'#AAA'}}><Text style={styles.HeaderText}>Food Recipe Generator</Text>
            <ScrollView style={{alignContent:'center', backgroundColor:'#DDD'}}>
                {this.state.stored_ing.length > 0 && (
                  <Button title='Cant Decide? Here are a few recipes recommended just for you' onPress={this.recommend_url}></Button>
                )}
                 
               
                <ScrollView style={{margin:20, backgroundColor:'#FEE',marginTop:0,marginBottom:0}}>
                <Text style={[styles.text]}>Enter Ingredient 1 </Text>
                <TextInput style={styles.input} placeholder='e.g butter' onChangeText={(val) => this.ingredients[0] = (val)} />

                <Text style={styles.text}>Enter Ingredient 2 </Text>
                <TextInput style={styles.input} placeholder='e.g butter' onChangeText={(val) => this.ingredients[1] = (val)} />

                <Text style={styles.text}>Enter Ingredient 3 </Text>
                <TextInput style={styles.input} placeholder='e.g butter' onChangeText={(val) => this.ingredients[2] = (val)} />

                <Text style={styles.text}>Enter Ingredient 4 </Text>
                <TextInput style={styles.input} placeholder='e.g butter' onChangeText={(val) => this.ingredients[3] = (val)} />

                <Text style={styles.text}>Enter Ingredient 5</Text>
                <TextInput style={styles.input} placeholder='e.g butter' onChangeText={(val) => this.ingredients[4] = (val)} />
                    
                <Button style={{margin:20}} title="Get Recipes"
                    onPress={this.getData} />
                {this.state.error && (
                    <Text style={styles.err}>{this.state.error}</Text>
                )}
            </ScrollView>
                {!this.state.loaded && (
                    <Text style={{alignSelf:'center'}}>LOADING</Text>
                )}
                {this.state.data && this.state.data.length > 0 && (
                    this.state.data.map (id =>(

                        <View style={  styles.container } >
                            
                                <Text key={id} style={styles.HText}>{id.title}</Text>
                                <TouchableOpacity onPress={() => this.getRecipeURL(id.id)}>
                                <Image  style={styles.image} source={{uri:id.image}}></Image>
                                <Text style={styles.text}>Additional Ingredients</Text>

                                {id && id.missedIngredients.length > 0 && (
                                    id.missedIngredients.map(missedIngredients =>(
                                        <Text  style={styles.text}>
                                        <Image  style={styles.image_small} source={{uri:missedIngredients.image}}></Image>
                                        <Text style={styles.text}>{missedIngredients.original}</Text>
                                        </Text> 
                                    ))
                                        
                                    
                                )}

                                </TouchableOpacity>  
                        </View>
                    ))
                )}
                
            </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        
        justifyContent: 'space-around',
        borderBottomWidth:1,
        borderTopWidth:3,
        backgroundColor:'#FFF',
        alignSelf:'center',
        margin:20
        

    },
    HText:{
        color: '#377',
        fontWeight: "bold",
        fontSize: 24,
        alignSelf: 'center',
        borderBottomWidth:1,
        borderStyle:'dotted'
        
    },
    text: {
        color: '#555',
        fontSize: 18,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignSelf:'center'
    },
    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        alignSelf:'center',
        width: 200
    },
    image:{
        width:400,
        height:250,
        paddingBottom:10

    },
    image_small:{
        width:100,
        height:80
    },
    HeaderText:{
        color: 'black',
        fontWeight: "bold",
        fontSize: 28,
        alignSelf: 'center',
       
        height:40,
        
        marginTop:30,
        
        
    },
    err:{
        alignSelf:'center',
        color:'red',
        fontSize:18,
        fontWeight:'bold'
    }
});


